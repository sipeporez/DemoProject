package com.example.demo.controller.board;

import com.example.demo.domain.dto.board.WriteCommentDTO;
import com.example.demo.service.board.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService cs;

    // 한 게시글에 대한 모든 댓글 페이지네이션 조회 컨트롤러
    @GetMapping("/board/view/{idx}/comment")
    public ResponseEntity<?> getComments(
            @PageableDefault(page = 0, size = 20, sort = "idx") Pageable pageable,
            @PathVariable("idx") Integer idx) {
        return ResponseEntity.ok(cs.getComment(pageable, idx));
    }

    // 특정 게시글에 대한 댓글 작성 컨트롤러
    @PostMapping("/board/view/{idx}/comment/write")
    public ResponseEntity<?> writeComments(@PathVariable("idx") Integer idx,
                                           @RequestBody WriteCommentDTO dto) {
        cs.writeComment(idx, dto);
        return ResponseEntity.ok("댓글 작성 완료");
    }

    // 댓글 수정 컨트롤러
    @PutMapping("/comment/edit")
    public ResponseEntity<?> editBoard(@RequestBody WriteCommentDTO dto) {
        cs.editComment(dto);
        return ResponseEntity.ok("댓글 수정 완료");
    }

    // 댓글 삭제 컨트롤러
    @DeleteMapping("/comment/delete/{idx}")
    public ResponseEntity<?> deleteBoard(@PathVariable("idx") Integer idx) {
        cs.deleteComment(idx);
        return ResponseEntity.ok("댓글 삭제 완료");
    }
}
