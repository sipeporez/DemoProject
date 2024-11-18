package com.example.demo.repository;

import com.example.demo.domain.dao.member.MemberDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<MemberDAO, String> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
}
