package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.controller.dto.UserChatRequestDto;
import com.foreflight.genai.pete.service.domain.AgentAnswer;
import com.foreflight.genai.pete.service.domain.AgentQuestion;
import com.foreflight.genai.pete.service.domain.AgentSession;
import com.foreflight.genai.pete.service.domain.IAgentMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.apache.commons.lang3.BooleanUtils.isTrue;

@Slf4j
@Service
public class PeteService implements IAgentService {
    private static final int MAX_RETRIES = 3;

    @Autowired
    private AssistantService assistantService;

    @Autowired
    private PromptService promptService;


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

    public AgentAnswer ask(String threadId, AgentQuestion question, Boolean isDriverRunning) {
        int attempts = 0;
        String prompt = getFirstAttemptPrompt(threadId, question, isDriverRunning);
        final AgentAnswer answer = AgentAnswer.builder()
                .isSuccessful(false)
                .message("Try again I seem to have had a hiccup")
                .build();

        while (attempts <= MAX_RETRIES && !answer.isSuccessful()) {
            attempts++;

            try {
                var response = assistantService.postChat(UserChatRequestDto.builder()
                        .message(prompt)
                        .build());

                answer.setSuccessful(true);
                // TODO add filter/determine if driver calls are made, then serialize.
                answer.setMessage(response.getMessage());
            } catch (IllegalStateException e) {
                log.warn("Bad response from ask(). attempt:{}, reties:{}", attempts, MAX_RETRIES);
            }
        }

        return answer;
    }

    private String getFirstAttemptPrompt(String threadId, AgentQuestion question, Boolean isDriverRunning) {
        // TODO use threadId to know if first ever message, or we are resuming. So, get num of messages.
        return promptService.buildAssistantHowToPrompt(isTrue(isDriverRunning), question.getMessage());
    }


    private IAgentMessage mapMessageToAgentMessage(MessageDto m) {
        if ("user".equals(m.getRole())) {
            return AgentQuestion.builder().build();
        } else {
            return AgentAnswer.builder().build();
        }
    }
}
