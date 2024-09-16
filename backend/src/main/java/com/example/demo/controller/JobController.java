package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.JobService;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/job")

public class JobController {

    @Autowired
    private JobService newJobService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
        @RequestParam("jobTitle") String title,
        @RequestParam("jobDescription") String description,
        Principal principal
        ) {
        try {
            String cleanedTitle = cleanText(title);
            String cleanedDescription = cleanText(description);
            String username = principal.getName();
            newJobService.saveJob(cleanedTitle, cleanedDescription, username);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Job description saved successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Collections.singletonMap("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Collections.singletonMap("error", "Failed to save job"));
        }
    }

    private String cleanText(String text) {
        if (text == null) return "";
    
        // Normalize line breaks
        text = text.replaceAll("\\r\\n|\\r|\\n", "\n");
    
        // Trim leading and trailing spaces
        text = text.trim();
    
        // Replace multiple spaces with a single space
        text = text.replaceAll("\\s+", " ");
    
        // Remove non-printable characters (except common white spaces)
        text = text.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "");
    
        // Remove any non-ASCII characters
        text = text.replaceAll("[^\\p{ASCII}]", "");
    
        text = text.replaceAll("[“”‘’]", "\""); // Replace curly quotes with straight quotes
        text = text.replaceAll("[^\\p{Print}]", ""); // Remove non-printable characters
    
        return text;
    }
    
}





