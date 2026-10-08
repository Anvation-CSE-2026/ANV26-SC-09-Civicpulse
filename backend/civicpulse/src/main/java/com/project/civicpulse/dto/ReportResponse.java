package com.project.civicpulse.dto;

import java.time.Instant;
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
    private Long userId;
    private String userName;
    private Instant createdAt;
}
