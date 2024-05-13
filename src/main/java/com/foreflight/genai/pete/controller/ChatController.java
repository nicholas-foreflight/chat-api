package com.foreflight.genai.pete.controller;

import com.foreflight.genai.pete.client.TestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("/chat")
public class ChatController {

    @Autowired
    private TestClient testClient;

    @GetMapping
    public Map<String, Object> getChat() {
        return testClient.getTest();
    }
}
