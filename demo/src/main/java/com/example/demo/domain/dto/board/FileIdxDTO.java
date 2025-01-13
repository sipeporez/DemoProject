package com.example.demo.domain.dto.board;
import lombok.*;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileIdxDTO {
    private Integer boardIdx;
    private String[] fileList;
}
