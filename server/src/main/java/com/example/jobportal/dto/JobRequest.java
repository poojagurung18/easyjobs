package com.example.jobportal.dto;

import com.example.jobportal.enums.JobStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String location;
    private String salary;
    private JobStatus status;
    private LocalDate deadline;
    private Integer noOfOpenings;
    private List<String> requiredDocuments;
}