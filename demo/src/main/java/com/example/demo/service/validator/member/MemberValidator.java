package com.example.demo.service.validator.member;

import com.example.demo.domain.Role;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.exception.MemberNotAuthorizationException;
import com.example.demo.exception.MemberNotFoundException;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberValidator {
    private final MemberRepository mr;

    // 토큰으로 인증된 사용자 객체 반환 메서드
    public MemberDAO findMemberIDFromToken() {
        MemberDAO mem = null;
        Authentication authen = SecurityContextHolder.getContext().getAuthentication();
        // JWT 토큰을 통해 사용자가 인증되었는지 검사
        if (authen != null && authen.isAuthenticated()) {
            // 사용자가 DB에 있는지 검사
            mem = mr.findById(authen.getName())
                    .orElseThrow(() -> new MemberNotFoundException("회원 정보를 찾을 수 없습니다."));
            // 사용자 이메일 인증 여부 검사
            if (mem.getEnabled()) return mem;
            throw new MemberNotAuthorizationException("이메일 인증 후 사용 가능합니다.");
        }
        throw new MemberNotFoundException("인증되지 않은 사용자입니다.");
    }

    // 토큰으로 인증된 사용자 객체 반환 메서드 (이메일 인증용)
    public MemberDAO findMemberIDFromTokenForEmailVerify() {
        MemberDAO mem = null;
        Authentication authen = SecurityContextHolder.getContext().getAuthentication();
        // JWT 토큰을 통해 사용자가 인증되었는지 검사
        if (authen != null && authen.isAuthenticated()) {
            // 사용자가 DB에 있는지 검사
            mem = mr.findById(authen.getName())
                    .orElseThrow(() -> new MemberNotFoundException("회원을 찾을 수 없습니다."));
        }
        return mem;
    }

    // 토큰으로 인증된 사용자 객체 반환 메서드 (좋아요 조회용)
    public MemberDAO findMemberIDFromTokenForBoardLike() {
        MemberDAO mem = null;
        Authentication authen = SecurityContextHolder.getContext().getAuthentication();
        // JWT 토큰을 통해 사용자가 인증되었는지 검사
        if (authen != null && authen.isAuthenticated()) {
            // 사용자가 DB에 있는지 검사
            mem = mr.findById(authen.getName())
                    .orElseThrow(() -> new MemberNotFoundException("회원을 찾을 수 없습니다."));
        }
        return mem;
    }

    public boolean checkMemberAuthorization(MemberDAO mem, String userid) {
        if (mem == null) return false;
        return mem.getRole().equals(Role.ROLE_ADMIN) || mem.getUserid().equals(userid);
    }
}
