package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.JobDescriptions;

public interface JobDescriptionRepository extends JpaRepository<JobDescriptions, Long> {
    Optional<JobDescriptions> findByTitle(String title);
    List<JobDescriptions> findByUsername(String username);
    Optional<JobDescriptions> findByTitleAndUsername(String title, String username);
    boolean existsByTitleAndUsername(String title, String username);
}
