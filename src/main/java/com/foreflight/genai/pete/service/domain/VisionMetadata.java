package com.foreflight.genai.pete.service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@Slf4j
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class VisionMetadata {

    private Integer imageHeight;
    private Integer imageWidth;

    private Action action;
    private String context;
    private byte[] screenshot;

    public enum Action {
        TAP,
        SWIPE,
        TYPE
    }
}
