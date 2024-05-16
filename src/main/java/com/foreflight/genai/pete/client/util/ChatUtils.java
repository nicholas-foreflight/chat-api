package com.foreflight.genai.pete.client.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.SneakyThrows;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ChatUtils {

    @SneakyThrows
    public static <T> T cleanJsonStringThenMap(String dirtyJson, Class<T> clazz) {
        // Regular expression to match unwanted characters before and after JSON object
        String regex = "^[^{]*|[^}]*$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(dirtyJson);

        // Replace all unwanted characters with an empty string
        String cleanJson = matcher.replaceAll("");

        return new ObjectMapper().readValue(cleanJson, clazz);
    }
}
