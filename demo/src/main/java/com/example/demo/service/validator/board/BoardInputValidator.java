package com.example.demo.service.validator.board;

import com.example.demo.domain.dto.board.WriteBoardDTO;
import com.example.demo.domain.dto.board.WriteCommentDTO;
import com.example.demo.exception.WrongInputException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class BoardInputValidator {
    private final static int MAX_LENGTH_TITLE = 100;
    private final static int MAX_LENGTH_CONTENT = 5000;
    private final static int MAX_LENGTH_CONTENT_C = 500;
    private final static int MAX_LENGTH_CONTENT_ID = 36;

    // 입력값 길이 검증 메서드
    public void checkInput(String data, int max_length, String property) throws WrongInputException {
        if (data == null || data.length() < 1) throw new WrongInputException(property, "데이터가 없습니다.");
        if (data.length() > max_length) throw new WrongInputException(property, "데이터가 너무 깁니다.");
    }

    // 게시글 검증
    public void boardInputValidator(WriteBoardDTO dto) {
        checkInput(dto.getTitle(), MAX_LENGTH_TITLE, "Title");
        checkInput(dto.getContent(), MAX_LENGTH_CONTENT, "Content");
    }

    // 댓글 검증
    public void commentInputValidator(WriteCommentDTO dto) {
        checkInput(dto.getContent(), MAX_LENGTH_CONTENT_C, "Content");
    }

    // 대댓글 검증
    public void replyInputValidator(WriteCommentDTO dto) {
        try {
            if (dto.getCommentId().length() != 36) throw new IllegalArgumentException();
            UUID uuid = UUID.fromString(dto.getCommentId());
            checkInput(dto.getContent(), MAX_LENGTH_CONTENT_C, "Content");
        } catch (IllegalArgumentException e) {
            throw new WrongInputException("Comment ID");
        }
    }

}
