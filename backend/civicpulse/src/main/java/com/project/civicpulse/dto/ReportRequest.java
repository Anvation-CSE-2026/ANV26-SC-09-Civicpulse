package com.project.civicpulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ReportRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    private String description;

    private String category;

    private String issueType;

    private String areaName;
    private String ward;

    private Double latitude;

    private Double longitude;

    private Integer severity;

    private Double rainfall;

    private Double traffic;

    private Integer population;

    private String department;

    private String status;

    private Boolean hasImage;

    private String imageUrl;

    private Integer evidenceConfidence;

    private Map<String, Object> severityFactors;
}
