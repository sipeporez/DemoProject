package com.example.demo.service.validator.member;

import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.exception.LengthException;
import com.example.demo.exception.WrongInputException;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class JoinInputValidator {
    private static final int MAX_LENGTH_A = 16; // userid, nickname 길이 제한
    private static final int MAX_LENGTH_B = 20; // name ,phone 길이 제한

    // 입력값 길이 검증 메서드
    private void checkLength(String value, String propertyName, int maxLength) throws LengthException {
        if (value.length() < 1 || value.length() > maxLength) {
            throw new LengthException(propertyName);
        }
    }

    // 전화번호 검증 메서드
    private void checkPhoneNumber(String phoneNumber) throws LengthException, WrongInputException {
        checkLength(phoneNumber, "phone", MAX_LENGTH_B);
        // 전화번호 정규 표현식
        final String PHONE_NUMBER_REGEX = "^\\d{2,3}\\d{3,4}\\d{4}$";
        final Pattern PHONE_NUMBER_PATTERN = Pattern.compile(PHONE_NUMBER_REGEX);
        // 전화번호가 정규 표현식에 맞지 않는 경우 WrongInputException 발생
        if (!PHONE_NUMBER_PATTERN.matcher(phoneNumber).matches()) {
            throw new WrongInputException("phone"); // 에러 메시지에 프로퍼티 추가
        }
    }

    // 입력값 검증용 메서드
    public void validateMember(MemberDAO mem) throws LengthException, WrongInputException {
        checkLength(mem.getName(), "name", MAX_LENGTH_B);
        checkLength(mem.getNickname(), "nickname", MAX_LENGTH_A);
        checkLength(mem.getUserid(), "userid", MAX_LENGTH_A);
    }
}
