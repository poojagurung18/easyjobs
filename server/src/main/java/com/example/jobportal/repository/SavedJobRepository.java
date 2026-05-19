package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.SavedJob;
import com.example.jobportal.entity.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findBySeekerOrderBySavedAtDesc(Seeker seeker);
    Optional<SavedJob> findBySeekerAndJob(Seeker seeker, Job job);
    boolean existsBySeekerAndJob(Seeker seeker, Job job);
    void deleteBySeekerAndJob(Seeker seeker, Job job);
}
