package com.example.demo.exception;

public class MemberMismatchException extends RuntimeException {
    public MemberMismatchException(String message) {
        super(message);
    }
}
