package com.example.demo.service.board;

import com.example.demo.domain.dao.board.CommentReplyDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.board.CommentReplyDTO;
import com.example.demo.domain.dto.board.WriteCommentDTO;
import com.example.demo.exception.CommentNotFoundException;
import com.example.demo.exception.MemberMismatchException;
import com.example.demo.repository.ReplyRepository;
import com.example.demo.service.validator.board.BoardInputValidator;
import com.example.demo.service.validator.member.MemberValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplyService {
    private final MemberValidator memVal;
    private final ReplyRepository rr;
    private final BoardInputValidator boardVal;

    // 대댓글 조회 리스트 메서드
    public List<CommentReplyDTO> getReply(Integer idx) {
        return rr.getReplyByCommentIdx(idx);
    }

    // 대댓글 쓰기 메서드
    public void writeReply(WriteCommentDTO dto) {
        // 입력값 검증
        boardVal.replyInputValidator(dto);
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 상위 댓글 존재여부 검증
        if (rr.checkComment(dto.getCommentId()) == 1) {
            rr.save(CommentReplyDAO.builder()
                    .member(mem)
                    .commentId(dto.getCommentId())
                    .content(dto.getContent())
                    .build());
        } else throw new CommentNotFoundException("상위 댓글을 찾을 수 없습니다.");
    }

    // 대댓글 수정 메서드
    @Transactional
    public void editReply(WriteCommentDTO dto) {
        // 입력값 검증
        boardVal.replyInputValidator(dto);
        // 대댓글 존재여부 검증
        CommentReplyDAO dao = rr.findById(dto.getIdx())
                .orElseThrow(() -> new CommentNotFoundException("댓글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 대댓글 작성자와 수정자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem,dao.getMember().getUserid())) {
            dao.setContent(dto.getContent());
            rr.save(dao);
        } else throw new MemberMismatchException("댓글 작성자만 수정할 수 있습니다.");
    }

    // 대댓글 삭제 메서드
    @Transactional
    public void deleteReply(Integer idx) {
        // 댓글 존재여부 검증
        CommentReplyDAO dao = rr.findById(idx)
                .orElseThrow(() -> new CommentNotFoundException("댓글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 대댓글 작성자와 삭제자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem,dao.getMember().getUserid())) {
            rr.deleteReply(idx);
        } else throw new MemberMismatchException("댓글 작성자만 삭제할 수 있습니다.");
    }
}
