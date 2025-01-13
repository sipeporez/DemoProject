package com.example.demo.domain.dao;


import com.example.demo.domain.FileStatus;
import com.example.demo.domain.dao.member.MemberDAO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "file_db", indexes = {
    @Index(name = "idx_file_boardIdx", columnList = "boardIdx")
}
)
public class FileDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "userid",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_userid_for_file",
                    foreignKeyDefinition = "FOREIGN KEY (userid) REFERENCES member(userid)"
            ))
    private MemberDAO member;

    private Integer boardIdx;

    @Column(length = 256, nullable = false)
    private String originalName;

    @Column(length = 256, nullable = false, unique = true)
    private String storedName;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 10)
    private String fileExtension;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FileStatus fileStatus = FileStatus.ACTIVATE;

    @CreationTimestamp
    private LocalDateTime uploadDate;

    @Builder.Default
    private LocalDateTime deletedDate = null;


}
