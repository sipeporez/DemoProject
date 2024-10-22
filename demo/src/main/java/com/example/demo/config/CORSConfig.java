package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/login")
                .allowCredentials(true)
                .exposedHeaders(HttpHeaders.AUTHORIZATION)
                .allowedMethods(
                        HttpMethod.POST.name()
                )
                .allowedOrigins(
                        "http://localhost:8080",
                        "http://localhost:3000"
                );
    }
}
