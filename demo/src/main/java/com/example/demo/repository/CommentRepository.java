package com.example.demo.repository;

import com.example.demo.domain.dao.board.CommentDAO;
import com.example.demo.domain.dto.board.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository <CommentDAO, Integer> {

    // 게시글 1개에 대한 댓글 페이지네이션 조회
    // 생성자를 사용하여 직렬화된 CommentDTO 반환
    @Query("SELECT new com.example.demo.domain.dto.board.CommentDTO " +
            "(c.boardIdx.idx, c.idx, c.commentId, c.member.nickname, c.content, c.writtenDate) "
            +"FROM CommentDAO c WHERE c.boardIdx.idx = :idx")
    Page<CommentDTO> getCommentByBoardIdx(Pageable pageable, @Param("idx") Integer idx);

    // 네이티브 쿼리를 이용한 댓글 1개 삭제
    // 네이티브 사용시 @Modifying 어노테이션 필수 (Insert, Update, Delete)
    @Modifying
    @Query(value = "DELETE FROM board_comment WHERE idx = :idx", nativeQuery = true)
    void deleteComment(@Param("idx") Integer idx);
}
