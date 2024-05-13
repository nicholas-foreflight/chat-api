package com.foreflight.genai.pete.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping(value ="/healthcheck")
    public String getHelloWorld() {
        return "Up";
    }
}
