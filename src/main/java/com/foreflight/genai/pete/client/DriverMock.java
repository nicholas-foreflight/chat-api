package com.foreflight.genai.pete.client;

import com.foreflight.genai.pete.client.dto.driver.StartRequestDto;
import com.foreflight.genai.pete.client.dto.driver.SwipeRequestDto;
import com.foreflight.genai.pete.client.dto.driver.TapRequestDto;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Component
/**
 * Only used for local testing
 */
public class DriverMock {
    private final static String MOCK_SCREENSHOT = "mock-screen.png";


    public void start(URI baseUri, StartRequestDto requestBody) {
        log.info("Starting {}", baseUri);
    }


    public void stop(URI baseUri) {
        log.info("Stopping {}", baseUri);
    }


    public void status(URI baseUri) {
        log.info("Checking Status {}", baseUri);
    }


    public byte[] capture(URI baseUri) {
        log.info("Capture {}", baseUri);
        return getPngImageAsByteArray(MOCK_SCREENSHOT);
    }


    public byte[] tap(URI baseUri, TapRequestDto requestBody) {
        log.info("Tapping {} {}", baseUri, requestBody.toString());
        return getPngImageAsByteArray(MOCK_SCREENSHOT);
    }


    public byte[] swipe(URI baseUri, SwipeRequestDto requestBody) {
        log.info("Swiping {} {}", baseUri, requestBody.toString());
        return getPngImageAsByteArray(MOCK_SCREENSHOT);
    }


    public byte[] viewImagePage(URI baseUri) {
        log.info("Viewing Image {}", baseUri);
        return getPngImageAsByteArray(MOCK_SCREENSHOT);
    }


    public byte[] getWindowSize(URI baseUri) {
        log.info("Getting window size {}", baseUri);
        return getPngImageAsByteArray(MOCK_SCREENSHOT);
    }


    public Integer getPort(URI baseUri) {
        log.info("Getting port {}", baseUri);
        return baseUri.getPort();
    }


    public String getIp(URI baseUri) {
        log.info("Getting IP {}", baseUri);
        return baseUri.getHost();
    }

    @SneakyThrows
    public byte[] getPngImageAsByteArray(String resourcePath) {
        ClassPathResource classPathResource = new ClassPathResource(resourcePath);
        Path path = Paths.get(classPathResource.getURI());
        return Files.readAllBytes(path);
    }
}
