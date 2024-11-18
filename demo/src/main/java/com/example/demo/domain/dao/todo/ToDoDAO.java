package com.example.demo.domain.dao.todo;


import com.example.demo.domain.dao.member.MemberDAO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "to_do_list")
public class ToDoDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long idx;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_userid_todo",
                    foreignKeyDefinition = "FOREIGN KEY (userid) REFERENCES member(userid)"))
    public MemberDAO member;

    @Column(length = 100)
    public String content;

    @CreationTimestamp
    public LocalDateTime createdDate;

    @Column(name = "completed", nullable = false)
    public Boolean completed;

}

