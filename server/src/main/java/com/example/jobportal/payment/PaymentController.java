package com.example.jobportal.payment;

import com.example.jobportal.entity.Recruiter;
import com.example.jobportal.repository.RecruiterRepository;
import com.example.jobportal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;
    private final RecruiterRepository recruiterRepository;

    @PostMapping("/create")
    public PaymentResponse createPayment(jakarta.servlet.http.HttpServletRequest request) throws Exception {

        Long userId = jwtUtil.getUserIdFromRequest(request);

        Recruiter recruiter = recruiterRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return paymentService.createPayment(recruiter.getId());
    }
}