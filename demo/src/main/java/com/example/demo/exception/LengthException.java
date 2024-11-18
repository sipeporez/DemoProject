package com.example.demo.exception;

import lombok.*;

@Getter
@NoArgsConstructor
public class LengthException extends RuntimeException {
    private String propertyName; // 어떤 프로퍼티인지 저장할 필드

    public LengthException(String propertyName) {
        this.propertyName = propertyName;
    }

    public LengthException(String propertyName, String message) {
        super(message + ": " + propertyName);
        this.propertyName = propertyName;
    }

}
