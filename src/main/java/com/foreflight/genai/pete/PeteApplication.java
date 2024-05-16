package com.foreflight.genai.pete;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableFeignClients
public class PeteApplication {

	public static void main(String[] args) {
		SpringApplication.run(PeteApplication.class, args);
	}

}
