package com.example.demo.config;

import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.exception.MemberNotFoundException;
import com.example.demo.repository.MemberRepository;
import com.example.demo.tools.JWTUtil;
import com.example.demo.tools.OAuthUsernameCreator;
import com.example.demo.tools.RandomStringGenerator;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
@RequiredArgsConstructor
// OAuth 로그인 성공시 DB에 저장 후 JWT 발급하는 클래스
public class OAuth2Handler extends SimpleUrlAuthenticationSuccessHandler {
    private final MemberRepository mr;
    private final PasswordEncoder enc;
    private final JWTUtil jwt;
    private final RandomStringGenerator rnd;

    @Value("${front.addr}")
    private String FRONT_ADDR;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String username = OAuthUsernameCreator.getUsernameFromOAuth(user);
        String email = user.getAttribute("email");

        if (username == null) throw new MemberNotFoundException("OAuth2 사용자 이름을 찾을 수 없습니다.");

        // 네이버 로그인일 경우 이메일 추출
        if (username.startsWith("Naver")) {
            email = user.getName()
                    .split("email=")[1]
                    .replace("}", "");
        }
        // 이메일로 member 검사 후 이미 등록된 이메일이라면 jwt 생성
        Optional<MemberDAO> mem = mr.findByEmail(email);
        if (mem.isPresent() && !mem.get().getName().equals("OAuth2-Temp")) {
            response.sendRedirect(FRONT_ADDR + "checkOAuth?name=" +
                    URLEncoder.encode(mem.get().getNickname(), StandardCharsets.UTF_8) +
                    "&key=" + jwt.getJWT(mem.get().getUserid()));
        }
        // 최초가입인 경우 OAuth2 서버에서 반환된 id로 새 Member 저장 후 jwt 생성
        else {
            mr.save(MemberDAO.builder()
                    .userid(username.substring(0, 15))
                    .email(email)
                    .name("OAuth2-Temp")
                    .nickname(rnd.generateRandomString())
                    .userpw(enc.encode("OAuth2-Temp"))
                    .enabled(true)
                    .build());
            response.sendRedirect(FRONT_ADDR + "checkOAuth?needChange=y&key="
                    + jwt.getJWT(username.substring(0, 15)));
        }
    }
}
