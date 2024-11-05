package com.example.demo.service.board;

import com.example.demo.domain.dao.board.CommentDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.board.CommentDTO;
import com.example.demo.domain.dto.board.WriteCommentDTO;
import com.example.demo.exception.BoardNotFoundException;
import com.example.demo.exception.CommentNotFoundException;
import com.example.demo.exception.MemberMismatchException;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.service.validator.board.BoardInputValidator;
import com.example.demo.service.validator.member.MemberValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final MemberValidator memVal;
    private final CommentRepository cr;
    private final BoardRepository br;
    private final BoardInputValidator boardVal;

    // 댓글 페이지네이션 메서드
    public Page<CommentDTO> getComment(Pageable pageable, Integer idx) {
        return cr.getCommentByBoardIdx(pageable, idx);
    }

    // 댓글 쓰기 메서드
    public void writeComment(Integer idx, WriteCommentDTO dto) {
        // 입력값 검증
        boardVal.commentInputValidator(dto);
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();

        cr.save(CommentDAO.builder()
                .member(mem)
                .boardIdx(br.findById(idx)
                        .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다.")))
                .content(dto.getContent())
                .build());
    }

    // 댓글 수정 메서드
    @Transactional
    public void editComment(WriteCommentDTO dto) {
        // 입력값 검증
        boardVal.commentInputValidator(dto);
        // 댓글 존재여부 검증
        CommentDAO dao = cr.findById(dto.getIdx())
                .orElseThrow(() -> new CommentNotFoundException("댓글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 댓글 작성자와 수정자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem,dao.getMember().getUserid())) {
            dao.setContent(dto.getContent());
            cr.save(dao);
        } else throw new MemberMismatchException("댓글 작성자만 수정할 수 있습니다.");
    }

    // 댓글 삭제 메서드
    @Transactional
    public void deleteComment(Integer idx) {
        // 댓글 존재여부 검증
        CommentDAO dao = cr.findById(idx)
                .orElseThrow(() -> new CommentNotFoundException("댓글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 댓글 작성자와 삭제자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem,dao.getMember().getUserid())) {
            cr.deleteComment(idx);
        } else throw new MemberMismatchException("댓글 작성자만 삭제할 수 있습니다.");
    }
}
