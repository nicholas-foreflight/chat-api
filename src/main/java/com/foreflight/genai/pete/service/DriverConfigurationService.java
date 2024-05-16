package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.DriverClient;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.controller.dto.DriverConfigurationDto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Map;

@Slf4j
@Service
public class DriverConfigurationService {

    @Autowired
    private DriverClient driverClient;

    @Autowired
    private AssistantService assistantService;


    @SneakyThrows
    public DriverConfigurationDto save(DriverConfigurationDto driverConfigurationDto) {
        Validate.notEmpty(driverConfigurationDto.getUrl(), "Driver must have a URL");
        final var driverUri = convertToUri(driverConfigurationDto.getUrl());
        driverConfigurationDto.setUrl(driverUri.toURL().toString());

        // Validate Driver
        try {
            driverClient.status(driverUri);
        } catch (Exception e) {
            log.warn("Cannot use requested driver", e);
            throw new IllegalArgumentException("Bad Driver URL. Driver either doesn't exists, in use, or broken.");
        }

        // Get Thread
        OpenAIThreadDto threadDto;
        if (driverConfigurationDto.getThreadId() == null) {
            threadDto = assistantService.getThread();
        } else {
            threadDto = assistantService.getThread(driverConfigurationDto.getThreadId());
        }

        assistantService.saveThreadMetadata(threadDto.getId(), Map.of("driverUri", driverUri));
        return driverConfigurationDto;
    }

    private String trimUrl(String url) {
        return url.trim().replace("http://","").replace("https://","");
    }

    public DriverConfigurationDto get(String threadId) {
        var url = "10.122.0.151:8182"; // ofNullable(assistantService.getThread(threadId).getMetadata().get("driverUri")).orElse("").toString();
        return DriverConfigurationDto.builder().threadId(threadId).url(url).uri(convertToUri(url)).build();
    }

    private URI convertToUri(String s) {
        return URI.create("http://" + trimUrl(s));
    }
}
