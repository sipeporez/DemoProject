package com.example.demo.service.member;

import com.example.demo.domain.dao.LogDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.exception.DuplicatedException;
import com.example.demo.repository.LogRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.validator.member.JoinInputValidator;
import com.example.demo.tools.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLIntegrityConstraintViolationException;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository mr;
    private final LogRepository lg;
    private final RandomStringGenerator rans;
    private final PasswordEncoder enc;
    private final JoinInputValidator val;

    public void saveRandomMember() {
        MemberDAO mem = MemberDAO.builder()
                .userid(rans.generateRandomString())
                .userpw(enc.encode("asdf"))
                .name("테스트")
                .nickname(rans.generateRandomString())
                .build();
        LogDAO log = LogDAO.builder()
                .member(mem)
                .build();
        mr.save(mem);
        lg.save(log);
    }

    public void saveMember(MemberDAO mem) {
        // 입력값 검증
        val.validateMember(mem);

        // 중복가입 검증
        if (mr.existsById(mem.getUserid())) {
            throw new DuplicatedException("이미 사용 중인 ID 입니다.");
        }
        if (mr.existsByNickname(mem.getNickname())) {
            throw new DuplicatedException("이미 사용 중인 닉네임 입니다.");
        }

        MemberDAO member = MemberDAO.builder()
                .userid(mem.getUserid())
                .userpw(enc.encode(mem.getUserpw()))
                .name(mem.getName())
                .nickname(mem.getNickname())
                .build();
        mr.save(member);
    }
}