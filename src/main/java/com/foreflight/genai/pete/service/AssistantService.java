package com.foreflight.genai.pete.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.foreflight.genai.pete.client.OpenAIClient;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageRequestDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageResponseDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadRunDto;
import com.foreflight.genai.pete.client.util.ChatUtils;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.controller.dto.MessagesHistoryDto;
import com.foreflight.genai.pete.controller.dto.UserChatRequestDto;
import com.foreflight.genai.pete.service.domain.ByteArrayMultipartFile;
import com.foreflight.genai.pete.service.domain.VisionMetadata;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AssistantService {
    private static final String ASSISTANT_ID_IN_USE = "asst_IpCAAv1Hzm6Yb6wgDdQOaSeB";

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
        return runAndWait(threadId, chatRequestDto.getMessage(), ASSISTANT_ID_IN_USE);
    }

    @SneakyThrows
    public MessageDto runAndWait(@NonNull String threadId,
                                 @NonNull String message,
                                 @NonNull String assistantId) {
        return runAndWait(threadId, message, assistantId, null);
    }

    /**
     * Runs assistant, then maps json response to requested response type
     */
    @SneakyThrows
    public <T> T runAndWaitWithVision(@NonNull String threadId,
                                      @NonNull String message,
                                      @NonNull String assistantId,
                                      @NotNull VisionMetadata visionMetadata,
                                      @NotNull Class<T> responseType) {
        var response = runAndWait(threadId, message, assistantId, visionMetadata).getMessage();
        try {
            return ChatUtils.cleanJsonStringThenMap(response, responseType);
        } catch (JsonProcessingException e) {
            log.warn("Model did not provide proper json: {}", assistantId);
            return ChatUtils.failedThenMap(response, responseType);
        }
    }

    @SneakyThrows
    private MessageDto runAndWait(@NonNull String threadId,
                                 @NonNull String message,
                                 @NonNull String assistantId,
                                 VisionMetadata visionMetadata) {
        String fileId = getAFileIdIfNeeded(visionMetadata);

        openAIClient.addMessage(threadId, OpenAIThreadMessageRequestDto.builder()
                .role("user")
                .content(renderMessageContent(message, fileId))
                .build());

        OpenAIThreadRunDto run = openAIClient.createRun(threadId, OpenAIThreadRunDto.builder()
                .assistant_id(assistantId)
                .build());
        do {
            Thread.sleep(2000);//NOSONAR
            run = openAIClient.getRun(threadId, run.getId());
            if ("failed".equals(run.getStatus())) {
                throw new IllegalStateException("Model run failed");
            }
        } while (!"completed".equals(run.getStatus()));

        var response = openAIClient.getMessages(threadId);

        return MessageDto.builder()
                .threadId(threadId)
                .role("assistant")
                .message(response.getData().get(0).getContent().get(0).getText().getValue())
                .build();
    }



    public void saveThreadMetadata(String id, Map<String, Object> metadata) {
        openAIClient.saveThread(id, OpenAIThreadDto.builder()
                .metadata(metadata)
                .build());
    }


    private boolean isDriverRunning(String threadId) {
        return false; // TODO implement
    }

    private String getAFileIdIfNeeded(VisionMetadata visionMetadata) {
        String fileId = null;
        if (visionMetadata != null) {
            var response = openAIClient.uploadFile("vision", ByteArrayMultipartFile.builder()
                    .name("screenshot.png")
                    .originalFilename("screenshot.png")
                    .contentType("image/png")
                    .content(visionMetadata.getScreenshot())
                    .build());
            fileId = response.getId();
        }
        return fileId;
    }

    private List<OpenAIThreadMessageRequestDto.Content> renderMessageContent(String message, String fileId) {
        var contentText = OpenAIThreadMessageRequestDto.Content.builder()
                .type("text")
                .text(message)
                .build();

        if (fileId == null) {
            return List.of(contentText);
        }

        var contentFile = OpenAIThreadMessageRequestDto.Content.builder()
                .type("image_file")
                .image_file(OpenAIThreadMessageRequestDto.ImageFile.builder().file_id(fileId).build())
                .build();

        return List.of(contentText, contentFile);
    }
}
