package com.foreflight.genai.pete.controller;

import com.foreflight.genai.pete.service.IAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AgentController {

    @Autowired
    private IAgentService agentService;


}
