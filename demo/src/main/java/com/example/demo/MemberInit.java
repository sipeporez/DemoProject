package com.example.demo;

import com.example.demo.domain.Role;
import com.example.demo.domain.dao.board.BoardDAO;
import com.example.demo.domain.dao.board.CommentDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.tools.RandomStringGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;

@Slf4j
@Component
@RequiredArgsConstructor
public class MemberInit implements ApplicationRunner {
    private final MemberRepository mr;
    private final BoardRepository br;
    private final CommentRepository cr;
    private final PasswordEncoder enc;
    private final static String ADMIN_ID = "admin";
    private final static String ADMIN_PASSWORD = "11";
    private final RandomStringGenerator rns;
    private final JdbcTemplate jdbc;

    @Transactional
    private void addAdmin() {
        mr.save(MemberDAO.builder()
                .userid(ADMIN_ID)
                .userpw(enc.encode(ADMIN_PASSWORD))
                .name("어드민")
                .nickname("I AM ADMIN")
                .enabled(true)
                .role(Role.ROLE_ADMIN)
                .build());

        log.info("admin 회원가입 완료");
        log.info("id : " + ADMIN_ID);
        log.info("pw : " + ADMIN_PASSWORD);
    }

    @Transactional
    private void addUser() {
        for (int i = 0; i < 50; i++) {
            String userid = rns.generateRandomString();
            mr.save(MemberDAO.builder()
                    .userid(userid)
                    .userpw(enc.encode(ADMIN_PASSWORD))
                    .name("랜덤유저")
                    .nickname(rns.generateRandomString())
                    .enabled(true)
                    .role(Role.ROLE_USER)
                    .build());

            for (int j = 0; j < 20; j++) {
                br.save(BoardDAO.builder()
                        .member(mr.findById(userid).get())
                        .title(rns.generateRandomString())
                        .content(rns.generateRandomString())
                        .build());
            }
            for (int k = 1; k < 11; k++) {
                cr.save(CommentDAO.builder()
                        .member(mr.findById(userid).get())
                        .content(rns.generateRandomString())
                        .boardIdx(br.findById(k).get())
                        .build());
            }
        }
        log.info("랜덤유저 50명 / 게시글 1000개 생성완료");
    }

    // reply 외래키 추가 메서드
    private void addForeignKey() {
        String sql = "ALTER TABLE board_comment_reply " +
                "ADD CONSTRAINT fk_comment_id_for_reply " +
                "FOREIGN KEY (comment_id) REFERENCES board_comment(comment_id) " +
                "ON DELETE SET NULL;";
        jdbc.execute(sql);

        log.info("Reply 외래키 추가 완료");
    }

    // CommentID 트리거 메서드
    private void addCommentTrigger() {
        String sql = "CREATE TRIGGER insert_comments " +
                "BEFORE INSERT ON board_comment " +
                "FOR EACH ROW " +
                "BEGIN " +
                "SET NEW.comment_id = UUID();" +
                "END;";
        try {
            jdbc.execute(sql);
        } catch (UncategorizedSQLException e) {
            // 다른 예외 처리
            if (e.getCause() instanceof SQLException sqlException) {
                // 다른 예외는 처리
                if (sqlException.getErrorCode() == 1061) { // MySQL의 경우 에러 코드 1061은 중복 트리거를 나타냄
                    // 중복 트리거가 있으므로 무시
                    System.out.println("트리거가 이미 존재합니다. 무시합니다.");
                } else e.getCause();
            } else e.getCause();
        }

        log.info("Comment 트리거 추가 완료");
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        addCommentTrigger();
        addForeignKey();
        addAdmin();
        addUser();
    }
}
