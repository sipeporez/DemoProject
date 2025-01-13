package com.example.demo.tools;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtil { // JWT 생성 / 검증 클래스
    private static final long ACCESS_TOKEN_MSEC = 60 * (60 * 1000); // 만료시간 (60분)
    private static final String claimName = "userid";
    private static final String prefix = "Bearer ";
    @Value("${jwt.key}")
    private String KEY;

    // prefix 제거
    private static String getJWTOrigin(String token) {
        if (token.startsWith(prefix)) return token.replace(prefix, "");
        return token;
    }

    // 생성 메서드
    public String getJWT(String username) {
        String src = JWT.create()
                .withClaim(claimName, username)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_MSEC))
                .sign(Algorithm.HMAC256(KEY));
        return prefix + src;
    }

    // 검증 메서드
    public String getClaim(String token) {
        String src = getJWTOrigin(token);
        return JWT.require(Algorithm.HMAC256(KEY)).build().verify(src).getClaim(claimName).asString();
    }

    // 만료 확인용 메서드
    public boolean isExpired(String token) {
        String src = getJWTOrigin(token);
        return JWT.require(Algorithm.HMAC256(KEY)).build().verify(src).getExpiresAt().before(new Date());
    }


}
