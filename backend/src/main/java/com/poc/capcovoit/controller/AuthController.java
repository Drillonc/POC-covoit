package com.poc.capcovoit.controller;

import com.poc.capcovoit.dao.UserRepository;
import com.poc.capcovoit.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          AuthenticationManager authenticationManager,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class RegisterRequest {
        public String email;
        public String firstName;
        public String lastName;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username, request.password)
            );

            User user = userRepository.findByEmail(request.username).orElse(null);
            String fullName = (user != null && user.getFirstName() != null && user.getLastName() != null)
                    ? (user.getFirstName() + " " + user.getLastName())
                    : request.username;

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user_id", request.username);
            response.put("fullName", fullName);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Identifiants invalides");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsById(request.email)) {
            response.put("success", false);
            response.put("message", "Utilisateur déjà existant");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setEmail(request.email);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setPw(passwordEncoder.encode(request.password));

        userRepository.save(user);

        response.put("success", true);
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }
}
