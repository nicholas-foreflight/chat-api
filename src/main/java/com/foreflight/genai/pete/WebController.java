package com.foreflight.genai.pete;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = { "/", "/project", "/documentation-chat", "/documentation-driver", "/thread/**" })
    public String forward() {
        return "forward:/index.html";
    }
}