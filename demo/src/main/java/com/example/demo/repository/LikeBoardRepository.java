package com.example.demo.repository;

import com.example.demo.domain.dao.board.LikeBoardDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LikeBoardRepository extends JpaRepository<LikeBoardDAO, Integer> {

    // 좋아요 테이블 조회
    @Query(value = "SELECT EXISTS(SELECT 1 FROM board_like WHERE userid = :userid AND board_idx = :idx)", nativeQuery = true)
    Long checkBoardLike(@Param("userid") String userid, @Param("idx") Integer idx);

    // 게시글 좋아요 저장하는 네이티브 쿼리
    @Modifying
    @Query(value = "INSERT INTO board_like (userid,board_idx) VALUES (:userid, :idx)", nativeQuery = true)
    void likeBoard(@Param("userid") String userid, @Param("idx") Integer idx);

    // 게시글 좋아요 카운트 더하는 네이티브 쿼리
    @Modifying
    @Query(value = "UPDATE board SET like_cnt = like_cnt + 1 WHERE idx = :idx", nativeQuery = true)
    void likeCnt(@Param("idx") Integer idx);

    // 게시글 좋아요 제거하는 네이티브 쿼리
    @Modifying
    @Query(value = "DELETE FROM board_like WHERE userid = :userid AND board_idx = :idx", nativeQuery = true)
    void dislikeBoard(@Param("userid") String userid, @Param("idx") Integer idx);

    // 게시글 좋아요 카운트 빼는 네이티브 쿼리
    @Modifying
    @Query(value = "UPDATE board SET like_cnt = like_cnt - 1 WHERE idx = :idx", nativeQuery = true)
    void dislikeCnt(@Param("idx") Integer idx);


}
