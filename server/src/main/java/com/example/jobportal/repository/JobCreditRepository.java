package com.example.jobportal.repository;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobCredit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobCreditRepository extends JpaRepository<JobCredit, Long> {
    Optional<JobCredit> findFirstByRecruiterIdAndUsedFalseOrderByCreatedAtAsc(Long recruiterId);

    boolean existsByStripePaymentIntentId(String paymentIntent);

    long countByRecruiterIdAndUsedFalse(Long recruiterId);
}
