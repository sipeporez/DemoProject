package com.example.demo.domain.dao.board;


import com.example.demo.domain.dao.member.MemberDAO;
import jakarta.persistence.*;
import lombok.*;
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
@Table(name = "board_comment",
indexes = {
        @Index(name = "idx_comment_id", columnList = "comment_id", unique = true)
})
public class CommentDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @Column(name="comment_id", nullable = true, unique = true, length = 36)
    private String commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "userid",
            nullable = false,
    foreignKey = @ForeignKey(
            name = "fk_comment_userid",
            foreignKeyDefinition = "FOREIGN KEY (userid) REFERENCES member(userid)"
    ))
    private MemberDAO member;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "board_idx", referencedColumnName = "idx",
            nullable= false,
            foreignKey = @ForeignKey(
                    name = "fk_board_idx",
                    foreignKeyDefinition = "FOREIGN KEY (board_idx) REFERENCES board(idx) ON DELETE CASCADE"))
    private BoardDAO boardIdx;

    @Column(length = 500, nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime writtenDate;

}
