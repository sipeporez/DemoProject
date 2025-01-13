package com.example.demo.domain.dto.board;


import com.example.demo.domain.FileStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileListDTO {

    private String originalName;
    private String storedName;
    private Long fileSize;
    private String fileExtension;
    private FileStatus fileStatus;

    // getFileListByBoardIdx JPA용 생성자 -> Lombok으로 생성 안되는데, 왜 이런지 모르겠음
    public FileListDTO(String originalName, String storedName, Long fileSize, FileStatus fileStatus) {
        this.originalName = originalName;
        this.storedName = storedName;
        this.fileSize = fileSize;
        this.fileStatus = fileStatus;
    }

}
