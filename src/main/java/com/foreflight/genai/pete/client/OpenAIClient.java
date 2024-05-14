package com.foreflight.genai.pete.client;

import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageResponseDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadRunDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient("openai")
public interface OpenAIClient {

    @PostMapping("/v1/threads")
    OpenAIThreadDto createThread();

    @PostMapping("/v1/threads/{threadId}/messages")
    Map<String, Object> addMessage(@PathVariable("threadId") String threadId, @RequestBody OpenAIThreadMessageDto message);

    @PostMapping("/v1/threads/{threadId}/runs")
    OpenAIThreadRunDto createRun(@PathVariable("threadId") String threadId, @RequestBody OpenAIThreadRunDto run);

    @GetMapping("/v1/threads/{threadId}/messages")
    OpenAIThreadMessageResponseDto getMessages(@PathVariable("threadId") String threadId);

    @GetMapping("/v1/threads/{threadId}/runs/{runId}")
    OpenAIThreadRunDto getRun(@PathVariable("threadId") String threadId, @PathVariable("runId") String runId);
}
