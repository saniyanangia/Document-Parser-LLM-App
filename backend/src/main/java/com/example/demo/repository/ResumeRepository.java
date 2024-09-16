package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Resume;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findByFileName(String fileName);
    List<Resume> findByUsername(String username);
    Optional<Resume> findByFileNameAndUsername(String fileName, String username);
    boolean existsByFileNameAndUsername(String fileName, String username);
}
