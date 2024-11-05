package com.example.demo.repository;

import com.example.demo.domain.dao.board.CommentReplyDAO;
import com.example.demo.domain.dto.board.CommentReplyDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface ReplyRepository extends JpaRepository <CommentReplyDAO, Integer> {

    // 게시글 1개에 대한 대댓글 리스트 조회
    // 생성자를 사용하여 직렬화된 CommentReplyDTO 반환
    @Query("SELECT new com.example.demo.domain.dto.board.CommentReplyDTO " +
            "(c.commentId, c.idx, c.member.nickname, c.content, c.writtenDate) "
            +"FROM CommentReplyDAO c WHERE c.commentId = :idx")
    List<CommentReplyDTO> getReplyByCommentIdx(@Param("idx") Integer idx);

    // 네이티브 쿼리를 이용한 댓글 1개 삭제
    // 네이티브 사용시 @Modifying 어노테이션 필수 (Insert, Update, Delete)
    @Modifying
    @Query(value = "DELETE FROM board_comment_reply WHERE idx = :idx", nativeQuery = true)
    void deleteReply(@Param("idx") Integer idx);

    // 상위 댓글 존재 여부 확인
    @Query(value = "SELECT EXISTS (SELECT 1 FROM board_comment WHERE comment_id = :id);", nativeQuery = true)
    Long checkComment(@Param("id") String id);
}
