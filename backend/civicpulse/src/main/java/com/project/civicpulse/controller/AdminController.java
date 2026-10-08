package com.project.civicpulse.controller;

import com.project.civicpulse.dto.ReportResponse;
import com.project.civicpulse.service.ReportService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ReportService reportService;

    public AdminController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ReportResponse> updateReportStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        String assignedTeam = payload.get("assignedTeam");
        return ResponseEntity.ok(reportService.updateReportStatus(id, status, assignedTeam));
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
