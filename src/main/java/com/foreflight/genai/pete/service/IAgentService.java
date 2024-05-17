package com.foreflight.genai.pete.service;

import com.foreflight.genai.pete.service.domain.AgentAnswer;
import com.foreflight.genai.pete.service.domain.AgentQuestion;
import com.foreflight.genai.pete.service.domain.AgentSession;

public interface IAgentService {

    public AgentSession getSession();

    public AgentSession getSession(String threadId);

    public AgentAnswer ask(String threadId, AgentQuestion question, boolean isDriverRunning);
}
