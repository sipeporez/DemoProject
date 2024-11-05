package com.example.demo.domain.dao.member;


import com.example.demo.domain.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Member", indexes = {
        @Index(name = "idx_board_nickname", columnList = "nickname")
})
public class MemberDAO {
    @Id
    @Column(length = 16)
    private String userid;
    @Column(length = 400, nullable = false)
    private String userpw;
    @Column(length = 20, nullable = false)
    private String name;
    @Column(length = 16, unique = true, nullable = false)
    private String nickname;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.ROLE_USER;
}
