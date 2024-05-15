package com.foreflight.genai.pete.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

//    private final ProxyWebSocketHandler proxyWebSocketHandler;
//
//    public WebSocketConfig(ProxyWebSocketHandler proxyWebSocketHandler) {
//        this.proxyWebSocketHandler = proxyWebSocketHandler;
//    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(proxyWebSocketHandler, "/proxy").setAllowedOrigins("*");
    }
}