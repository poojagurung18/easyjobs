package com.example.jobportal.entity;

import com.example.jobportal.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "job_applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seeker_id")
    private Seeker seeker;

    // ✅ Job
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    // ✅ Recruiter (NEW)
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Recruiter recruiter;

    // Resume info from Cloudinary
    private String resumeUrl;
    private String resumePublicId;

    // Optional cover letter
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    // Status: APPLIED, SHORTLISTED, REJECTED
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    // Application timestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date appliedAt;

    // Interview date & time (only when shortlisted)
    @Temporal(TemporalType.TIMESTAMP)
    private Date interviewDate;

    @ElementCollection
    @CollectionTable(name = "job_application_documents", joinColumns = @JoinColumn(name = "application_id"))
    private List<JobDocument> uploadedDocuments = new ArrayList<>();
}