package com.example.demo.domain.dto.board;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {

    private Integer idx;
    private String nickname;
    private String title;
    private String content;
    private LocalDateTime writtenDate;
    private Long likeCnt;
    private Boolean edited;

}
