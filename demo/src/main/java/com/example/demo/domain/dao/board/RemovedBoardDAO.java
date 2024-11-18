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
@Table(name = "removed_board")
public class RemovedBoardDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardIndex;

    @Column(name = "idx")
    private Integer idx;

    @Column(name="userid", length = 16)
    private String userid;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(length = 5000, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;

    @CreationTimestamp
    private LocalDateTime removedDate;

    @Column(name = "like_cnt", nullable = false)
    private Long likeCnt;
}
