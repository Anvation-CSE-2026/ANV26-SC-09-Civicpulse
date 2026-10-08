package com.project.civicpulse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.ReportRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.entity.Report;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.ReportRepository;
import com.project.civicpulse.repository.UserRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ReportResponse createReport(String email, ReportRequest request) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        String factorsJson = null;
        if (request.getSeverityFactors() != null) {
            try {
                factorsJson = objectMapper.writeValueAsString(request.getSeverityFactors());
            } catch (Exception ignored) {}
        }

        Report report = Report.builder()
            .title(request.getTitle().trim())
            .description(request.getDescription().trim())
            .category(request.getCategory() != null ? request.getCategory() : "INFRASTRUCTURE")
            .issueType(request.getIssueType() != null ? request.getIssueType() : "General")
            .areaName(request.getAreaName() != null ? request.getAreaName() : "Bengaluru")
            .latitude(request.getLatitude() != null ? request.getLatitude() : 12.9716)
            .longitude(request.getLongitude() != null ? request.getLongitude() : 77.5946)
            .severity(request.getSeverity() != null ? request.getSeverity() : 65)
            .status("PENDING")
            .hasImage(request.getHasImage() != null ? request.getHasImage() : (request.getImageUrl() != null && !request.getImageUrl().isBlank()))
            .imageUrl(request.getImageUrl())
            .evidenceConfidence(request.getEvidenceConfidence() != null ? request.getEvidenceConfidence() : 88)
            .severityFactors(factorsJson)
            .user(currentUser)
            .build();

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports(String email) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return reportRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(String email, Long reportId) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        if (currentUser.getRole() == UserRole.ADMIN || report.getUser().getId().equals(currentUser.getId())) {
            return mapToResponse(report);
        }

        throw new AccessDeniedException("You do not have permission to access this report");
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
            .latitude(report.getLatitude() != null ? report.getLatitude() : 12.9716)
            .longitude(report.getLongitude() != null ? report.getLongitude() : 77.5946)
            .severity(report.getSeverity() != null ? report.getSeverity() : 65)
            .status(report.getStatus() != null ? report.getStatus() : "PENDING")
            .hasImage(report.getHasImage() != null ? report.getHasImage() : false)
            .imageUrl(report.getImageUrl())
            .evidenceConfidence(report.getEvidenceConfidence() != null ? report.getEvidenceConfidence() : 88)
            .severityFactors(factors)
            .userId(report.getUser().getId())
            .userName(report.getUser().getName())
            .createdAt(report.getCreatedAt())
            .build();
    }
}
