package com.example.demo.controller;

import com.example.demo.domain.dto.TurnstileDTO;
import com.example.demo.service.TurnstileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TurnstileController {
    private final TurnstileService ts;

    @PostMapping("/turnstile")
    public ResponseEntity<?> verifyTurnstile(@RequestBody TurnstileDTO dto) {
        if (ts.verifyToken(dto)) {
            return ResponseEntity.ok(true);
        }
        else return ResponseEntity.badRequest().body("Cloudflare 검증 실패");
    }
}
