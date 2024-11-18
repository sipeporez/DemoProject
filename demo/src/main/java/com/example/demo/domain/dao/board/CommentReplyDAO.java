package com.example.demo.domain.dao.board;


import com.example.demo.domain.dao.member.MemberDAO;
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

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "board_idx", referencedColumnName = "idx",
            nullable= false,
            foreignKey = @ForeignKey(
                    name = "fk_board_idx_for_reply",
                    foreignKeyDefinition = "FOREIGN KEY (board_idx) REFERENCES board(idx) ON DELETE CASCADE"))
    private BoardDAO board;

    @Column(name = "comment_id")
    private String commentId;

    @Column(length = 500, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;

    @Builder.Default
    private Boolean edited = false;

    @Builder.Default
    private Boolean deleted = false;
}
