package com.foreflight.genai.pete.client.dto.openai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAIThreadDto {
    private String id;
    private String object;
    private Long created_at;
    private Map<String, Object> metadata;
    private Map<String, Object> tool_resources;
}
