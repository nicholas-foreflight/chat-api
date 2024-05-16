package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.DriverClient;
import com.foreflight.genai.pete.client.dto.driver.TapRequestDto;
import com.foreflight.genai.pete.controller.dto.DriverConfigurationDto;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.service.domain.RawAgentInstructionDto;
import com.foreflight.genai.pete.service.domain.RawAgentResponseDto;
import com.foreflight.genai.pete.service.domain.VisionMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.foreflight.genai.pete.service.domain.VisionMetadata.Action.TAP;

@Service
public class DriverService {


    private final String assistantIdVisionTap;
    private final String assistantIdVisionSwipe;

    private AssistantService assistantService;
    private DriverClient driverClient;
    private DriverConfigurationService driverConfigurationService;

    @Autowired
    public DriverService(final AssistantService assistantService,
                        final DriverClient driverClient,
                        final DriverConfigurationService driverConfigurationService,
                        @Value("${assistants.driver.vision.tap}") String assistantIdVisionTap,
                        @Value("${assistants.driver.vision.swipe}") String assistantIdVisionSwipe) {
        this.assistantService = assistantService;
        this.driverClient = driverClient;
        this.driverConfigurationService = driverConfigurationService;

        this.assistantIdVisionTap = assistantIdVisionTap;
        this.assistantIdVisionSwipe = assistantIdVisionSwipe;
    }


    @Async
    public void runDriverAsync(String threadId, RawAgentResponseDto instructions) {
        var driverConfiguration = driverConfigurationService.get(threadId);
        byte[] imageBytes = driverClient.capture(driverConfiguration.getUri());

        for (RawAgentInstructionDto instruction : instructions.getInstructions()) {
            imageBytes = runInstruction(driverConfiguration, instruction, imageBytes);
        }
    }

    private byte[] runInstruction(DriverConfigurationDto driverConfiguration, RawAgentInstructionDto instruction, byte[] imageBytes) {
        // TODO map to Vision

        VisionMetadata.Action action = TAP;

        return switch (action) {
            case TAP -> runTap(driverConfiguration, instruction);
            case SWIPE -> runSwipe(driverConfiguration, instruction);
            case TYPE -> runType(driverConfiguration, instruction);
        };
    }

    private byte[] runTap(DriverConfigurationDto driverConfiguration, RawAgentInstructionDto instruction) {
        return driverClient.tap(driverConfiguration.getUri(), mapTap(null));
    }

    private byte[] runSwipe(DriverConfigurationDto driverConfiguration, RawAgentInstructionDto instruction) {
        return new byte[0];
    }

    private byte[] runType(DriverConfigurationDto driverConfiguration, RawAgentInstructionDto instruction) {
        return new byte[0];
    }

    private TapRequestDto mapTap(MessageDto m) {
        return TapRequestDto.builder().x(100).y(100).build();
    }
}