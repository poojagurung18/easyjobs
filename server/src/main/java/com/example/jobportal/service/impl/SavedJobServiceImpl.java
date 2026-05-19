package com.example.jobportal.service.impl;

import com.example.jobportal.dto.JobResponse;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.SavedJob;
import com.example.jobportal.entity.Seeker;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.JobRepository;
import com.example.jobportal.repository.SavedJobRepository;
import com.example.jobportal.repository.SeekerRepository;
import com.example.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final SeekerRepository seekerRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public void saveJob(Long userId, Long jobId) {
        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> new JobException("Seeker not found", HttpStatus.NOT_FOUND));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobException("Job not found", HttpStatus.NOT_FOUND));

        if (savedJobRepository.existsBySeekerAndJob(seeker, job)) {
            return; // Already saved
        }

        SavedJob savedJob = SavedJob.builder()
                .seeker(seeker)
                .job(job)
                .build();
        
        savedJobRepository.save(savedJob);
    }

    @Override
    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> new JobException("Seeker not found", HttpStatus.NOT_FOUND));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobException("Job not found", HttpStatus.NOT_FOUND));

        savedJobRepository.deleteBySeekerAndJob(seeker, job);
    }

    @Override
    public List<JobResponse> getSavedJobs(Long userId) {
        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> new JobException("Seeker not found", HttpStatus.NOT_FOUND));
        
        return savedJobRepository.findBySeekerOrderBySavedAtDesc(seeker)
                .stream()
                .map(SavedJob::getJob)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isJobSaved(Long userId, Long jobId) {
        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> new JobException("Seeker not found", HttpStatus.NOT_FOUND));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobException("Job not found", HttpStatus.NOT_FOUND));

        return savedJobRepository.existsBySeekerAndJob(seeker, job);
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .status(job.getStatus())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getCompanyName())
                .deadline(job.getDeadline())
                .noOfOpenings(job.getNoOfOpenings())
                .requiredDocuments(job.getRequiredDocuments())
                .recruiterLogo(job.getRecruiter().getCompanyLogo())
                .build();
    }
}
