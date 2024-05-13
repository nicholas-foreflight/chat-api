package com.foreflight.genai.pete.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient("test")
public interface TestClient {

    @GetMapping(value = "/get")
    Map<String, Object> getTest();
}
