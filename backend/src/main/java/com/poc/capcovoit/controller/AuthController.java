package com.poc.capcovoit.controller;

import com.poc.capcovoit.dao.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        System.out.println("Trying to log in with" + request.username);
        //User user = userRepository.findByUserId(request.username).orElse(null);
        boolean success = true;
        //if (user != null && Boolean.TRUE.equals(user.getActive())) {
            // Passwords are stored as BCrypt hashes in the database.
            // If you need to migrate plain-text passwords, update this logic accordingly.
            //success = passwordEncoder.matches(request.password, user.getPw());
        //}

        response.put("success", success);
        response.put("user_id", success ? request.username : null);
        return ResponseEntity.ok(response);
    }
}
