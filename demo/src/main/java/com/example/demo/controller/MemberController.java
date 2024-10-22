package com.example.demo.controller;

import com.example.demo.domain.MemberDAO;
import com.example.demo.exception.LengthException;
import com.example.demo.exception.WrongInputException;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> saveMember(@RequestBody MemberDAO mem) throws LengthException, WrongInputException {
        ms.saveMember(mem);
        return ResponseEntity.ok("회원가입 됨");
    }

}
