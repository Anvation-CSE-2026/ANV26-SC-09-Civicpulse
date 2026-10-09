package com.project.civicpulse.config;

import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.enabled:true}")
    private boolean adminEnabled;

    @Value("${app.admin.email:admin@civicpulse.local}")
    private String adminEmail;

    @Value("${app.admin.password:AdminPass123!}")
    private String adminPassword;

    @Value("${app.superadmin.email:superadmin@civicpulse.local}")
    private String superAdminEmail;

    @Value("${app.superadmin.password:AdminPass123!}")
    private String superAdminPassword;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedAdmin() {
        if (!adminEnabled) {
            log.info("Admin seeder is disabled.");
            return;
        }

        // 1. Seed Municipal Admin
        seedUserIfAbsent("Municipal Administrator", adminEmail, adminPassword, UserRole.ADMIN);

        // 2. Seed System Administrator (SUPER_ADMIN)
        seedUserIfAbsent("Root System Administrator", superAdminEmail, superAdminPassword, UserRole.SUPER_ADMIN);
    }

    private void seedUserIfAbsent(String name, String email, String password, UserRole role) {
        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            log.info("{} user already exists with email: {}", role, normalizedEmail);
            return;
        }

        User user = User.builder()
            .name(name)
            .email(normalizedEmail)
            .password(passwordEncoder.encode(password))
            .role(role)
            .enabled(true)
            .build();

        userRepository.save(user);
        log.info("{} user seeded successfully with email: {}", role, normalizedEmail);
    }
}
