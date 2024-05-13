package com.foreflight.genai.pete.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.SpecVersion;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI(SpecVersion.V31)
                .info(new Info()
                        .title("Pete API")
                        .description("""
                                ## Overview
                                
                                ## Chat
                              
                                ### Contact
                                """)
                        .version("1-SNAPSHOT")
                        .contact(new Contact()
                                .name("#hackathon in Slack")
                                .url("https://foreflight.slack.com/archives/C03MA7LRMQW")))
                .servers(Collections.singletonList(new Server()
                        .url("/")
                        .description("Default Server URL")))
                .externalDocs(new ExternalDocumentation()
                        .url("https://foreflight.atlassian.net/wiki/spaces/SyncNG/overview?homepageId=3671097773")
                        .description("Sync Home in Confluence"));
    }
}
