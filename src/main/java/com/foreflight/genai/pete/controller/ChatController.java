package com.foreflight.genai.pete.controller;

import com.foreflight.genai.pete.client.dto.openai.OpenAIThreadDto;
import com.foreflight.genai.pete.controller.dto.MessageDto;
import com.foreflight.genai.pete.controller.dto.MessagesHistoryDto;
import com.foreflight.genai.pete.controller.dto.UserChatRequestDto;
import com.foreflight.genai.pete.service.AssistantService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController(value = "/chats")
public class ChatController {

    @Autowired
    private AssistantService assistantService;

    @GetMapping("/threads")
    public OpenAIThreadDto getThread() {
        return assistantService.getThread();
    }

    @PostMapping("/threads")
    public MessageDto postChat(@RequestBody UserChatRequestDto chatRequestDto) {
        return assistantService.postChat(chatRequestDto);
    }

    @PostMapping("/threads/{threadId}")
    public MessageDto postChat(@PathVariable(value = "threadId") String threadId,
                               @RequestParam(required = false) Boolean isDriverRunning,
                               @RequestBody UserChatRequestDto chatRequestDto) {
        log.info("Adding chat message 3");
        return assistantService.postChat(threadId, chatRequestDto, isDriverRunning);
    }

    @GetMapping("/threads/{threadId}")
    public MessagesHistoryDto getChat(@PathVariable(value = "threadId") String threadId) {
        return assistantService.getChat(threadId);
    }
}
