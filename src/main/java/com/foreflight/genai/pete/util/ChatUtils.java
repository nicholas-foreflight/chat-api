package com.foreflight.genai.pete.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foreflight.genai.pete.service.domain.RawAgentResponseDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ChatUtils {

    public static <T> T cleanJsonStringThenMap(String dirtyJson, Class<T> clazz) throws JsonProcessingException {
        // Regular expression to match unwanted characters before and after JSON object
        String regex = "^[^{]*|[^}]*$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(dirtyJson);

        // Replace all unwanted characters with an empty string
        String cleanJson = matcher.replaceAll("");

        return new ObjectMapper().readValue(cleanJson, clazz);
    }

    public static <T> T failedThenMap(String response, Class<T> responseType) {
        if (responseType.equals(RawAgentResponseDto.class)) {
            return (T) RawAgentResponseDto.builder().message(response.replace("\n\n", "\n")).build();//NOSONAR
        }
        throw new NotImplementedException("Need mapping for {}", responseType.getName());
    }
}
