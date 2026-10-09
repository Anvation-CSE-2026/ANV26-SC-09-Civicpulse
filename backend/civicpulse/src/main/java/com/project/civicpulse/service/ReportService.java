package com.project.civicpulse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.civicpulse.dto.CitizenResponse;
import com.project.civicpulse.dto.ReportRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.entity.Report;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.ReportRepository;
import com.project.civicpulse.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    private final MlSeverityService mlSeverityService;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, String status, String assignedTeam) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with ID: " + reportId));

        if (status != null && !status.isBlank()) {
            report.setStatus(status.trim().toUpperCase());
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
            .createdAt(report.getCreatedAt())
            .build();
    }

    @Transactional(readOnly = true)
    public List<CitizenResponse> getCitizens() {
        List<User> citizens = userRepository.findByRoleOrderByIdAsc(UserRole.CITIZEN);
        return citizens.stream().map(user -> {
            long reportCount = reportRepository.countByUserId(user.getId());
            String residentialWard = "Not specified";
            Optional<Report> latestReport = reportRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId());
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
}
