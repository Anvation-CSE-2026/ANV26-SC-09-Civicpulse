package com.project.civicpulse.service;

import com.project.civicpulse.dto.ReportRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.entity.Report;
import com.project.civicpulse.entity.User;
import com.project.civicpulse.enums.UserRole;
import com.project.civicpulse.repository.ReportRepository;
import com.project.civicpulse.repository.UserRepository;
import java.util.List;
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

    @Transactional
    public ReportResponse createReport(String email, ReportRequest request) {
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Report report = Report.builder()
            .title(request.getTitle().trim())
            .description(request.getDescription().trim())
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
        return ReportResponse.builder()
            .id(report.getId())
            .title(report.getTitle())
            .description(report.getDescription())
            .userId(report.getUser().getId())
            .userName(report.getUser().getName())
            .createdAt(report.getCreatedAt())
            .build();
    }
}
