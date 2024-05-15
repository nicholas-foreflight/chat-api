package com.foreflight.genai.pete.controller;

import com.foreflight.genai.pete.controller.dto.DriverConfigurationDto;
import com.foreflight.genai.pete.service.DriverConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DriverConfigurationController {

    @Autowired
    private DriverConfigurationService driverConfigurationService;



    @PostMapping("/driver-configuration")
    public DriverConfigurationDto save(@RequestBody DriverConfigurationDto driverConfigurationDto) {
        return driverConfigurationService.save(driverConfigurationDto);
    }

    @GetMapping("/driver-configuration/{threadId}")
    public DriverConfigurationDto save(@PathVariable("threadId") String threadId) {
        return driverConfigurationService.get(threadId);
    }
}
