package com.foreflight.genai.pete.service.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

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

    @Override
    public String toString() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            log.warn("Cannot convert VisionMetadata object toString: ", e);
            throw new IllegalStateException("Issue serializing vision object.");
        }
    }

    public Map<String, String> toMap() {
        Map<String, String> resultMap = new HashMap<>();
        Field[] fields = this.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true);//NOSONAR
            try {
                Object value = field.get(this);
                resultMap.put(field.getName(), value == null ? "null" : value.toString());
            } catch (IllegalAccessException e) {
                log.warn("Cannot convert VisionMetadata object toMap: ", e);
                throw new IllegalStateException("Issue serializing vision object.");
            }
        }

        return resultMap;
    }

    public enum Action {
        TAP,
        SWIPE,
        TYPE
    }
}
