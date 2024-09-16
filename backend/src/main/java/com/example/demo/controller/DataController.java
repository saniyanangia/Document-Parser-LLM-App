package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.JobDescriptions;
import com.example.demo.model.Resume;
import com.example.demo.repository.JobDescriptionRepository;
import com.example.demo.repository.ResumeRepository;

import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/fetch")
public class DataController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobDescriptionRepository jobDescriptionRepository;

    // Fetch resume and job description text data by file name and job title
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/textdata")
    public ResponseEntity<Map<String, String>> getTextData(
            @RequestParam String fileName, 
            @RequestParam String jobTitle,
            Principal principal) throws UnsupportedEncodingException {
    
        String username = principal.getName();

        Optional<Resume> resumeOptional = resumeRepository.findByFileNameAndUsername(fileName, username);
        Optional<JobDescriptions> jobDescriptionOptional = jobDescriptionRepository.findByTitleAndUsername(jobTitle, username);

        if (!resumeOptional.isPresent() || !jobDescriptionOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        String resumeText = resumeOptional.get().getText();
        String jobText = jobDescriptionOptional.get().getDescription();

        Map<String, String> response = new HashMap<>();
        response.put("resumeText", resumeText);
        response.put("jobText", jobText);

        return ResponseEntity.ok(response);
    }

    // Delete a resume by ID
    @DeleteMapping("/resume/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        Optional<Resume> resumeOptional = resumeRepository.findById(id);
        if (resumeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        resumeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Delete a job description by ID
    @DeleteMapping("/job/{id}")
    public ResponseEntity<Void> deleteJobDescription(@PathVariable Long id) {
        Optional<JobDescriptions> jobDescriptionOptional = jobDescriptionRepository.findById(id);
        if (jobDescriptionOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        jobDescriptionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}