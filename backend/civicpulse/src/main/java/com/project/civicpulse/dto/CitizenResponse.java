package com.project.civicpulse.dto;

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
public class CitizenResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private long reportCount;
    private int civicPoints;
    private String residentialWard;
}
