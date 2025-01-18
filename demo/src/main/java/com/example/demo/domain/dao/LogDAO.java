package com.example.demo.domain.dao;


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
@Table(name = "log")
public class LogDAO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid",
    nullable = false,
    foreignKey = @ForeignKey(name="fk_userid_for_log"))
    private MemberDAO member;

    @Column
    private String ipAddress;

    @CreationTimestamp
    private LocalDateTime loginDate;
}
