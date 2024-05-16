package com.foreflight.genai.pete.controller;

import com.foreflight.genai.pete.service.IAgentService;
import com.foreflight.genai.pete.service.domain.AgentAnswer;
import com.foreflight.genai.pete.service.domain.AgentQuestion;
import com.foreflight.genai.pete.service.domain.AgentSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AgentController {

    @Autowired
    private IAgentService agentService;

    @GetMapping("/threads/{threadId}")
    public AgentSession getSession(@PathVariable(value = "threadId") String threadId) {
        return agentService.getSession(threadId);
    }

    @PostMapping("/threads")
    public AgentAnswer ask(@RequestBody AgentQuestion question,
                           @RequestParam(required = false) Boolean isDriverRunning) {
        return agentService.ask(agentService.getSession().getThreadId(), question, isDriverRunning);
    }

    @PostMapping("/threads/{threadId}")
    public AgentAnswer ask(@PathVariable(value = "threadId") String threadId,
                               @RequestParam(required = false) Boolean isDriverRunning,
                               @RequestBody AgentQuestion question) {
        return agentService.ask(threadId, question, isDriverRunning);
    }
}
