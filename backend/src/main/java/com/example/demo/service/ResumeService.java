package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import com.example.demo.model.Resume;
import com.example.demo.repository.ResumeRepository;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
public class ResumeService {
    
    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private DocExtractionService docExtractionService;

    @Transactional
    public Resume saveFile(MultipartFile file, String username) throws IOException, java.io.IOException {
        byte[] resumeBytes = file.getBytes(); 
        String resumeText = docExtractionService.extractText(resumeBytes);
        String filename = file.getOriginalFilename();

        boolean resumeExists = resumeRepository.existsByFileNameAndUsername(filename, username);

        if (resumeExists) {
            throw new IllegalArgumentException("Resume name already exists. Please choose a different name.");
        }

        Resume resume = new Resume();
        resume.setFileName(file.getOriginalFilename());
        resume.setFileType(file.getContentType());
        resume.setText(resumeText);
        resume.setUsername(username);
        return resumeRepository.save(resume);
    }
    
    public List<Resume> getResumesByUser(String username) {
        return resumeRepository.findByUsername(username);
    }
    
}
