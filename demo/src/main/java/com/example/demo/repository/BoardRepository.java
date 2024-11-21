package com.example.demo.repository;

import com.example.demo.domain.Role;
import com.example.demo.domain.dao.board.BoardDAO;
import com.example.demo.domain.dto.board.BoardDTO;
import com.example.demo.domain.dto.board.BoardPageDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardDAO, Integer> {

    // 게시글 1개 조회
    // fetch join 사용하여 member와 board를 동시에 가져옴 -> N+1 해결
    @Query("SELECT b FROM BoardDAO b JOIN FETCH b.member WHERE b.idx = :idx")
    Optional<BoardDAO> findBoardByIdWithMember(@Param("idx") Integer idx);

    // 게시글 페이지네이션
    // 생성자를 사용하여 직렬화된 PageDTO 페이지 반환
    @Query("SELECT new com.example.demo.domain.dto.board.BoardPageDTO(b.idx, m.nickname, b.title, b.writtenDate, b.likeCnt) "
            +"FROM BoardDAO b JOIN b.member m")
    Page<BoardPageDTO> getBoards(Pageable pageable);

    // 게시글 검색 페이지네이션
    // 생성자를 사용하여 직렬화된 PageDTO 페이지 반환
    @Query("SELECT new com.example.demo.domain.dto.board.BoardPageDTO(b.idx, m.nickname, b.title, b.writtenDate, b.likeCnt) "
            +"FROM BoardDAO b JOIN b.member m "
            + "WHERE (:type = 'title' AND b.title LIKE %:key%) "
            + "OR (:type = 'content' AND b.content LIKE %:key%) "
            + "OR (:type = 'nickname' AND m.nickname LIKE %:key%)")
    Page<BoardPageDTO> searchBoards(Pageable pageable, @Param("type") String type, @Param("key") String key);

    // 게시글 삭제 프로시저
    @Procedure(name = "RemoveBoard")
    void removeBoard(@Param("idx") Integer idx);

    // 마지막 게시글 번호 가져오기
    @Query(nativeQuery = true, value = "SELECT idx FROM board LIMIT 1")
    Integer findBoardLastIdx();

}
