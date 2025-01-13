package com.example.demo.config;

import com.example.demo.config.filter.JWTAuthenticationFilter;
import com.example.demo.config.filter.JWTAuthorizationFilter;
import com.example.demo.repository.MemberRepository;
import com.example.demo.tools.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationConfiguration ac;
    private final MemberRepository mr;
    private final JWTUtil jwt;
    private final OAuth2Handler oAuth2Handler;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        http.httpBasic(AbstractHttpConfigurer::disable);
        http.cors(cors -> {
        });
        http.csrf(AbstractHttpConfigurer::disable);

        http.formLogin(AbstractHttpConfigurer::disable);

        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(new JWTAuthorizationFilter(mr, jwt), AuthorizationFilter.class);
        http.addFilter(new JWTAuthenticationFilter(ac.getAuthenticationManager(), jwt));

        http.oauth2Login(oauth -> oauth.successHandler(oAuth2Handler));

        return http.build();
    }
}
