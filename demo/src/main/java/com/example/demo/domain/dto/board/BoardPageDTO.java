package com.example.demo.domain.dto.board;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardPageDTO {
    private Integer idx;
    private String nickname;
    private String title;
    private LocalDateTime writtenDate;
    private Long likeCnt;
    private Boolean hasImage;
    private Integer commentCount;
}
