package com.project.civicpulse.service;

import com.project.civicpulse.dto.AuthResponse;
import com.project.civicpulse.dto.LoginRequest;
import com.project.civicpulse.dto.ProvisionAdminRequest;
import com.project.civicpulse.dto.RegisterRequest;
import com.project.civicpulse.dto.UserResponse;
import com.project.civicpulse.entity.AuditLog;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.AuditLogRepository;
import com.project.civicpulse.repository.UserRepository;
import com.project.civicpulse.security.JwtService;
import com.project.civicpulse.security.UserPrincipal;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
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
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // SECURITY: Public registration is strictly restricted to CITIZEN role.
        // Ignore or reject any client-supplied privileged role to prevent privilege escalation.
        UserRole assignedRole = UserRole.CITIZEN;

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

        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is disabled. Contact system administrator.");
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

    @Transactional
    public UserResponse provisionPrivilegedUser(String superAdminEmail, ProvisionAdminRequest request) {
        User superAdmin = userRepository.findByEmail(superAdminEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        if (superAdmin.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only SUPER_ADMIN can provision privileged administrator accounts");
        }

        if (request.getRole() != UserRole.ADMIN && request.getRole() != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provisioning must specify ADMIN or SUPER_ADMIN role");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User newUser = User.builder()
            .name(request.getName().trim())
            .email(normalizedEmail)
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .enabled(true)
            .build();

        User saved = userRepository.save(newUser);

        // Audit Log entry
        auditLogRepository.save(AuditLog.builder()
            .actorEmail(superAdmin.getEmail())
            .actorRole(superAdmin.getRole())
            .action("PROVISION_USER")
            .targetType("USER")
            .targetId(saved.getId())
            .details("Provisioned " + saved.getRole() + " account for " + saved.getEmail())
            .timestamp(Instant.now())
            .build());

        log.info("SUPER_ADMIN {} provisioned new {} user: {}", superAdmin.getEmail(), saved.getRole(), saved.getEmail());

        return mapToUserResponse(saved);
    }

    @Transactional
    public UserResponse updateUserStatus(String superAdminEmail, Long targetUserId, boolean enabled) {
        User superAdmin = userRepository.findByEmail(superAdminEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        if (superAdmin.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only SUPER_ADMIN can modify administrator accounts");
        }

        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (targetUser.getId().equals(superAdmin.getId()) && !enabled) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot disable your own SUPER_ADMIN account");
        }

        targetUser.setEnabled(enabled);
        User saved = userRepository.save(targetUser);

        auditLogRepository.save(AuditLog.builder()
            .actorEmail(superAdmin.getEmail())
            .actorRole(superAdmin.getRole())
            .action(enabled ? "ENABLE_USER" : "DISABLE_USER")
            .targetType("USER")
            .targetId(saved.getId())
            .details("Updated status of " + saved.getEmail() + " to enabled=" + enabled)
            .timestamp(Instant.now())
            .build());

        return mapToUserResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(String superAdminEmail, UserRole roleFilter) {
        User superAdmin = userRepository.findByEmail(superAdminEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        if (superAdmin.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only SUPER_ADMIN can view user management directory");
        }

        List<User> list = (roleFilter != null)
            ? userRepository.findByRoleOrderByIdAsc(roleFilter)
            : userRepository.findAllByOrderByIdAsc();

        return list.stream().map(this::mapToUserResponse).toList();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole())
            .createdAt(user.getCreatedAt())
            .enabled(user.isEnabled())
            .build();
    }
}
