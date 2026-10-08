package com.project.civicpulse.dto;

import java.time.Instant;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String issueType;
    private String areaName;
    private Double latitude;
    private Double longitude;
    private Integer severity;
    private String status;
    private String assignedTeam;
    private Boolean hasImage;
    private String imageUrl;
    private Integer evidenceConfidence;
    private Map<String, Object> severityFactors;
    private Long userId;
    private String userName;
    private Instant createdAt;
}
