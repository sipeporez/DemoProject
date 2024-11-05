package com.example.demo.domain.dto.board;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WriteCommentDTO {
    private Integer idx;        // 댓글 수정,삭제 시 댓글 idx 필요
    private String commentId;    // 대댓글 관련 작업시 댓글 id 필요
    private String content;
}
