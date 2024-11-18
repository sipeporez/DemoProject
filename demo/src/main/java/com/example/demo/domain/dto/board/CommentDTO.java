package com.example.demo.domain.dto.board;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Integer board_idx;
    private Integer idx;
    private String commentId;
    private String nickname;
    private String content;
    private LocalDateTime writtenDate;
    private Boolean edited;
    private Boolean deleted;
}
