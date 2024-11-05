package com.example.demo.domain.dao.board;


import com.example.demo.domain.dao.member.MemberDAO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "board_like")
public class LikeBoardDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "userid", referencedColumnName = "userid",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_like_member_userid",
                    foreignKeyDefinition =
                            "FOREIGN KEY (userid) REFERENCES member(userid) ON UPDATE CASCADE ON DELETE CASCADE"))
    private MemberDAO member;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "board_idx", referencedColumnName = "idx",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_like_board_idx",
                    foreignKeyDefinition =
                            "FOREIGN KEY (board_idx) REFERENCES board(idx) ON UPDATE CASCADE ON DELETE CASCADE"))
    private BoardDAO board;

}
