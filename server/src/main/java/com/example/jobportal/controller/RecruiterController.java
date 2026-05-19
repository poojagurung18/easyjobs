package com.example.jobportal.controller;

import com.example.jobportal.dto.*;
import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.Recruiter;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.RecruiterRepository;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.*;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;
    private final JwtUtil jwtUtil;
    private final RecruiterRepository recruiterRepository;
    private final JobApplicationService jobApplicationService;
    private final JobCreditService jobCreditService;


    @PostMapping(value = "/profile", consumes = "multipart/form-data")
    public ProfileResponse createProfile(
            @ModelAttribute RecruiterRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        return recruiterService.updateProfile(userId, request);
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ProfileResponse update(
            @ModelAttribute RecruiterRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return recruiterService.updateProfile(userId, request);
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        return recruiterService.getProfile(userId);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteProfile(
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        recruiterService.deleteProfile(userId);

        return ResponseEntity.ok("Recruiter profile deleted successfully");
    }


    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(
            @RequestBody JobRequest jobRequest,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        Recruiter recruiter = recruiterRepository.getRecruiterByUserId(userId);
        if(!recruiter.isVerified()){
            throw JobException.forbidden("Recruiter not verified by admin");
        }

        jobCreditService.consumeCredit(recruiter.getId());

        JobResponse createdJob = jobService.createJob(recruiter, jobRequest);
        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getOwnJobs(
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        Recruiter recruiter = recruiterRepository.getRecruiterByUserId(userId);

        List<JobResponse> jobs = jobService.getJobsByRecruiter(recruiter);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody JobRequest jobRequest,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        JobResponse updatedJob =
                jobService.updateJob(jobId, userId, jobRequest);

        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long jobId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        jobService.deleteJob(jobId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/credits")
    public ResponseEntity<Long> getCredits(
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        Recruiter recruiter = recruiterRepository.getRecruiterByUserId(userId);

        long credits = jobCreditService.getAvailableCredits(recruiter.getId());

        return ResponseEntity.ok(credits);
    }


    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        List<JobApplication> applications =
                jobApplicationService.getApplicationsForRecruiter(userId);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(
            @PathVariable Long jobId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        List<JobApplication> applications =
                jobApplicationService.getApplicationsForRecruiterJob(jobId, userId);

        return ResponseEntity.ok(applications);
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody ApplicationStatusUpdateRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        jobApplicationService.updateApplicationStatus(
                applicationId,
                userId,
                request.getStatus(),
                request.getInterviewDate()
        );

        return ResponseEntity.ok("Application status updated successfully");
    }

}
