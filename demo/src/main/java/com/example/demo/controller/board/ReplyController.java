package com.example.demo.controller.board;

import com.example.demo.domain.dto.board.WriteCommentDTO;
import com.example.demo.service.board.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReplyController {
    private final ReplyService rs;

    // 한 게시글에 대한 모든 대댓글 리스트 조회 컨트롤러
    @GetMapping("/board/view/{idx}/reply")
    public ResponseEntity<?> getComments(
            @PathVariable("idx") Integer idx) {
        return ResponseEntity.ok(rs.getReply(idx));
    }

    // 대댓글 작성 컨트롤러
    @PostMapping("/reply/write")
    public ResponseEntity<?> writeComments(@RequestBody WriteCommentDTO dto) {
        rs.writeReply(dto);
        return ResponseEntity.ok("대댓글 작성 완료");
    }

    // 대댓글 수정 컨트롤러
    @PutMapping("/reply/edit")
    public ResponseEntity<?> editBoard(@RequestBody WriteCommentDTO dto) {
        rs.editReply(dto);
        return ResponseEntity.ok("대댓글 수정 완료");
    }

    // 대댓글 삭제 컨트롤러
    @DeleteMapping("/reply/delete/{idx}")
    public ResponseEntity<?> deleteBoard(@PathVariable("idx") Integer idx) {
        rs.deleteReply(idx);
        return ResponseEntity.ok("대댓글 삭제 완료");
    }
}
