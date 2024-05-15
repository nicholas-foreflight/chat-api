package com.foreflight.genai.pete.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PeteService implements IAgentService {

    @Autowired
    private AssistantService assistantService;


    public Object getSession() {
        return null;
    }

    public Object getSession(String threadId) {
        return null;
    }

    public Object ask(String threadId, Object question) {
        return null;
    }
}
