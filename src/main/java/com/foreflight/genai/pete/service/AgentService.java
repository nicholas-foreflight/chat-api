package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.service.domain.AgentAnswer;
import com.foreflight.genai.pete.service.domain.AgentQuestion;
import com.foreflight.genai.pete.service.domain.AgentSession;
import com.foreflight.genai.pete.service.domain.IAgentMessage;
import com.foreflight.genai.pete.service.domain.RawAgentResponseDto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AgentService implements IAgentService {
    private static final int MAX_RETRIES = 3;

    private final String assistantIdWithDriver;
    private final String assistantIdWithoutDriver;

    private AssistantService assistantService;
    private DriverService driverService;

    @Autowired
    public AgentService(final AssistantService assistantService,
                        final DriverService driverService,
                        @Value("${assistants.pete.how-to-with-driver}") String assistantIdWithDriver,
                        @Value("${assistants.pete.how-to-without-driver}") String assistantIdWithoutDriver) {
        this.assistantService = assistantService;
        this.driverService = driverService;

        this.assistantIdWithDriver = assistantIdWithDriver;
        this.assistantIdWithoutDriver = assistantIdWithoutDriver;
    }


    public AgentSession getSession() {
        OpenAIThreadDto thread = assistantService.getThread();
        return AgentSession.builder()
                .threadId(thread.getId())
                .metadata(thread.getMetadata())
                .messages(List.of())
                .build();
    }

    public AgentSession getSession(String threadId) {
        OpenAIThreadDto thread = assistantService.getThread(threadId);
        var history = assistantService.getChat(threadId);
        return AgentSession.builder()
                .threadId(thread.getId())
                .metadata(thread.getMetadata())
                .messages(history.getMessages().stream().map(this::mapMessageToAgentMessage).toList())
                .build();
    }

    public AgentAnswer ask(String threadId, AgentQuestion question, boolean isDriverRunning) {
        int attempts = 0;
        final String assistantId = isDriverRunning ? assistantIdWithDriver : assistantIdWithoutDriver;
        final AgentAnswer answer = AgentAnswer.builder()
                .isSuccessful(false)
                .isRunningDriver(false)
                .message("Try again I seem to have had a hiccup")
                .build();

        while (attempts <= MAX_RETRIES && !answer.isSuccessful()) {
            attempts++;
            try {
                var vision = isDriverRunning ? driverService.capture(threadId) : null;
                var response = assistantService
                        .runAndWaitWithVision(threadId, question.getMessage(), assistantId, vision, RawAgentResponseDto.class);

                if (isDriverRunning && response.isActionableInApp()) {
                    assistantService.saveThreadMetadata(threadId, Map.of("driverStatus", "RUNNING"));
                    driverService.runDriverAsync(threadId, response);
                }
                answer.setMessage(response.getMessage());
                return answer;
            } catch (IllegalStateException e) {
                log.warn("Bad response from ask(). attempt:{}, reties:{}, response:{}", attempts, MAX_RETRIES);
            }
        }
        return answer;
    }

    @SneakyThrows
    private AgentAnswer mapToAnswer(RawAgentResponseDto m) {
        return AgentAnswer.builder()
                .isSuccessful(true)
                .isRunningDriver(m.isActionableInApp())
                .message(m.getMessage())
                .build();
    }


    private IAgentMessage mapMessageToAgentMessage(MessageDto m) {
        if ("user".equals(m.getRole())) {
            return AgentQuestion.builder()
                    .message(m.getMessage())
                    .build();
        } else {
            return AgentAnswer.builder()
                    .isSuccessful(true)     // TODO get message metadata nad resolve
                    .isRunningDriver(false) // TODO get message metadata nad resolve
                    .message(m.getMessage())
                    .build();
        }
    }
}
