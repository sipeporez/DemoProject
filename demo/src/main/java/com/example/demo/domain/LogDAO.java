package com.example.demo.domain;


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
@Table(name = "Log")
public class LogDAO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private MemberDAO member;

    @CreationTimestamp
    private LocalDateTime regidate;

    private LocalDateTime logindate;
}
