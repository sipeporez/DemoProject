package com.example.demo.exception;

import org.hibernate.PropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLIntegrityConstraintViolationException;

@ControllerAdvice
public class CustomExceptionHandler {

    // 예외처리 핸들러 예시 -> service에서 throw된 예외들을 처리할 것
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러: 필요한 정보가 입력되지 않았습니다.");
    }
    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<String> handlePropertyValue(PropertyValueException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러:" + e.getPropertyName() + " 값이 유효하지 않습니다.");
    }
    @ExceptionHandler(LengthException.class)
    public ResponseEntity<String> handleLongException(LengthException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러:" + e.getPropertyName() + " 속성이 너무 짧거나 깁니다.");
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<String> handleDuplicateException(SQLIntegrityConstraintViolationException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러: 이미 가입된 ID/닉네임/전화번호 입니다.");
    }

    @ExceptionHandler(WrongInputException.class)
    public ResponseEntity<String> handleWrongInputException(WrongInputException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러:" + e.getPropertyName() + " 속성이 잘못 입력되었습니다.");
    }
}
