package com.example.demo.controller.board;


import com.example.demo.domain.dto.board.WriteBoardDTO;
import com.example.demo.service.board.BoardSerivce;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BoardController {
    private final BoardSerivce bs;

    // 게시글 목록 컨트롤러 (페이지네이션)
    @GetMapping("/board/list")
    public ResponseEntity<?> getBoardList(
            @PageableDefault(page = 0, size = 5, sort = "idx", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(bs.getBoardPage(pageable));
    }

    // 게시글 검색 컨트롤러 (페이지네이션)
    @GetMapping("/board/search")
    public ResponseEntity<?> searchBoardList(
            @PageableDefault(page = 0, size = 5, sort = "idx", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam("type") String type,
            @RequestParam("keyword") String key) {
        return ResponseEntity.ok(bs.searchBoardPage(pageable, type, key));
    }

    // 게시글 1개 조회 컨트롤러
    @GetMapping("/board/view/{idx}")
    public ResponseEntity<?> getBoards(@PathVariable("idx") Integer idx) {
        return ResponseEntity.ok(bs.getBoardOnce(idx));
    }

    // 게시글 작성버튼 클릭시 사용자가 인증되었는지 확인하는 컨트롤러
    @GetMapping("/board/checkUser")
    public ResponseEntity<?> checkUser() {
        return ResponseEntity.ok(bs.checkUserEnabled());
    }

    // 게시글 쓰기 컨트롤러
    @PostMapping("/board/write")
    public ResponseEntity<?> writeBoard(@RequestBody WriteBoardDTO dto) {
        bs.writeBoard(dto);
        return ResponseEntity.ok("게시글 작성 완료");
    }

    // 게시글 수정 컨트롤러
    @PutMapping("/board/edit/{idx}")
    public ResponseEntity<?> editBoard(@PathVariable("idx") Integer idx,
                                       @RequestBody WriteBoardDTO dto) {
        bs.editBoard(idx, dto);
        return ResponseEntity.ok("게시글 수정 완료");
    }

    // 게시글 삭제 컨트롤러
    @DeleteMapping("/board/delete/{idx}")
    public ResponseEntity<?> deleteBoard(@PathVariable("idx") Integer idx) {
        bs.deleteBoard(idx);
        return ResponseEntity.ok("게시글 삭제 완료");
    }

    // 게시글 좋아요 저장 컨트롤러
    @PutMapping("/board/like/{idx}")
    public ResponseEntity<?> addLike(@PathVariable("idx")Integer idx) {
        return ResponseEntity.ok(bs.boardLike(idx));
    }

    // 게시글 좋아요 조회 컨트롤러
    @GetMapping("/board/like/{idx}/check")
    public ResponseEntity<?> getLike(@PathVariable("idx")Integer idx) {
        return ResponseEntity.ok(bs.checkBoardLike(idx));
    }

}
