package com.project.civicpulse.controller;

import com.project.civicpulse.dto.CitizenResponse;
import com.project.civicpulse.dto.ProvisionAdminRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.dto.UserResponse;
import com.project.civicpulse.entity.AuditLog;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.AuditLogRepository;
import com.project.civicpulse.service.AuthService;
import com.project.civicpulse.service.ReportService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ReportService reportService;
    private final AuthService authService;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/citizens")
    public ResponseEntity<List<CitizenResponse>> getCitizens() {
        return ResponseEntity.ok(reportService.getCitizens());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getAllReports(authentication.getName()));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(reportService.getReportById(authentication.getName(), id));
    }

    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ReportResponse> updateReportStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload,
        Authentication authentication
    ) {
        String status = payload.get("status");
        String assignedTeam = payload.get("assignedTeam");
        return ResponseEntity.ok(reportService.updateReportStatus(authentication.getName(), id, status, assignedTeam));
    }

    @PatchMapping("/reports/{id}/assign")
    public ResponseEntity<ReportResponse> assignReport(
        @PathVariable Long id,
        @RequestBody(required = false) Map<String, Object> payload,
        Authentication authentication
    ) {
        Long targetAdminId = null;
        if (payload != null && payload.get("adminId") != null) {
            targetAdminId = ((Number) payload.get("adminId")).longValue();
        }
        return ResponseEntity.ok(reportService.assignReport(authentication.getName(), id, targetAdminId));
    }

    // Exceptional Destructive Operation: Only SUPER_ADMIN can soft-delete reports with auditing
    @DeleteMapping("/reports/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteReport(
        @PathVariable Long id,
        @RequestParam(required = false) String reason,
        Authentication authentication
    ) {
        reportService.softDeleteReport(authentication.getName(), id, reason);
        return ResponseEntity.ok(Map.of("message", "Report soft-deleted successfully", "id", id.toString()));
    }

    // Super Admin: Provision new privileged administrator accounts
    @PostMapping("/users/provision")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> provisionUser(
        @Valid @RequestBody ProvisionAdminRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(authService.provisionPrivilegedUser(authentication.getName(), request));
    }

    // Super Admin: List all user accounts across the system
    @GetMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers(
        @RequestParam(required = false) UserRole role,
        Authentication authentication
    ) {
        return ResponseEntity.ok(authService.getAllUsers(authentication.getName(), role));
    }

    // Super Admin: Enable/disable administrator accounts
    @PatchMapping("/users/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> updateUserStatus(
        @PathVariable Long id,
        @RequestBody Map<String, Boolean> payload,
        Authentication authentication
    ) {
        boolean enabled = payload.getOrDefault("enabled", true);
        return ResponseEntity.ok(authService.updateUserStatus(authentication.getName(), id, enabled));
    }

    // Super Admin: Retrieve immutable audit logs
    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Map<String, Object>>> getAllIncidents() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 1L, "status", "OPEN", "title", "Sample incident"),
            Map.of("id", 2L, "status", "RESOLVING", "title", "Secondary incident")
        ));
    }

    @GetMapping("/resources")
    public ResponseEntity<List<Map<String, Object>>> getAllResources() {
        return ResponseEntity.ok(List.of(
            Map.of("id", 1L, "name", "Ambulance Unit 1", "status", "AVAILABLE")
        ));
    }

    @PostMapping("/resources")
    public ResponseEntity<Map<String, Object>> createResource(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "message", "Resource created",
            "name", payload.getOrDefault("name", "Unnamed Resource")
        ));
    }

    @PostMapping("/incidents/{id}/recalculate")
    public ResponseEntity<Map<String, Object>> recalculate(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id, "status", "RECALCULATED"));
    }

    @PostMapping("/incidents/{id}/allocate")
    public ResponseEntity<Map<String, Object>> allocate(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id, "status", "ALLOCATED"));
    }

    @PatchMapping("/incidents/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "id", id,
            "status", payload.getOrDefault("status", "UPDATED")
        ));
    }
}
