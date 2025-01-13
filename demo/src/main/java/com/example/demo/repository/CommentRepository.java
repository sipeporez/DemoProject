package com.example.demo.repository;

import com.example.demo.domain.Role;
import com.example.demo.domain.dao.board.CommentDAO;
import com.example.demo.domain.dto.board.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository <CommentDAO, Integer> {

    // 게시글 1개에 대한 댓글 페이지네이션 조회
    // 생성자를 사용하여 직렬화된 CommentDTO 반환
    @Query("SELECT new com.example.demo.domain.dto.board.CommentDTO " +
            "(c.board.idx, c.idx, c.commentId, c.member.nickname, c.content, c.writtenDate, c.edited, c.deleted) "
            +"FROM CommentDAO c " +
            "WHERE c.board.idx = :idx")
    Page<CommentDTO> getCommentByBoardIdx(Pageable pageable, @Param("idx") Integer idx);

    // 댓글 삭제 프로시저
    @Procedure(name = "RemoveComment")
    void removeComment(@Param("idx") Integer idx, @Param("role") String role);
}
