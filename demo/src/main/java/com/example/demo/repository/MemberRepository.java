package com.example.demo.repository;

import com.example.demo.domain.dao.member.MemberDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberDAO, String> {
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // email로 userid 반환하는 쿼리 -> OAuth 로그인 검증용
    @Query(nativeQuery = true,
            value = "SELECT userid " +
                    "FROM member " +
                    "WHERE email = :email")
    String findUseridByEmail(@Param("email") String email);

    // email로 member객체 반환하는 쿼리 -> OAuth 로그인 검증용
    Optional<MemberDAO> findByEmail(String email);
}
