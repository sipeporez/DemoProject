package com.example.demo.repository;

import com.example.demo.domain.Role;
import com.example.demo.domain.dao.board.CommentReplyDAO;
import com.example.demo.domain.dto.board.CommentReplyDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface ReplyRepository extends JpaRepository <CommentReplyDAO, Integer> {

    // 게시글 1개에 대한 대댓글 리스트 조회
    // 생성자를 사용하여 직렬화된 CommentReplyDTO 반환
    @Query("SELECT new com.example.demo.domain.dto.board.CommentReplyDTO " +
            "(c.commentId, c.idx, c.board.idx, c.member.nickname, c.content, c.writtenDate, c.edited, c.deleted) "
            +"FROM CommentReplyDAO c WHERE c.board.idx = :idx")
    List<CommentReplyDTO> getReplyByCommentIdx(@Param("idx") Integer idx);

    // 대댓글 삭제 프로시저
    @Procedure(name = "RemoveReply")
    void removeReply(@Param("idx") Integer idx, @Param("role") String role);

    // 상위 댓글 존재 여부 확인
    @Query(value = "SELECT EXISTS (SELECT 1 FROM board_comment WHERE comment_id = :id);", nativeQuery = true)
    Long checkComment(@Param("id") String id);
}
