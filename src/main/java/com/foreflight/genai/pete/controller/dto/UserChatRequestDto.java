package com.foreflight.genai.pete.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Prompt provided by user")
public class UserChatRequestDto {
    @Schema(defaultValue = "How do I add an Aircraft?")
    private String message;
}
