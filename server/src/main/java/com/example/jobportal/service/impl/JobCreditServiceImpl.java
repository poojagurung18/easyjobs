package com.example.jobportal.service.impl;

import com.example.jobportal.entity.JobCredit;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.JobCreditRepository;
import com.example.jobportal.service.JobCreditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JobCreditServiceImpl implements JobCreditService {

    private final JobCreditRepository jobCreditRepository;

    @Override
    public void createCredit(Long recruiterId, String paymentIntent) {


        if (jobCreditRepository.existsByStripePaymentIntentId(paymentIntent)) {
            return;
        }

        JobCredit credit = JobCredit.builder()
                .recruiterId(recruiterId)
                .used(false)
                .stripePaymentIntentId(paymentIntent)
                .createdAt(LocalDateTime.now())
                .build();

        jobCreditRepository.save(credit);
    }

    @Override
    public JobCredit consumeCredit(Long recruiterId) {

        JobCredit credit = jobCreditRepository
                .findFirstByRecruiterIdAndUsedFalseOrderByCreatedAtAsc(recruiterId)
                .orElseThrow(() -> JobException.paymentRequired(
                        "No credits available. Please purchase a job credit first."
                ));

        credit.setUsed(true);
        return jobCreditRepository.save(credit);
    }

    @Override
    public long getAvailableCredits(Long recruiterId) {
        return jobCreditRepository.countByRecruiterIdAndUsedFalse(recruiterId);
    }
}
