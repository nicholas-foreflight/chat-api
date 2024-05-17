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

    private final Integer imageHeight = 1640;
    private final Integer imageWidth = 2360;

    private Action action = Action.TAP;
    private String context;
    private byte[] screenshot;

    public enum Action {
        TAP,
        SWIPE,
        TYPE
    }
}
