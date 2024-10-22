package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowCredentials(true)
                .exposedHeaders(HttpHeaders.AUTHORIZATION)
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedOrigins("http://demoproject-react.s3-website-ap-northeast-1.amazonaws.com");

        registry.addMapping("/login")
                .allowCredentials(true)
                .exposedHeaders(HttpHeaders.AUTHORIZATION)
                .allowedMethods("POST")
                .allowedOrigins(
                        "http://localhost:8080",
                        "http://localhost:3000"
                );
    }
}
