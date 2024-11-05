package com.example.demo.exception;

public class MemberNotAuthorizationException extends RuntimeException {
    public MemberNotAuthorizationException(String message) {
        super(message);
    }
}