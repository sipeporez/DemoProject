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

    public FileListDTO(String originalName, String fileExtension) {
        this.originalName = originalName;
        this. fileExtension = fileExtension;
    }

}
