CREATE PROCEDURE RemoveComment(
    IN idx INT,   -- 댓글 idx
    IN role ENUM('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER')  -- Role 
)
BEGIN
    START TRANSACTION;

		INSERT INTO removed_comment (idx, comment_id, content, written_date, board_idx, userid, removed_date)
        SELECT idx, comment_id, content, written_date, board_idx, userid, current_timestamp(6)
        FROM board_comment
        WHERE board_comment.idx = idx;


    -- 역할에 따른 처리
    IF role = 'ROLE_ADMIN' THEN 
        UPDATE board_comment
        SET content = "[관리자가 삭제한 댓글입니다.]", deleted = 1
        WHERE board_comment.idx = idx;

    ELSE
        UPDATE board_comment
        SET content = "[작성자가 삭제한 댓글입니다.]", deleted = 1
        WHERE board_comment.idx = idx;

    END IF;

    COMMIT;
END ;

CREATE PROCEDURE RemoveReply(
    IN idx INT,   -- 대댓글 idx
    IN role ENUM('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER')  -- Role 
)
BEGIN
    START TRANSACTION;

		INSERT INTO removed_reply (idx, comment_id, content, written_date, board_idx, userid, removed_date)
        SELECT idx, comment_id, content, written_date, board_idx, userid, current_timestamp(6)
        FROM board_comment_reply
        WHERE board_comment_reply.idx = idx;


    -- 역할에 따른 처리
    IF role = 'ROLE_ADMIN' THEN
        UPDATE board_comment_reply
        SET content = "[관리자가 삭제한 댓글입니다.]", deleted = 1
        WHERE board_comment_reply.idx = idx;

    ELSE
        UPDATE board_comment_reply
        SET content = "[작성자가 삭제한 댓글입니다.]", deleted = 1
        WHERE board_comment_reply.idx = idx;

    END IF;

    COMMIT;
END ;

CREATE PROCEDURE RemoveBoard(
    IN idx INT   -- 게시글 idx
)
BEGIN   
    START TRANSACTION;
-- 게시글 옮기기
		INSERT INTO removed_board (idx, userid, title, content, written_date, removed_date, like_cnt)
      SELECT idx, userid, title, content, written_date, current_timestamp(6), like_cnt
      FROM board
      WHERE board.idx = idx;
-- 댓글 옮기기
		INSERT INTO removed_comment (idx, comment_id, content, written_date, board_idx, userid)
	    SELECT idx, comment_id, content, written_date, board_idx, userid 
	    FROM board_comment
	    WHERE board_comment.board_idx = idx
	        AND board_comment.deleted != 1;
-- 대댓글 옮기기
		INSERT INTO removed_reply (idx, comment_id, content, written_date, board_idx, userid, removed_date)
      SELECT idx, comment_id, content, written_date, board_idx, userid, current_timestamp(6)
      FROM board_comment_reply
      WHERE board_comment_reply.board_idx = idx
        AND board_comment_reply.deleted != 1;
-- 삽입작업 끝난 뒤 Commit하여 데이터 보존
		COMMIT;
		
		START TRANSACTION;
-- 게시글 삭제처리 (cascade 옵션으로 댓글, 대댓글 자동삭제됨)
  	DELETE FROM board
	  	WHERE board.idx = idx;
		
    COMMIT;
END ;