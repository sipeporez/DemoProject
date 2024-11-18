package com.example.demo.service;

import com.example.demo.domain.dto.TurnstileDTO;
import com.example.demo.exception.WrongInputException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TurnstileService {

    private final WebClient wc = WebClient.create("https://challenges.cloudflare.com/turnstile/v0/siteverify");

    public boolean verifyToken(TurnstileDTO dto) {
        try {
            String token = dto.getToken();
            String SECRET_KEY = "0x4AAAAAAA0FjcnkV1aDEn2PuNdoHzjjaoQ";
            // JSON 형식으로 요청 본문 구성
            Map<String, String> jsonbody = new HashMap<>();
            jsonbody.put("secret", SECRET_KEY);
            jsonbody.put("response", token);

            // ObjectMapper를 사용하여 Map을 JSON 문자열로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(jsonbody);

            return Boolean.TRUE.equals(wc.post()
                    .header("Content-Type", "application/json")
                    .bodyValue(json)
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(response -> response.contains("\"success\":true"))
                    .block());
        } catch (NullPointerException | JsonProcessingException e) {
            throw new WrongInputException("Turnstile 토큰 형식이 잘못 되었습니다.");
        }
    }
}
