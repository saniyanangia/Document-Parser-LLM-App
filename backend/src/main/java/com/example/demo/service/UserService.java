package com.example.demo.service;
import com.example.demo.model.Users;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    Users findUserById(Long userId);
    boolean isUsernameTaken(String username);
    List<Users> findAllUsers();
    UserDetails loadUserByUsername(String username);
    void saveUser(Users user);
}
