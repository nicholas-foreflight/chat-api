package com.foreflight.genai.pete.client;

import com.foreflight.genai.pete.client.dto.openai.OpenAIFileDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageRequestDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadMessageResponseDto;
import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadRunDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@FeignClient("openai")
public interface OpenAIClient {

    @PostMapping("/v1/threads")
    OpenAIThreadDto createThread();

    @GetMapping("/v1/threads/{threadId}")
    OpenAIThreadDto getThread(@PathVariable("threadId") String threadId);

    @PostMapping("/v1/threads/{threadId}")
    void saveThread(@PathVariable("threadId") String threadId, @RequestBody OpenAIThreadDto openAIThreadDto);

    @PostMapping("/v1/threads/{threadId}/messages")
    Map<String, Object> addMessage(@PathVariable("threadId") String threadId, @RequestBody OpenAIThreadMessageRequestDto message);

    @PostMapping("/v1/threads/{threadId}/runs")
    OpenAIThreadRunDto createRun(@PathVariable("threadId") String threadId, @RequestBody OpenAIThreadRunDto run);

    @GetMapping("/v1/threads/{threadId}/messages")
    OpenAIThreadMessageResponseDto getMessages(@PathVariable("threadId") String threadId);

    @GetMapping("/v1/threads/{threadId}/runs/{runId}")
    OpenAIThreadRunDto getRun(@PathVariable("threadId") String threadId, @PathVariable("runId") String runId);

    @PostMapping(value = "/v1/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    OpenAIFileDto uploadFile(@RequestPart("purpose") String purpose, @RequestPart("file") MultipartFile file);
}
