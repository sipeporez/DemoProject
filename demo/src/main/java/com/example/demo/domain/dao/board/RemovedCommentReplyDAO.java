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
@Table(name = "removed_reply")
public class RemovedCommentReplyDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer replyIndex;

    @Column(name = "idx")
    private Integer idx;

    @Column(name = "userid", length = 16)
    private String userid;

    @Column(name = "board_idx")
    private Integer boardIdx;

    @Column(name = "comment_id", length = 36)
    private String commentId;

    @Column(length = 500, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;

    @CreationTimestamp
    private LocalDateTime removedDate;
}
