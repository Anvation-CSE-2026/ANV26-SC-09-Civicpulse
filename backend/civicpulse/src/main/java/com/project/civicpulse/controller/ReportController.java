package com.project.civicpulse.controller;

import com.project.civicpulse.dto.ReportRequest;
import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.service.ReportService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
        @Valid @RequestBody ReportRequest request,
        Authentication authentication
    ) {
        ReportResponse response = reportService.createReport(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReportResponse>> getMyReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getMyReports(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(reportService.getReportById(authentication.getName(), id));
    }
}
