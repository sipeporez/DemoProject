package com.example.demo.exception;

import org.hibernate.PropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    // JSON ID 검사
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

    // 입력값 검사 (null 또는 길이 초과)
    @ExceptionHandler(LengthException.class)
    public ResponseEntity<String> handleLongException(LengthException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러:" + e.getPropertyName() + " 속성이 너무 짧거나 깁니다.");
    }

    // 회원가입, 정보 수정시 중복 ID 또는 중복 닉네임
    @ExceptionHandler(DuplicatedException.class)
    public ResponseEntity<String> handleDuplicatedException(DuplicatedException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(e.getMessage());
    }

    // 입력값 검사 (입력 타입 확인)
    @ExceptionHandler(WrongInputException.class)
    public ResponseEntity<String> handleWrongInputException(WrongInputException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("에러:" + e.getPropertyName() + " 속성이 잘못 입력되었습니다.\n" + e.getMessage());
    }

    // 게시글 찾을 수 없음
    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<String> handleBoardNotFound(BoardNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }

    // 비회원 관련 (사용자 찾을 수 없음)
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<String> handleMemberNotFound(MemberNotFoundException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(e.getMessage());
    }

    // 이메일 인증 관련
    @ExceptionHandler(MemberNotAuthorizationException.class)
    public ResponseEntity<String> handleMemberNotAuthException(MemberNotAuthorizationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(e.getMessage());
    }

    // 게시글 수정, 삭제 관련 (사용자 불일치)
    @ExceptionHandler(MemberMismatchException.class)
    public ResponseEntity<String> handleMemberMismatch(MemberMismatchException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
    }

    // 댓글 조회 관련
    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<String> handleCommentNotFound(CommentNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }

    // ToDoList 관련
    @ExceptionHandler(ToDoNotFoundException.class)
    public ResponseEntity<String> handleToDoNotFound(ToDoNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }

}
