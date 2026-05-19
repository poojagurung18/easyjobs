package com.example.jobportal.service;

import com.example.jobportal.dto.JobResponse;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.SavedJob;
import java.util.List;

public interface SavedJobService {
    void saveJob(Long userId, Long jobId);
    void unsaveJob(Long userId, Long jobId);
    List<JobResponse> getSavedJobs(Long userId);
    boolean isJobSaved(Long userId, Long jobId);
}
