package com.example.demo.service;

import com.example.demo.domain.LogDAO;
import com.example.demo.domain.MemberDAO;
import com.example.demo.exception.LengthException;
import com.example.demo.exception.WrongInputException;
import com.example.demo.repository.LogRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.validator.JoinInputValidator;
import com.example.demo.tools.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import org.hibernate.PropertyValueException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
                .phone(rans.generateRandomPhone())
                .nickname(rans.generateRandomString())
                .gender('M')
                .build();
        LogDAO log = LogDAO.builder()
                .member(mem)
                .build();
        mr.save(mem);
        lg.save(log);
    }

    public void saveMember(MemberDAO mem)
            throws IllegalArgumentException, PropertyValueException, LengthException, WrongInputException {
        val.validateMember(mem);

        MemberDAO member = MemberDAO.builder()
                .userid(mem.getUserid())
                .userpw(enc.encode(mem.getUserpw()))
                .phone(mem.getPhone())
                .gender(mem.getGender())
                .name(mem.getName())
                .nickname(mem.getNickname())
                .build();
        mr.save(member);
    }
}