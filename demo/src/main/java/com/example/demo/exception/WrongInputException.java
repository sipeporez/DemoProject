package com.example.demo.exception;

import lombok.*;

@Getter
@NoArgsConstructor
public class WrongInputException extends Exception {
  private String propertyName; // 어떤 프로퍼티인지 저장할 필드

  public WrongInputException(String propertyName) {
    this.propertyName = propertyName;
  }

  public WrongInputException(String propertyName, String message) {
    super(message + ": " + propertyName);
    this.propertyName = propertyName;
  }

}
