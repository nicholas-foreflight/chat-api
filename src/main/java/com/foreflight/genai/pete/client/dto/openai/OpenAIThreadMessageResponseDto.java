package com.foreflight.genai.pete.client.dto.openai;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAIThreadMessageResponseDto {
    private String object;
    private List<MessageData> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageData {
        private String id;
        private String object;
        private long createdAt;
        private String assistantId;
        private String threadId;
        private String runId;
        private String role;
        private List<Content> content;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private String type;
        private Text text;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Text {
        private String value;
    }
}

