package com.foreflight.genai.pete.client.dto.openai;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class OpenAIThreadMessageDto {
    private String role;
    private String content;
}
