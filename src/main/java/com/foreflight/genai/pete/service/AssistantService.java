package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.OpenAIClient;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageResponseDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadRunDto;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.controller.dto.MessagesHistoryDto;
import com.foreflight.genai.pete.controller.dto.UserChatRequestDto;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AssistantService {
    private static final String ASSISTANT_ID_PILOT_PETE_3_5 = "asst_PHuD00M9tkqC9NYKwgkXlTVo"; // gpt-3.5-turbo //NOSONAR
    private static final String ASSISTANT_ID_PILOT_PETE_4_o = "asst_OzdhCYLi3ww5v0BIR2kxKnHJ"; // gpt-4o-2024-05-13 //NOSONAR
    private static final String ASSISTANT_ID_IN_USE = ASSISTANT_ID_PILOT_PETE_3_5;

    @Autowired
    private PromptService promptService;

    @Autowired
    private OpenAIClient openAIClient;


    public OpenAIThreadDto getThread() {
        return openAIClient.createThread();
    }

    public OpenAIThreadDto getThread(String threadId) {
        return openAIClient.getThread(threadId);
    }

    /*
     * For first time request
     */
    public MessageDto postChat(@NonNull UserChatRequestDto chatRequestDto) {
        return postChat(getThread().getId(), chatRequestDto);
    }

    public MessagesHistoryDto getChat(String threadId) {
        var response = openAIClient.getMessages(threadId);
        List<MessageDto> messages = new ArrayList<>();

        for(OpenAIThreadMessageResponseDto.MessageData message : response.getData()) {
            messages.add(
                    MessageDto.builder()
                            .threadId(threadId)
                            .role(message.getRole())
                            .message(message.getContent().get(0).getText().getValue())
                            .build());
        }

        return MessagesHistoryDto.builder().messages(messages).build();
    }

    @SneakyThrows
    public MessageDto postChat(@NonNull String threadId, @NonNull  UserChatRequestDto chatRequestDto) {

        openAIClient.addMessage(threadId, OpenAIThreadMessageDto.builder()
                .role("user")
                .content(chatRequestDto.getMessage())
                .build());

        OpenAIThreadRunDto run = openAIClient.createRun(threadId, OpenAIThreadRunDto.builder()
                .assistant_id(ASSISTANT_ID_IN_USE)
                .build());
        do {
            Thread.sleep(500); //NOSONAR
            run = openAIClient.getRun(threadId, run.getId());
        } while (!"completed".equals(run.getStatus()));

        var response = openAIClient.getMessages(threadId);

        return MessageDto.builder()
                .threadId(threadId)
                .role("assistant")
                .message(response.getData().get(0).getContent().get(0).getText().getValue())
                .build();
    }

    private boolean isDriverRunning(String threadId) {
        return false;
    }

    public void saveThreadMetadata(String id, Map<String, Object> metadata) {
        openAIClient.saveThread(OpenAIThreadDto.builder()
                .id(id)
                .metadata(metadata)
                .build());
    }
}
