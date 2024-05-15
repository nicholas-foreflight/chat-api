package com.foreflight.genai.pete.client.dto.driver;

import lombok.Data;

@Data
public class StartRequestDto {
    private String username = "pilotpete@foreflight.com";
    private String password = "gofly123";
    private String environment = "QA";
    private String deviceUdid = "00008110-0006150A1E03801E";
    private String bundleId = "com.foreflight.ForeFlightMobile";
}