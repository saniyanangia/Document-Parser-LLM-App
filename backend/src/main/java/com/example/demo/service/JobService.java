package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.JobDescriptions;
import com.example.demo.repository.JobDescriptionRepository;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobDescriptionRepository jobDescriptionRepository;

    @Transactional
    public JobDescriptions saveJob(String title, String description, String username) throws IOException {
       
        boolean jobExists = jobDescriptionRepository.existsByTitleAndUsername(title, username);

        if (jobExists) {
            throw new IllegalArgumentException("Job title already exists. Please choose a different title.");
        }
       
        JobDescriptions job = new JobDescriptions();
        job.setTitle(title);
        job.setDescription(description);
        job.setUsername(username);

        return jobDescriptionRepository.save(job);
    }

    public List<JobDescriptions> getJobsByUser(String username) {
        return jobDescriptionRepository.findByUsername(username);
    }
}

