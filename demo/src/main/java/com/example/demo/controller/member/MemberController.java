package com.example.demo.controller.member;

import com.example.demo.domain.dao.member.MemberDAO;
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

    @GetMapping("/member")
    public ResponseEntity<?> getMember() {
        ms.saveRandomMember();
        return ResponseEntity.ok("세이브됨");
    }

    @PostMapping("/join")
    public ResponseEntity<?> saveMember(@RequestBody MemberDAO mem) {
        ms.saveMember(mem);
        return ResponseEntity.ok("회원가입 됨");
    }

}
