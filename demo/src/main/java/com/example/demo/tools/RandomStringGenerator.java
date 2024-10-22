package com.example.demo.tools;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class RandomStringGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final String NUMBERS = "0123456789";
    private static final SecureRandom random = new SecureRandom();

    public String generateRandomString() {
        final int LENGTH = 10;
        StringBuilder result = new StringBuilder(LENGTH);

        for (int i = 0; i < LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            result.append(CHARACTERS.charAt(index));
        }

        return result.toString();
    }
    public String generateRandomPhone() {
        final int LENGTH = 8;
        String localNumber = "010";
        StringBuilder result = new StringBuilder(LENGTH);

        for (int i = 0; i < LENGTH; i++) {
            int index = random.nextInt(NUMBERS.length());
            result.append(NUMBERS.charAt(index));
        }

        return localNumber+result.toString();
    }
}
