package com.example.demo.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Member")
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

    @Column(length = 20, unique = true, nullable = false)
    private String phone;
    @Column(nullable = false)
    private Character gender;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.ROLE_USER;

}
