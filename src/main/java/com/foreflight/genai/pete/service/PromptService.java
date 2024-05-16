package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.service.domain.VisionMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Slf4j
@Service
public class PromptService {

    private static final String PROMPT_BASE_PATH = "prompts/";

//    public String buildAssistantHowToPrompt(boolean isDriverRunning, String userPrompt) {
//        var fileName = isDriverRunning ?
//                "prompt-assistant-how-to-with-device.md"
//                : "prompt-assistant-how-to-without-device.md";
//        var replacements = Map.of("userPrompt", userPrompt);
//        return loadFileAndReplace(fileName, replacements);
//    }

    public String buildVisionAssistantGetCoordinatesClickPrompt(VisionMetadata visionMetadata) {
        var fileName ="prompt-vision-assistant-get-coordinates-tap.md";
        var replacements = Map.of("{context}",""); // visionMetadata.toMap(); // TODO
        return loadFileAndReplace(fileName, replacements);
    }

    public String buildVisionAssistantGetCoordinatesSwipePrompt(VisionMetadata visionMetadata) {
        var fileName ="prompt-vision-assistant-get-coordinates-tap.md";
        var replacements = Map.of("{context}",""); // visionMetadata.toMap(); // TODO
        return loadFileAndReplace(fileName, replacements);
    }


    private String loadFileAndReplace(String fileName, Map<String, String> replace) {
        try {
            ClassPathResource resource = new ClassPathResource(PROMPT_BASE_PATH + fileName);
            Path path = Paths.get(resource.getURI());
            String content = new String(Files.readAllBytes(path));

            for (Map.Entry<String, String> entry : replace.entrySet()) {
                content = content.replace("{" + entry.getKey() + "}", entry.getValue());
            }

            return content;
        } catch (IOException e) {
            log.warn("Cannot generate Prompt:", e);
            throw new IllegalStateException("Issue creating AI Prompt.");
        }
    }
}
