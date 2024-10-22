package com.example.demo.repository;

import com.example.demo.domain.LogDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<LogDAO, Long> {
}
