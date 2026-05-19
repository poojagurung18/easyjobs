package com.example.jobportal.service;

import com.example.jobportal.entity.JobCredit;

public interface JobCreditService {

    void createCredit(Long recruiterId, String paymentIntent);

    JobCredit consumeCredit(Long recruiterId);

    long getAvailableCredits(Long recruiterId);
}
