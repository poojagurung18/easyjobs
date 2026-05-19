package com.example.jobportal.controller;

import com.example.jobportal.cloudinary.CloudinaryService;
import com.example.jobportal.dto.ProfileResponse;
import com.example.jobportal.dto.SeekerRequest;
import com.example.jobportal.dto.SeekerResponse;
import com.example.jobportal.entity.JobDocument;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.JobApplicationService;
import com.example.jobportal.service.JobService;
import com.example.jobportal.service.RecruiterService;
import com.example.jobportal.service.SeekerService;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/seeker")
@RequiredArgsConstructor
public class SeekerController {

    private final JwtUtil jwtUtil;
    private final SeekerService seekerService;
    private final RecruiterService recruiterService;
    private final JobService jobService;

    private final CloudinaryService cloudinaryService;
    private final JobApplicationService jobApplicationService;
    private final com.example.jobportal.service.SavedJobService savedJobService;


    @PostMapping("/profile")
    public ResponseEntity<SeekerResponse> update(
            @RequestBody SeekerRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return ResponseEntity.ok(seekerService.createProfile(userId, request));
    }

    @GetMapping("/profile")
    public SeekerResponse getProfile(HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return seekerService.getProfile(userId);
    }

    @PutMapping("/profile")
    public ResponseEntity<SeekerResponse> updateProfile(
            @RequestBody SeekerRequest request,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return ResponseEntity.ok(seekerService.createProfile(userId, request));
    }


    @PostMapping(value = "/apply/{jobId}", consumes = "multipart/form-data")
    public ResponseEntity<?> applyJob(
            @PathVariable Long jobId,
            @RequestParam("resume") MultipartFile resume,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestParam(value = "additionalFiles", required = false) List<MultipartFile> additionalFiles,
            @RequestParam(value = "additionalFileNames", required = false) List<String> additionalFileNames,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        if (resume == null || resume.isEmpty()) {
            return ResponseEntity.badRequest().body("Resume file is required");
        }

        String result = cloudinaryService.uploadPDF(resume);
        String[] parts = result.split("\\|");

        String resumeUrl = parts[0];
        String publicId = parts[1];

        List<JobDocument> uploadedDocuments = new ArrayList<>();
        if (additionalFiles != null && additionalFileNames != null) {
            for (int i = 0; i < additionalFiles.size(); i++) {
                MultipartFile file = additionalFiles.get(i);
                String name = additionalFileNames.get(i);
                String docResult = cloudinaryService.uploadDocument(file);
                String[] docParts = docResult.split("\\|");
                uploadedDocuments.add(JobDocument.builder()
                        .name(name)
                        .url(docParts[0])
                        .publicId(docParts[1])
                        .build());
            }
        }

        jobApplicationService.applyJob(userId, jobId, resumeUrl, publicId, coverLetter, uploadedDocuments);

        return ResponseEntity.ok("Job applied successfully");
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getMyApplications(HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        Long seekerId = seekerService.getSeekerIdByUserId(userId);

        var applications = jobApplicationService.getApplicationsBySeeker(seekerId);
        return ResponseEntity.ok(applications);
    }

    // ==============================
    // 🔖 SAVED JOBS
    // ==============================

    @PostMapping("/jobs/{jobId}/save")
    public ResponseEntity<String> saveJob(
            @PathVariable Long jobId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        savedJobService.saveJob(userId, jobId);
        return ResponseEntity.ok("Job saved successfully");
    }

    @DeleteMapping("/jobs/{jobId}/save")
    public ResponseEntity<String> unsaveJob(
            @PathVariable Long jobId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        savedJobService.unsaveJob(userId, jobId);
        return ResponseEntity.ok("Job removed from saved list");
    }

    @GetMapping("/jobs/saved")
    public ResponseEntity<?> getSavedJobs(HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return ResponseEntity.ok(savedJobService.getSavedJobs(userId));
    }

    @GetMapping("/jobs/{jobId}/is-saved")
    public ResponseEntity<Boolean> isJobSaved(
            @PathVariable Long jobId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        return ResponseEntity.ok(savedJobService.isJobSaved(userId, jobId));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ProfileResponse> viewRecruiterProfile(
            @PathVariable Long recruiterId) {

        return ResponseEntity.ok(recruiterService.getRecruiterProfile(recruiterId));
    }


    @PostMapping("/report/{recruiterId}")
    public ResponseEntity<String> reportRecruiter(
            @PathVariable Long recruiterId,
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);
        seekerService.reportRecruiter(userId, recruiterId);

        return ResponseEntity.ok("Recruiter reported successfully");
    }

    @GetMapping("/recommended-jobs")
    public ResponseEntity<?> getRecommendedJobs(
            HttpServletRequest httpServletRequest) {

        Long userId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        var jobs = jobApplicationService.getRecommendedJobs(userId);

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minSalary) {

        var jobs = jobService.searchJobs(keyword, location, minSalary);

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {

        var jobs = jobService.getAllOpenJobs();

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<?> getJobById(@PathVariable Long jobId) {

        var job = jobService.getJobById(jobId);

        return ResponseEntity.ok(job);
    }

}