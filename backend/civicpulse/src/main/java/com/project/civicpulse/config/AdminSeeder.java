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

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedAdmin() {
        if (!adminEnabled) {
            log.info("Admin seeder is disabled.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            log.info("Admin user already exists with email: {}", normalizedEmail);
            return;
        }

        User admin = User.builder()
            .name("System Administrator")
            .email(normalizedEmail)
            .password(passwordEncoder.encode(adminPassword))
            .role(UserRole.ADMIN)
            .enabled(true)
            .build();

        userRepository.save(admin);
        log.info("Admin user seeded successfully with email: {}", normalizedEmail);
    }
}
