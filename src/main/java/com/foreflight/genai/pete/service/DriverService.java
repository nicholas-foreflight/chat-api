package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.client.DriverClient;
import com.foreflight.genai.pete.client.dto.driver.SwipeRequestDto;
import com.foreflight.genai.pete.client.dto.driver.TapRequestDto;
import com.foreflight.genai.pete.controller.dto.DriverConfigurationDto;
import com.foreflight.genai.pete.service.domain.RawAgentInstructionDto;
import com.foreflight.genai.pete.service.domain.RawAgentResponseDto;
import com.foreflight.genai.pete.service.domain.VisionMetadata;
import feign.RetryableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.foreflight.genai.pete.service.domain.VisionMetadata.Action.TAP;

@Slf4j
@Service
public class DriverService {


    private final String assistantIdVisionTap;
    private final String assistantIdVisionSwipe;

    private AssistantService assistantService;

    private DriverClient driverClient;
//    private DriverMock driverClient;

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

        var visionMetadata = VisionMetadata.builder()
                .action(TAP)
                .screenshot(driverClient.capture(driverConfiguration.getUri()))
                .build();

        for (RawAgentInstructionDto instruction : instructions.getInstructions()) {
            // TODO make smarter for stepping back and allow AI to be curious
            visionMetadata.setContext(instruction.getAction());
            var screenshot = runInstruction(driverConfiguration, instruction, visionMetadata, 3);
            visionMetadata.setScreenshot(screenshot);
        }
    }

    private byte[] runInstruction(DriverConfigurationDto driverConfiguration,
                                  RawAgentInstructionDto instruction,
                                  VisionMetadata visionMetadata,
                                  int retries) {
        if (retries <= 0) {
            return visionMetadata.getScreenshot();
        }
        try {
            return switch (visionMetadata.getAction()) {
                case TAP -> runTap(driverConfiguration, instruction, visionMetadata);
                case SWIPE -> runSwipe(driverConfiguration, instruction, visionMetadata);
                case TYPE -> runType(driverConfiguration, instruction, visionMetadata);
            };
        } catch (RetryableException e) {
            retries -= 1;
            log.warn("Retryable error from Driver: ");
            return runInstruction(
                    driverConfiguration,
                    instruction,
                    visionMetadata,
                    retries);
        }
    }

    private byte[] runTap(DriverConfigurationDto driverConfiguration,
                          RawAgentInstructionDto instruction,
                          VisionMetadata visionMetadata) {
        var request = assistantService.runAndWaitWithVision(
                assistantService.getThread().getId(),
                instruction.getAction(),
                assistantIdVisionTap,
                visionMetadata,
                TapRequestDto.class);

        return driverClient.tap(driverConfiguration.getUri(), request);
    }

    private byte[] runSwipe(DriverConfigurationDto driverConfiguration,
                            RawAgentInstructionDto instruction,
                            VisionMetadata visionMetadata) {
        var request = assistantService.runAndWaitWithVision(
                assistantService.getThread().getId(),
                instruction.getAction(),
                assistantIdVisionSwipe,
                visionMetadata,
                SwipeRequestDto.class);

        return driverClient.swipe(driverConfiguration.getUri(), request);
    }

    private byte[] runType(DriverConfigurationDto driverConfiguration,
                           RawAgentInstructionDto instruction,
                           VisionMetadata visionMetadata) {
        var request = assistantService.runAndWaitWithVision(
                assistantService.getThread().getId(),
                instruction.getAction(),
                assistantIdVisionSwipe, // TODO Add type model
                visionMetadata,
                SwipeRequestDto.class); // TODO Add type type

        return driverClient.swipe(driverConfiguration.getUri(), request);
    }

    public VisionMetadata capture(String threadId) {
        var screenshot = driverClient.capture(driverConfigurationService.get(threadId).getUri());
        return VisionMetadata.builder().screenshot(screenshot).build();
    }
}