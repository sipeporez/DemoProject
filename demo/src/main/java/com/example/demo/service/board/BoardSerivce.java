package com.example.demo.service.board;

import com.example.demo.domain.dao.board.BoardDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.board.BoardDTO;
import com.example.demo.domain.dto.board.BoardPageDTO;
import com.example.demo.domain.dto.board.WriteBoardDTO;
import com.example.demo.exception.BoardNotFoundException;
import com.example.demo.exception.MemberMismatchException;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.LikeBoardRepository;
import com.example.demo.service.validator.board.BoardInputValidator;
import com.example.demo.service.validator.member.MemberValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardSerivce {
    private final MemberValidator memVal;
    private final BoardInputValidator boardVal;
    private final BoardRepository br;
    private final LikeBoardRepository lr;

    // 게시글 조회 메서드
    // fetch join 사용
    public BoardDTO getBoardOnce(Integer idx) {
        BoardDAO dao = br.findBoardByIdWithMember(idx)
                .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다."));

        return BoardDTO.builder()
                .idx(dao.getIdx())
                .nickname(dao.getMember().getNickname())
                .title(dao.getTitle())
                .content(dao.getContent())
                .writtenDate(dao.getWrittenDate())
                .likeCnt(dao.getLikeCnt())
                .hasImage(dao.getHasImage())
                .build();
    }

    // 게시글 마지막 번호 확인 메서드
    public Integer findBoardLastIdx() {
        return br.findBoardLastIdx();
    }

    // 게시글 페이지네이션 메서드
    public Page<BoardPageDTO> getBoardPage(Pageable pageable) {
        return br.getBoards(pageable);
    }

    // 게시글 검색 페이지네이션 메서드
    public Page<BoardPageDTO> searchBoardPage(Pageable pageable, String type, String key) {
        return br.searchBoards(pageable, type, key);
    }

    // 유저 Enabled 확인
    public boolean checkUserEnabled() { return memVal.findMemberIDFromToken() != null; }
    
    // 게시글 쓰기 메서드
    public Integer writeBoard(WriteBoardDTO dto) {
        // 입력값 검증
        boardVal.boardInputValidator(dto);
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();

        BoardDAO dao = br.save(BoardDAO.builder()
                .member(mem)
                .title(dto.getTitle())
                .content(dto.getContent())
                .build());

        return dao.getIdx();
    }

    // 게시글 수정 메서드
    @Transactional
    public void editBoard(Integer idx, WriteBoardDTO dto) {
        // 입력값 검증
        boardVal.boardInputValidator(dto);
        // 게시글 존재여부 검증
        BoardDAO dao = br.findBoardByIdWithMember(idx)
                .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 게시글 작성자와 수정자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem, dao.getMember().getUserid())) {
            dao.setTitle(dto.getTitle());
            dao.setContent(dto.getContent());
            br.save(dao);
        } else throw new MemberMismatchException("게시글 작성자만 수정할 수 있습니다.");
    }

    // 게시글 삭제 메서드
    @Transactional
    public void deleteBoard(Integer idx) {
        // 게시글 존재여부 검증
        BoardDAO dao = br.findBoardByIdWithMember(idx)
                .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 게시글 작성자와 삭제자가 일치하는지 검증
        if (memVal.checkMemberAuthorization(mem, dao.getMember().getUserid())) {
            br.removeBoard(idx);
        } else throw new MemberMismatchException("게시글 작성자만 삭제할 수 있습니다.");
    }

    // 게시글 좋아요 메서드
    @Transactional
    public String boardLike(Integer idx) {
        // 게시글 존재여부 검증
        BoardDAO dao = br.findBoardByIdWithMember(idx)
                .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromToken();
        // 좋아요 검증
        // 이미 누른경우 좋아요 제거
        if (lr.checkBoardLike(mem.getUserid(), dao.getIdx()) == 1) {
            lr.dislikeBoard(mem.getUserid(), dao.getIdx());
            lr.dislikeCnt(dao.getIdx());
            return "좋아요 제거";
        } else {
            lr.likeBoard(mem.getUserid(), dao.getIdx());
            lr.likeCnt(dao.getIdx());
            return "좋아요 추가";
        }
    }

    // 사용자가 좋아요를 눌렀는지 확인하는 메서드
    public Boolean checkBoardLike(Integer idx) {
        // 게시글 존재여부 검증
        BoardDAO dao = br.findBoardByIdWithMember(idx)
                .orElseThrow(() -> new BoardNotFoundException("게시글을 찾을 수 없습니다."));
        // 사용자 검증
        MemberDAO mem = memVal.findMemberIDFromTokenForBoardLike();
        // 좋아요 검증
        return lr.checkBoardLike(mem.getUserid(), dao.getIdx()) == 1;
    }
}
