package com.example.jobportal.dto;

import com.example.jobportal.enums.JobStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String salary;
    private JobStatus status;
    private Long recruiterId;
    private String recruiterName;
    private LocalDate deadline;
    private Integer noOfOpenings;
    private List<String> requiredDocuments;
    private String recruiterLogo;
}
