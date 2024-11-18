package com.example.demo.domain.dao.board;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "removed_comment")
public class RemovedCommentDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentIndex;

    @Column(name = "idx")
    private Integer idx;

    @Column(name="comment_id", nullable = true, unique = true, length = 36)
    private String commentId;

    @Column(name="userid")
    private String userid;

    @Column(name = "board_idx")
    private Integer boardIdx;

    @Column(length = 500, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;

    @CreationTimestamp
    private LocalDateTime removedDate;

}
