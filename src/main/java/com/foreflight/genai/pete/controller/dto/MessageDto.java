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
public class MessageDto {
    @Schema(examples = {"assistant", "user"})
    private String role;
    private String message;

    private String threadId;
}
