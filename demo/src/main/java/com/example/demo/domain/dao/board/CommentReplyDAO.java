package com.example.demo.domain.dao.board;


import com.example.demo.domain.dao.member.MemberDAO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "board_comment_reply")
public class CommentReplyDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "userid",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_reply_userid",
                    foreignKeyDefinition = "FOREIGN KEY (userid) REFERENCES member(userid)"
            ))
    private MemberDAO member;

    @Column(name = "comment_id")
    private String commentId;

    @Column(length = 500, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;
}
