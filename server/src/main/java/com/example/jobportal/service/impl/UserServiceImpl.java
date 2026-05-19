package com.example.jobportal.service.impl;

import com.example.jobportal.dto.*;
import com.example.jobportal.entity.Otp;
import com.example.jobportal.entity.User;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.OtpRepository;
import com.example.jobportal.repository.UserRepository;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.EmailService;
import com.example.jobportal.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private Map<String, RegisterRequest> tempUserStore = new HashMap<>();

    @Override
    public Response sendOtp(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw JobException.badRequest("Email already registered");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        tempUserStore.put(request.getEmail(), request);

        Otp otpEntity = otpRepository.findByEmail(request.getEmail())
                .orElse(new Otp());

        otpEntity.setEmail(request.getEmail());
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpEntity);

        emailService.sendOtp(request.getEmail(), otp);

        System.out.println("OTP: " + otp);

        return new Response("OTP sent successfully");
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> JobException.unauthorized("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw JobException.unauthorized("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    @Override
    public List<User> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();

            if (users.isEmpty()) {
                throw JobException.notFound("No users found");
            }

            return users;
        } catch (Exception e) {
            throw JobException.badRequest("Failed to retrieve users. Please try again.");
        }
    }

    @Override
    public LoginResponse verifyOtp(OtpRequest request) {
        try {
            log.info("=== OTP Verification Started ===");
            log.info("Email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                log.error("Email is null or empty");
                throw JobException.badRequest("Email is required for OTP verification");
            }
            
            if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
                log.error("OTP is null or empty");
                throw JobException.badRequest("OTP is required");
            }
            
            log.info("Looking for OTP record for email: {}", request.getEmail());
            Otp otpEntity = otpRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.error("OTP not found for email: {}", request.getEmail());
                        return JobException.badRequest("OTP not found. Please request a new OTP");
                    });
            
            log.info("OTP found. Checking expiry...");
            if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
                log.error("OTP expired for email: {}", request.getEmail());
                throw JobException.badRequest("OTP has expired. Please request a new OTP");
            }
            
            log.info("Comparing OTPs. Expected: {}, Provided: {}", otpEntity.getOtp(), request.getOtp());
            if (!otpEntity.getOtp().equals(request.getOtp())) {
                log.error("OTP mismatch for email: {}. Expected: {}, Got: {}", request.getEmail(), otpEntity.getOtp(), request.getOtp());
                throw JobException.badRequest("Invalid OTP. Please enter the correct OTP");
            }
            
            log.info("OTP verified. Looking for registration data for email: {}", request.getEmail());
            RegisterRequest registerRequest = tempUserStore.get(request.getEmail());
            
            if (registerRequest == null) {
                log.error("Registration data not found for email: {}. Available keys: {}", request.getEmail(), tempUserStore.keySet());
                throw JobException.badRequest("Registration data expired. Please register again");
            }
            
            log.info("Registration data found. Creating user...");
            User user = registerUser(registerRequest);
            log.info("User created successfully. UserId: {}, Email: {}, Role: {}", user.getId(), user.getEmail(), user.getRole());
            
            // Cleanup
            tempUserStore.remove(request.getEmail());
            otpRepository.delete(otpEntity);
            log.info("OTP and temp data cleaned up");
            
            // Generate JWT token for the newly registered user
            log.info("Generating JWT token for user: {}", user.getEmail());
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            log.info("JWT token generated successfully");
            
            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .role(user.getRole().name())
                    .userId(user.getId())
                    .email(user.getEmail())
                    .build();
            
            log.info("=== OTP Verification Completed Successfully ===");
            return response;
            
        } catch (JobException ex) {
            log.error("JobException during OTP verification: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during OTP verification", ex);
            throw JobException.internalServerError("An unexpected error occurred during OTP verification: " + ex.getMessage());
        }
    }

    private User registerUser(RegisterRequest request) {
        try {
            log.info("Starting user registration for email: {}", request.getEmail());
            
            if (userRepository.existsByEmail(request.getEmail())) {
                log.error("Email already registered: {}", request.getEmail());
                throw JobException.badRequest("Email already exists");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());

            log.info("User object created. Name: {}, Email: {}, Role: {}", user.getName(), user.getEmail(), user.getRole());
            
            User savedUser = userRepository.save(user);
            log.info("User saved successfully. UserId: {}", savedUser.getId());
            
            return savedUser;
            
        } catch (JobException ex) {
            log.error("JobException during user registration: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during user registration", ex);
            throw JobException.internalServerError("Failed to register user: " + ex.getMessage());
        }
    }
}