package com.example.jobportal.payment;

import com.example.jobportal.entity.Plan;
import com.example.jobportal.repository.PlanRepository;
import org.springframework.stereotype.Service;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.math.BigDecimal;

@Service
public class PaymentService {

    public PaymentResponse createPayment(Long recruiterId) throws Exception {

        long amount = 100 * 100;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/dashboard/recruiter/jobs")
                .setCancelUrl("http://localhost:8080/payment/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("npr")
                                                .setUnitAmount(amount)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Job Posting Credit")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("recruiterId", recruiterId.toString())
                .build();

        Session session = Session.create(params);

        return new PaymentResponse(
                session.getId(),
                session.getUrl(),
                new BigDecimal("100"),
                "NPR",
                "JOB_CREDIT"
        );
    }
}
