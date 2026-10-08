package com.project.civicpulse.service;

import com.project.civicpulse.dto.AuthResponse;
import com.project.civicpulse.dto.LoginRequest;
import com.project.civicpulse.dto.RegisterRequest;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.UserRepository;
import com.project.civicpulse.security.JwtService;
import com.project.civicpulse.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        UserRole assignedRole = request.getRole() != null ? request.getRole() : UserRole.CITIZEN;

        User user = User.builder()
            .name(request.getName().trim())
            .email(normalizedEmail)
            .password(passwordEncoder.encode(request.getPassword()))
            .role(assignedRole)
            .enabled(true)
            .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(savedUser.getId())
            .name(savedUser.getName())
            .email(savedUser.getEmail())
            .role(savedUser.getRole())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user;
        if (authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {
            user = userPrincipal.getUser();
        } else {
            user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
