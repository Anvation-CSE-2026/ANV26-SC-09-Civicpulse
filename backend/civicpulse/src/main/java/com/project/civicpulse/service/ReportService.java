package com.project.civicpulse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.CitizenResponse;
import com.project.civicpulse.dto.ReportRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.entity.AuditLog;
import com.project.civicpulse.entity.Report;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.AuditLogRepository;
import com.project.civicpulse.repository.ReportRepository;
import com.project.civicpulse.repository.UserRepository;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final MlSeverityService mlSeverityService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "IN_PROGRESS", "RESOLVED", "CANCELLED");

    @Transactional
    public ReportResponse createReport(String email, ReportRequest request) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Call ML prediction pipeline (trained on CivicLens historical data)
        MlSeverityService.MlPredictionResult mlResult = mlSeverityService.predictSeverity(request);

        Integer finalSeverity = mlResult.getSeverityScore() != null ? mlResult.getSeverityScore() : 65;
        String finalSeverityLevel = mlResult.getSeverityLevel() != null ? mlResult.getSeverityLevel() : "MEDIUM";
        Double finalConfidence = mlResult.getConfidence() != null ? mlResult.getConfidence() : 0.85;
        String finalModelVersion = mlResult.getModelVersion() != null ? mlResult.getModelVersion() : "civicpulse-v1";

        // Contextual features (from request or enriched by ML context)
        Map<String, Object> context = mlResult.getContext() != null ? mlResult.getContext() : Map.of();

        String ward = request.getWard() != null && !request.getWard().isBlank()
            ? request.getWard()
            : (request.getAreaName() != null ? request.getAreaName() : "Bengaluru");

        Double rainfall = request.getRainfall();
        if (rainfall == null && context.get("rainfall") instanceof Number num) {
            rainfall = num.doubleValue();
        }

        Integer traffic = null;
        if (request.getTraffic() != null) {
            traffic = request.getTraffic().intValue();
        } else if (context.get("traffic") instanceof Number num) {
            traffic = num.intValue();
        }

        Integer population = request.getPopulation();
        if (population == null && context.get("population") instanceof Number num) {
            population = num.intValue();
        }

        String department = request.getDepartment();
        if (department == null && context.get("department") instanceof String dept) {
            department = dept;
        }

        Map<String, Object> severityFactorsMap = new HashMap<>();
        if (request.getSeverityFactors() != null) {
            severityFactorsMap.putAll(request.getSeverityFactors());
        }
        severityFactorsMap.putAll(context);
        severityFactorsMap.put("mlPredictedPriority", finalSeverityLevel);
        severityFactorsMap.put("mlConfidence", finalConfidence);
        severityFactorsMap.put("mlModelVersion", finalModelVersion);
        severityFactorsMap.put("mlSeverityScore", finalSeverity);

        String factorsJson = null;
        try {
            factorsJson = objectMapper.writeValueAsString(severityFactorsMap);
        } catch (Exception ignored) {}

        Report report = Report.builder()
            .title(request.getTitle().trim())
            .description(request.getDescription().trim())
            .category(request.getCategory() != null ? request.getCategory() : "INFRASTRUCTURE")
            .issueType(request.getIssueType() != null ? request.getIssueType() : "General")
            .areaName(request.getAreaName() != null ? request.getAreaName() : "Bengaluru")
            .ward(ward)
            .latitude(request.getLatitude() != null ? request.getLatitude() : 12.9716)
            .longitude(request.getLongitude() != null ? request.getLongitude() : 77.5946)
            .severity(finalSeverity)
            .severityLevel(finalSeverityLevel)
            .mlConfidence(finalConfidence)
            .mlModelVersion(finalModelVersion)
            .rainfall(rainfall)
            .traffic(traffic)
            .population(population)
            .department(department)
            .status("PENDING")
            .hasImage(request.getHasImage() != null ? request.getHasImage() : (request.getImageUrl() != null && !request.getImageUrl().isBlank()))
            .imageUrl(request.getImageUrl())
            .evidenceConfidence((int) Math.round(finalConfidence * 100))
            .severityFactors(factorsJson)
            .user(currentUser)
            .deleted(false)
            .build();

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports(String email) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return reportRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports(String email) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (currentUser.getRole() == UserRole.CITIZEN) {
            throw new AccessDeniedException("Citizens cannot access municipal administrative report queues");
        }

        List<Report> reports;
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            // Super Admin has organization-wide visibility
            reports = reportRepository.findAllByDeletedFalseOrderByCreatedAtDesc();
        } else {
            // Municipal Admin is scoped to unassigned incidents + incidents assigned to this admin
            reports = reportRepository.findActiveReportsForAdmin(currentUser.getId());
        }

        return reports.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByDeletedFalseOrderByCreatedAtDesc().stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(String email, Long reportId) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Report report = reportRepository.findByIdAndDeletedFalse(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        if (currentUser.getRole() == UserRole.CITIZEN) {
            if (!report.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You do not have permission to access another citizen's report");
            }
            return mapToResponse(report);
        }

        if (currentUser.getRole() == UserRole.ADMIN) {
            // Admin-to-Admin isolation:
            // Allowed if unassigned OR assigned to current admin.
            // Denied if assigned to a different admin.
            if (report.getAssignedAdmin() != null && !report.getAssignedAdmin().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Incident is restricted to assigned administrator: " + report.getAssignedAdmin().getName());
            }
            return mapToResponse(report);
        }

        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return mapToResponse(report);
        }

        throw new AccessDeniedException("Unauthorized role");
    }

    @Transactional
    public ReportResponse updateReportStatus(String email, Long reportId, String status, String assignedTeam) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (currentUser.getRole() == UserRole.CITIZEN) {
            throw new AccessDeniedException("Citizens cannot modify incident status or dispatch teams");
        }

        Report report = reportRepository.findByIdAndDeletedFalse(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        // Admin-to-admin isolation check:
        if (currentUser.getRole() == UserRole.ADMIN) {
            if (report.getAssignedAdmin() != null && !report.getAssignedAdmin().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Cannot update an incident restricted to another administrator");
            }
            // Auto-assign to this admin if currently unassigned
            if (report.getAssignedAdmin() == null) {
                report.setAssignedAdmin(currentUser);
            }
        }

        String normalizedStatus = status != null ? status.trim().toUpperCase() : null;
        if (normalizedStatus != null) {
            validateStatusTransition(report.getStatus(), normalizedStatus, currentUser.getRole());
            report.setStatus(normalizedStatus);
        }

        if (assignedTeam != null && !assignedTeam.isBlank()) {
            report.setAssignedTeam(assignedTeam.trim());
            if (report.getStatus() == null || "PENDING".equalsIgnoreCase(report.getStatus())) {
                report.setStatus("IN_PROGRESS");
            }
        }

        Report saved = reportRepository.save(report);

        // Audit Log entry
        auditLogRepository.save(AuditLog.builder()
            .actorEmail(currentUser.getEmail())
            .actorRole(currentUser.getRole())
            .action("UPDATE_STATUS")
            .targetType("REPORT")
            .targetId(saved.getId())
            .details("Status: " + saved.getStatus() + ", Team: " + saved.getAssignedTeam())
            .timestamp(Instant.now())
            .build());

        return mapToResponse(saved);
    }

    // Backward-compatible signature
    @Transactional
    public ReportResponse updateReportStatus(Long reportId, String status, String assignedTeam) {
        Report report = reportRepository.findByIdAndDeletedFalse(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        String normalizedStatus = status != null ? status.trim().toUpperCase() : null;
        if (normalizedStatus != null) {
            validateStatusTransition(report.getStatus(), normalizedStatus, UserRole.ADMIN);
            report.setStatus(normalizedStatus);
        }

        if (assignedTeam != null && !assignedTeam.isBlank()) {
            report.setAssignedTeam(assignedTeam.trim());
            if (report.getStatus() == null || "PENDING".equalsIgnoreCase(report.getStatus())) {
                report.setStatus("IN_PROGRESS");
            }
        }

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    @Transactional
    public ReportResponse assignReport(String email, Long reportId, Long targetAdminId) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (currentUser.getRole() == UserRole.CITIZEN) {
            throw new AccessDeniedException("Citizens cannot assign incidents");
        }

        Report report = reportRepository.findByIdAndDeletedFalse(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        if (currentUser.getRole() == UserRole.ADMIN) {
            // Municipal admin can only claim unassigned incidents for themselves
            if (report.getAssignedAdmin() != null && !report.getAssignedAdmin().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Cannot reassign an incident restricted to another administrator");
            }
            if (targetAdminId != null && !targetAdminId.equals(currentUser.getId())) {
                throw new AccessDeniedException("Municipal administrators can only claim incidents for themselves");
            }
            report.setAssignedAdmin(currentUser);
        } else if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            if (targetAdminId == null) {
                report.setAssignedAdmin(null);
            } else {
                User targetAdmin = userRepository.findById(targetAdminId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target administrator not found"));
                if (targetAdmin.getRole() != UserRole.ADMIN && targetAdmin.getRole() != UserRole.SUPER_ADMIN) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot assign incident to non-administrator");
                }
                report.setAssignedAdmin(targetAdmin);
            }
        }

        Report saved = reportRepository.save(report);

        auditLogRepository.save(AuditLog.builder()
            .actorEmail(currentUser.getEmail())
            .actorRole(currentUser.getRole())
            .action("ASSIGN_INCIDENT")
            .targetType("REPORT")
            .targetId(saved.getId())
            .details("Assigned to: " + (saved.getAssignedAdmin() != null ? saved.getAssignedAdmin().getEmail() : "UNASSIGNED"))
            .timestamp(Instant.now())
            .build());

        return mapToResponse(saved);
    }

    @Transactional
    public void softDeleteReport(String email, Long reportId, String reason) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (currentUser.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Permanent or administrative report deletion requires SUPER_ADMIN role");
        }

        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        if (report.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report is already deleted");
        }

        report.setDeleted(true);
        report.setDeletedAt(Instant.now());
        report.setDeletedBy(currentUser.getEmail());
        report.setDeleteReason(reason != null && !reason.isBlank() ? reason.trim() : "Super Admin exceptional removal");

        reportRepository.save(report);

        auditLogRepository.save(AuditLog.builder()
            .actorEmail(currentUser.getEmail())
            .actorRole(currentUser.getRole())
            .action("DELETE_REPORT")
            .targetType("REPORT")
            .targetId(report.getId())
            .details("Reason: " + report.getDeleteReason())
            .timestamp(Instant.now())
            .build());

        log.info("SUPER_ADMIN {} soft-deleted report ID={} reason='{}'", currentUser.getEmail(), reportId, report.getDeleteReason());
    }

    private void validateStatusTransition(String currentStatus, String targetStatus, UserRole actorRole) {
        if (!VALID_STATUSES.contains(targetStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + targetStatus + ". Allowed: " + VALID_STATUSES);
        }

        if (currentStatus != null && currentStatus.equalsIgnoreCase(targetStatus)) {
            return;
        }

        if ("RESOLVED".equalsIgnoreCase(currentStatus) && actorRole != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot alter status of already RESOLVED report. Contact SUPER_ADMIN.");
        }

        if ("CANCELLED".equalsIgnoreCase(currentStatus) && actorRole != UserRole.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot alter status of CANCELLED report. Contact SUPER_ADMIN.");
        }
    }

    @Transactional(readOnly = true)
    public List<CitizenResponse> getCitizens() {
        List<User> citizens = userRepository.findByRoleOrderByIdAsc(UserRole.CITIZEN);
        return citizens.stream().map(user -> {
            long reportCount = reportRepository.countByUserIdAndDeletedFalse(user.getId());
            String residentialWard = "Not specified";
            Optional<Report> latestReport = reportRepository.findFirstByUserIdAndDeletedFalseOrderByCreatedAtDesc(user.getId());
            if (latestReport.isPresent()) {
                Report rep = latestReport.get();
                if (rep.getAreaName() != null && !rep.getAreaName().isBlank()) {
                    residentialWard = rep.getAreaName().trim();
                } else if (rep.getWard() != null && !rep.getWard().isBlank()) {
                    residentialWard = rep.getWard().trim();
                }
            }

            return CitizenResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "CITIZEN")
                .reportCount(reportCount)
                .civicPoints(0)
                .residentialWard(residentialWard)
                .build();
        }).toList();
    }

    private ReportResponse mapToResponse(Report report) {
        Map<String, Object> factors = null;
        if (report.getSeverityFactors() != null && !report.getSeverityFactors().isBlank()) {
            try {
                factors = objectMapper.readValue(report.getSeverityFactors(), new TypeReference<Map<String, Object>>() {});
            } catch (Exception ignored) {
                factors = Map.of();
            }
        } else {
            factors = Map.of();
        }

        return ReportResponse.builder()
            .id(report.getId())
            .title(report.getTitle())
            .description(report.getDescription())
            .category(report.getCategory() != null ? report.getCategory() : "INFRASTRUCTURE")
            .issueType(report.getIssueType() != null ? report.getIssueType() : "General")
            .areaName(report.getAreaName() != null ? report.getAreaName() : "Bengaluru")
            .ward(report.getWard())
            .latitude(report.getLatitude() != null ? report.getLatitude() : 12.9716)
            .longitude(report.getLongitude() != null ? report.getLongitude() : 77.5946)
            .severity(report.getSeverity() != null ? report.getSeverity() : 65)
            .severityLevel(report.getSeverityLevel() != null ? report.getSeverityLevel() : "MEDIUM")
            .mlConfidence(report.getMlConfidence())
            .mlModelVersion(report.getMlModelVersion())
            .rainfall(report.getRainfall())
            .traffic(report.getTraffic())
            .population(report.getPopulation())
            .department(report.getDepartment())
            .status(report.getStatus() != null ? report.getStatus() : "PENDING")
            .assignedTeam(report.getAssignedTeam())
            .hasImage(report.getHasImage() != null ? report.getHasImage() : false)
            .imageUrl(report.getImageUrl())
            .evidenceConfidence(report.getEvidenceConfidence() != null ? report.getEvidenceConfidence() : 88)
            .severityFactors(factors)
            .userId(report.getUser().getId())
            .userName(report.getUser().getName())
            .assignedAdminId(report.getAssignedAdmin() != null ? report.getAssignedAdmin().getId() : null)
            .assignedAdminName(report.getAssignedAdmin() != null ? report.getAssignedAdmin().getName() : null)
            .assignedAdminEmail(report.getAssignedAdmin() != null ? report.getAssignedAdmin().getEmail() : null)
            .deleted(report.isDeleted())
            .createdAt(report.getCreatedAt())
            .build();
    }
}
