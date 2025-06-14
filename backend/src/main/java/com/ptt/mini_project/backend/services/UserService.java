package com.ptt.mini_project.backend.services;

import com.ptt.mini_project.backend.entities.User;
import com.ptt.mini_project.backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public ResponseEntity<Object> signup(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return new ResponseEntity<>("All Fields are Required", HttpStatus.EXPECTATION_FAILED);
        }

        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return new ResponseEntity<>("User with " + user.getEmail() + " already exists", HttpStatus.CONFLICT);
        }

        int userCount = userRepository.findAll().size();
        if (userCount == 0) {
            user.setRole("ADMIN");
        } else if (userCount == 1) {
            user.setRole("KITCHEN");
        } else {
            user.setRole("CUSTOMER");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return new ResponseEntity<>("Signup successful", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> login(User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            if (authentication.isAuthenticated()) {
                User foundUser = userRepository.findByEmail(user.getEmail());
                if (foundUser == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }

                String token = jwtService.generateToken(foundUser);
                Map<String, String> response = new HashMap<>();
                response.put("accessToken", token);
                response.put("role", foundUser.getRole());
                return new ResponseEntity<>(response, HttpStatus.OK);
            }

            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Authentication failed", HttpStatus.UNAUTHORIZED);
        }
    }

    public User profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email);
        }
        return null;
    }

}