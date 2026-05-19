package com.example.jobportal.service.impl;

import com.example.jobportal.dto.JobRequest;
import com.example.jobportal.dto.JobResponse;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.Recruiter;
import com.example.jobportal.enums.JobStatus;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.JobApplicationRepository;
import com.example.jobportal.repository.JobRepository;
import com.example.jobportal.service.JobService;
import com.example.jobportal.service.JobCreditService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JobCreditService jobCreditService;

    @Override
    public JobResponse createJob(Recruiter recruiter, JobRequest request) {

        if (recruiter.isBlocked()) {
            throw JobException.unauthorized("You are blocked and cannot create jobs");
        }


        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN)
                .recruiter(recruiter)
                .deadline(request.getDeadline())
                .noOfOpenings(request.getNoOfOpenings())
                .requiredDocuments(request.getRequiredDocuments())
                .build();

        try {
            Job saved = jobRepository.save(job);
            return mapToResponse(saved);
        } catch (Exception e) {
            throw JobException.internalServerError("Failed to save job");
        }
    }

    @Override
    public List<JobResponse> getJobsByRecruiter(Recruiter recruiter) {
        return jobRepository.findByRecruiter(recruiter)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public JobResponse updateJob(Long jobId, Long userId, JobRequest request) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> JobException.notFound("Job not found"));

        if (!job.getRecruiter().getUser().getId().equals(userId)) {
            throw JobException.unauthorized("You are not allowed to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());
        job.setNoOfOpenings(request.getNoOfOpenings());
        job.setRequiredDocuments(request.getRequiredDocuments());

        if (request.getStatus() != null) {
            if (job.getStatus() == JobStatus.CLOSED && request.getStatus() == JobStatus.OPEN) {
                // Reopening a closed job requires consuming another credit (100 NPR / 100 rs)
                jobCreditService.consumeCredit(job.getRecruiter().getId());
            }
            job.setStatus(request.getStatus());
        }

        try {
            return mapToResponse(jobRepository.save(job));
        } catch (Exception e) {
            throw JobException.internalServerError("Failed to update job");
        }
    }

    @Override
    public void deleteJob(Long jobId, Long userId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> JobException.notFound("Job not found"));

        if (!job.getRecruiter().getUser().getId().equals(userId)) {
            throw JobException.unauthorized("You are not allowed to delete this job");
        }

        try {
            jobApplicationRepository.deleteByJob(job);
            jobRepository.delete(job);
        } catch (Exception e) {
            throw JobException.internalServerError("Failed to delete job");
        }
    }

    @Override
    public List<JobResponse> searchJobs(String keyword, String location, Double minSalary) {

        return jobRepository.findAll().stream()
                .filter(j -> keyword == null ||
                        j.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                        j.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .filter(j -> location == null || j.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(j -> {
                    if (minSalary == null) return true;
                    try {
                        // Remove commas and non-numeric chars except decimal point
                        String salaryStr = j.getSalary().replaceAll("[^\\d.]", "");
                        if (salaryStr.isEmpty()) return true; // Keep "Negotiable" or empty strings
                        return Double.parseDouble(salaryStr) >= minSalary;
                    } catch (Exception e) {
                        return true; // Keep if parsing fails (e.g. text-only salaries)
                    }
                })
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<JobResponse> getAllOpenJobs() {

        return jobRepository.findByStatus(JobStatus.OPEN)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public JobResponse getJobById(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> JobException.notFound("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw JobException.badRequest("Job is not available");
        }

        return mapToResponse(job);
    }

    @Override
     @Scheduled(cron = "0 0 0 * * *") // Run daily at midnight
     @Transactional
     public void closeExpiredJobs() {
         List<Job> expiredJobs = jobRepository.findAllByStatusAndDeadlineBefore(
                 JobStatus.OPEN,
                 LocalDate.now()
         );
 
         if (!expiredJobs.isEmpty()) {
             expiredJobs.forEach(job -> job.setStatus(JobStatus.CLOSED));
             jobRepository.saveAll(expiredJobs);
         }
     }
 
     private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .status(job.getStatus())
                .recruiterId(job.getRecruiter() != null ? job.getRecruiter().getId() : null)
                .recruiterName(job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : null)
                .deadline(job.getDeadline())
                .noOfOpenings(job.getNoOfOpenings())
                .requiredDocuments(job.getRequiredDocuments())
                .recruiterLogo(job.getRecruiter() != null ? job.getRecruiter().getCompanyLogo() : null)
                .build();
    }
}