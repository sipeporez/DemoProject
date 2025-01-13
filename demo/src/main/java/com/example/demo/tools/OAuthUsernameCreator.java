package com.example.demo.tools;

import org.springframework.security.oauth2.core.user.OAuth2User;

public class OAuthUsernameCreator {

    // OAuth 인증 정보를 기반으로 Username을 생성하는 메서드
    public static String getUsernameFromOAuth(OAuth2User user) {

        String userString = user.toString();
        String regName = null;
        if (userString.contains("google")) regName = "Google";
        else if (userString.contains("naver")) return "Naver_" + user.getName().split("id=")[1].substring(0,10);
        else return null;

        if (user.getName().isBlank() || user.getName() == null) return null;
        else return regName + "_" + user.getName();
    }
}
