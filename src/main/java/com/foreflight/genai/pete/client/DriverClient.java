package com.foreflight.genai.pete.client;

import com.foreflight.genai.pete.client.dto.driver.StartRequestDto;
import com.foreflight.genai.pete.client.dto.driver.SwipeRequestDto;
import com.foreflight.genai.pete.client.dto.driver.TapRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.net.URI;

@FeignClient("driver")
public interface DriverClient {

    @PostMapping("/start")
    void start(URI baseUri, @RequestBody StartRequestDto requestBody);

    @PostMapping("/stop")
    void stop(URI baseUri);

    @GetMapping("/status")
    void status(URI baseUri);

    @GetMapping("/capture")
    byte[] capture(URI baseUri);

    @PostMapping("/tap")
    byte[] tap(URI baseUri, @RequestBody TapRequestDto requestBody);

    @PostMapping("/swipe")
    byte[] swipe(URI baseUri, @RequestBody SwipeRequestDto requestBody);

    @GetMapping("/")
    byte[] viewImagePage(URI baseUri);

    @GetMapping("/window")
    byte[] getWindowSize(URI baseUri);

    @GetMapping("/port")
    Integer getPort(URI baseUri);

    @GetMapping("/ip")
    String getIp(URI baseUri);
}