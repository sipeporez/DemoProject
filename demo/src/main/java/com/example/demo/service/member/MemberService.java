package com.example.demo.service.member;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.demo.domain.Role;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.EmailDTO;
import com.example.demo.exception.DuplicatedException;
import com.example.demo.exception.MemberNotAuthorizationException;
import com.example.demo.exception.WrongInputException;
import com.example.demo.repository.LogRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.validator.member.JoinInputValidator;
import com.example.demo.service.validator.member.MemberValidator;
import com.example.demo.tools.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository mr;
    private final LogRepository lg;
    private final RandomStringGenerator rans;
    private final PasswordEncoder enc;
    private final JoinInputValidator val;
    private final MemberValidator memVal;
    private final EmailService es;

    @Value("${jwt.key}")
    private String KEY;

    public void saveRandomMember() {
        MemberDAO mem = MemberDAO.builder()
                .userid(rans.generateRandomString())
                .userpw(enc.encode("asdf"))
                .name("테스트")
                .nickname(rans.generateRandomString())
                .build();
        mr.save(mem);
    }

    public void saveMember(MemberDAO mem) {
        // 입력값 검증
        val.validateMember(mem);

        // 정규표현식, 첫글자는 영어 대/소문자, 특수문자는 -와 _만 가능
        String regex = "^[A-Za-z][A-Za-z0-9_-]*$";
        if (!mem.getUserid().matches(regex)) {
            throw new WrongInputException("ID는 영어 대/소문자, _, - 만 사용 가능합니다.");
        }

        // 중복가입 검증
        if (mr.existsById(mem.getUserid())) {
            throw new DuplicatedException("이미 사용 중인 ID 입니다.");
        }
        if (mr.existsByNickname(mem.getNickname())) {
            throw new DuplicatedException("이미 사용 중인 닉네임 입니다.");
        }

        mr.save(MemberDAO.builder()
                .userid(mem.getUserid())
                .userpw(enc.encode(mem.getUserpw()))
                .name(mem.getName())
                .nickname(mem.getNickname())
                .build());
    }

    public String getRole() {
        MemberDAO mem = memVal.findMemberIDFromToken();
        if (mem.getRole().equals(Role.ROLE_ADMIN) || mem.getRole().equals(Role.ROLE_MANAGER)) {
            return "X";
        }
        return null;
    }

    // 정규표현식을 이용한 ID 중복여부 확인 메서드
    public void checkUserID(MemberDAO mem) {
        // 유효성 검증 (null값 확인)
        val.validateID(mem);
        // 정규표현식, 첫글자는 영어 대/소문자, 특수문자는 -와 _만 가능
        String regex = "^[A-Za-z][A-Za-z0-9_-]*$";
        // 정규표현식에 맞는 경우 중복 검사
        if (mem.getUserid().matches(regex)) {
            if (mr.existsById(mem.getUserid())) {
                throw new DuplicatedException("이미 사용중인 ID 입니다.");
            }
        } else throw new WrongInputException("ID");
    }

    // 닉네임 중복여부 확인 메서드
    public void checkNickname(MemberDAO mem) {
        // 유효성 검증 (null값 확인)
        val.validateNickname(mem);
        // 닉네임 중복 검사
        if (mr.existsByNickname(mem.getNickname())) {
            throw new DuplicatedException("이미 사용중인 닉네임 입니다.");
        }
    }

    // 이메일 인증여부 체크
    public void checkAuth() {
        MemberDAO mem = memVal.findMemberIDFromToken();
        if (!mem.getEnabled()) {
            throw new MemberNotAuthorizationException("이메일 인증 후 사용 가능합니다.");
        }
    }

    // OAuth2.0 로그인 전용 가입
    public void oauthJoin(MemberDAO dao) {
        // 토큰으로 userid 찾은 후 입력받은 이름, 닉네임으로 덮어쓰기
        MemberDAO mem = memVal.findMemberIDFromToken();
        mem.setName(dao.getName());
        mem.setNickname(dao.getNickname());
        mr.save(mem);
    }

    // 이메일 JWT 생성
    public void createMailToken(MemberDAO dao) {
        // 유효성 검증 (이메일 유형, null값 확인)
        val.validateEmail(dao);

        // 로그인 확인
        MemberDAO mem = memVal.findMemberIDFromTokenForEmailVerify();

        // 이메일 중복여부 검사
        if (mr.existsByEmail(dao.getEmail())) {
            throw new DuplicatedException("이미 등록된 이메일 입니다.");
        }

        String token = JWT.create()
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 30)) // 토큰 만료시간 30분
                .withClaim("userid", mem.getUserid())
                .withClaim("email", dao.getEmail())
                .sign(Algorithm.HMAC256(KEY));
        es.sendEmail(dao.getEmail(), token);
    }

    // 이메일 jwt 검증
    // 검증 후 해당 회원의 email 주소와 enabled 수정
    // 쿠키 사용시 memval 사용 가능, 수정 필요
    // 현재는 LocalStorage에 만료시간 설정하여 5분내로 인증 완료해야 함
    public void verifyMailToken(EmailDTO dto) {
        try {
            DecodedJWT token = JWT.require(Algorithm.HMAC256(KEY))
                    .build()
                    .verify(dto.getToken());
            String userid = token.getClaim("userid").asString();
            String email = token.getClaim("email").asString();

            MemberDAO mem = memVal.findMemberIDFromTokenForEmailVerify();
            if (userid.equals(mem.getUserid())) {
                mem.setEmail(email);
                mem.setEnabled(true);
                mr.save(mem);
            }
        } catch (JWTVerificationException e) {
            throw new MemberNotAuthorizationException("이메일 인증에 실패하였습니다. 다시 시도해 주세요.");
        }
    }

}