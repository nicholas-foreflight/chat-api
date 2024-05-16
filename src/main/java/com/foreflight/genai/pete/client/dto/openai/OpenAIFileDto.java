package com.foreflight.genai.pete.client.dto.openai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAIFileDto {
    private String id;
    private String object;
    private int bytes;
    private long createdAt;
    private String filename;
    private String purpose;
}
