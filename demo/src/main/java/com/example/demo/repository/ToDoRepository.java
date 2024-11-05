package com.example.demo.repository;

import com.example.demo.domain.dao.todo.ToDoDAO;
import com.example.demo.domain.dto.todo.ToDoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ToDoRepository extends JpaRepository<ToDoDAO, Integer> {

    @Query("SELECT new com.example.demo.domain.dto.todo.ToDoDTO " +
            "(t.idx, t.member.userid, t.content, t.createdDate, t.completed) "
            +"FROM ToDoDAO t WHERE t.member.userid = :userid")
    List<ToDoDTO> findByUserid(@Param("userid") String userid);
}
