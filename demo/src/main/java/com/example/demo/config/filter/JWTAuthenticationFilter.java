package com.example.demo.config.filter;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.service.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager am;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        //프론트에서 넘어온 Request에서 JSON 타입의 id와 password를 읽어서 Member 객체 생성
        ObjectMapper mapper = new ObjectMapper();
        try {
            MemberDAO member = mapper.readValue(request.getInputStream(), MemberDAO.class);
            // Security에 자격 증명 요청에 필요한 객체 생성
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    member.getUserid(), member.getUserpw());

            // 인증 진행 -> MemberUserDetailService를 통해 DB로 읽어온 사용자 정보와
            // 프론트에서 입력받은 id, password가 일치하는지 확인 후 성공하면 Authentication 객체 리턴
            // 일치하지 않으면 Unauthorized 반환
            return am.authenticate(authToken);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        return null;
    }

    // 인증 성공시 실행되는 메서드 (JWT 토큰 생성 후 Authorization 헤더에 추가한 뒤 응답)
    @Override
    public void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                         FilterChain chain, Authentication authResult)
            throws IOException, ServletException {

        CustomUserDetails user = (CustomUserDetails) authResult.getPrincipal();

        String KEY = "rrwerkwer--werm#%$we67rmewrm33@!#kro3)(%#JTgfJ_V#VTJ$)334#mfewkmf";
        String token = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 6000)) // 토큰 만료시간 설정
                .withClaim("userid", user.getUsername())
                .sign(Algorithm.HMAC256(KEY));


        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        response.setStatus(HttpStatus.OK.value());
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(user.getNickname());
    }

}
