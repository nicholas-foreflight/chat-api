package com.foreflight.genai.pete.service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentQuestion implements IAgentMessage {
    @Schema(defaultValue = "How do I add an Aircraft?")
    private String message;

    @Schema(defaultValue = "user")
    @Override
    public String getRole() {
        return "user";
    }
}
