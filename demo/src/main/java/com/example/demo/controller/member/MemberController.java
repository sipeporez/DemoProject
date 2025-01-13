package com.example.demo.controller.member;

import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.EmailDTO;
import com.example.demo.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService ms;

    // 테스트용 랜덤 멤버 생성
    @GetMapping("/member")
    public ResponseEntity<?> getMember() {
        ms.saveRandomMember();
        return ResponseEntity.ok("세이브됨");
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> saveMember(@RequestBody MemberDAO mem) {
        ms.saveMember(mem);
        return ResponseEntity.ok("");
    }

    // 아이디 중복체크
    @PostMapping("/checkid")
    public ResponseEntity<?> checkUserID(@RequestBody MemberDAO mem) {
        ms.checkUserID(mem);
        return ResponseEntity.ok("");
    }

    // 닉네임 중복체크
    @PostMapping("/checknick")
    public ResponseEntity<?> checkNickname(@RequestBody MemberDAO mem) {
        ms.checkNickname(mem);
        return ResponseEntity.ok("");
    }

    // 권한 체크
    @GetMapping("/role")
    public ResponseEntity<?> getRole() {
        return ResponseEntity.ok(ms.getRole());
    }

    // 인증 여부 체크
    @GetMapping("/checkauth")
    public ResponseEntity<?> checkAuth() {
        ms.checkAuth();
        return ResponseEntity.ok("");
    }

    // OAuth2.0 최초가입 닉네임, 이름 변경
    @PostMapping("/oauthjoin")
    public ResponseEntity<?> oauthJoin(@RequestBody MemberDAO dao) {
        ms.oauthJoin(dao);
        return ResponseEntity.ok("");
    }

    // 이메일 인증 - 토큰 발급
    @PostMapping("/verifyemail")
    public ResponseEntity<?> verifyEmail(@RequestBody MemberDAO dao) {
        ms.createMailToken(dao);
        return ResponseEntity.ok("");
    }

    // 이메일 인증 - 토큰 검증
    @PostMapping("/verifykey")
    public ResponseEntity<?> verifyKey(@RequestBody EmailDTO dto) {
        ms.verifyMailToken(dto);
        return ResponseEntity.ok("");
    }

}
