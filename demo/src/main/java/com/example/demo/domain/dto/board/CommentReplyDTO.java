package com.example.demo.domain.dto.board;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentReplyDTO {
    private String commentId;
    private Integer idx;
    private Integer boardIdx;
    private String nickname;
    private String content;
    private LocalDateTime writtenDate;
    private Boolean edited;
    private Boolean deleted;
}
