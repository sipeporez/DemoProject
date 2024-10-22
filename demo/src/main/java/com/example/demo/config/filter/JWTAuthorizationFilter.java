package com.example.demo.config.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.demo.domain.MemberDAO;
import com.example.demo.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
// 한번 필터를 거치고 나면 forwarding 되도 다시 이 필터를 거치지 않음 (OncePerRequestFilter)
public class JWTAuthorizationFilter extends OncePerRequestFilter {
    private final MemberRepository mr;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Authorization 헤더에 토큰이 없거나 bearer로 시작하지 않는 경우 리턴
        String srcToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (srcToken == null || !srcToken.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwtToken = srcToken.replace("Bearer ", "");
        String KEY = "rrwerkwer--werm#%$we67rmewrm33@!#kro3)(%#JTgfJ_V#VTJ$)334#mfewkmf";
        // 토큰 복호화하여 username(userid) 추출
        String username = JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(jwtToken)
                .getClaim("userid")
                .asString();

        // userid가 DB에 존재하지 않는 경우 리턴
        Optional<MemberDAO> opt = mr.findById(username);
        if (opt.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }
        // DB에서 찾은 user 정보를 이용하여 UserDetails 객체로 변환
        MemberDAO findmember = opt.get();
        User user = new User(findmember.getUserid(), findmember.getUserpw(),
                AuthorityUtils.createAuthorityList(findmember.getRole().toString()));

        // 사용자명과 권한 관리를 위한 Authentication 객체 생성
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        // 시큐리티 세션에 추가
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}
