package com.example.demo.controller;

import com.example.demo.model.JobDescriptions;
import com.example.demo.model.Resume;
import com.example.demo.model.Users;
import com.example.demo.config.JwtProvider;
import com.example.demo.response.AuthResponse;
import com.example.demo.service.JobService;
import com.example.demo.service.ResumeService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private JobService jobService;

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean isTaken = userService.isUsernameTaken(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isTaken", isTaken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> createUserHandler(@RequestBody Users user) {
        String username = user.getUsername();
        String password = user.getPassword();
        String email = user.getEmail();
    
        Users newUser = new Users();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
    
        userService.saveUser(newUser);
    
        return ResponseEntity.ok("Register Success");
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody Users loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Login success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getUserResumes(Principal principal) {
        String username = principal.getName();
        List<Resume> resumes = resumeService.getResumesByUser(username);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDescriptions>> getUserJobs(Principal principal) {
        String username = principal.getName();
        List<JobDescriptions> jobs = jobService.getJobsByUser(username);
        return ResponseEntity.ok(jobs);
    }
}
