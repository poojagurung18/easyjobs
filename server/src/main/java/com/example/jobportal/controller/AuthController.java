package com.example.jobportal.controller;

import com.example.jobportal.dto.*;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Slf4j
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody RegisterRequest request) {
        try {
            log.info("Registering user with email: {}", request.getEmail());
            return ResponseEntity.ok(userService.sendOtp(request));
        } catch (JobException ex) {
            log.error("Error during registration: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during registration", ex);
            throw JobException.internalServerError("An unexpected error occurred during registration");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request, HttpServletResponse httpServletResponse) {
        try {
            log.info("Verifying OTP for email: {}", request.getEmail());
            
            // Validate request
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                log.error("Email is missing in OTP verification request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Email is required", HttpStatus.BAD_REQUEST));
            }
            
            if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
                log.error("OTP is missing in verification request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("OTP is required", HttpStatus.BAD_REQUEST));
            }
            
            log.info("Proceeding with OTP verification for email: {}", request.getEmail());
            LoginResponse response = userService.verifyOtp(request);
            log.info("OTP verification successful for email: {}", request.getEmail());

            setTokenCookie(httpServletResponse, response.getToken(), 7 * 24 * 60 * 60);

            return ResponseEntity.ok(response);
            
        } catch (JobException ex) {
            log.error("JobException during OTP verification: Status={}, Message={}", ex.getStatus(), ex.getMessage());
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("timestamp", LocalDateTime.now());
            errorBody.put("status", ex.getStatus().value());
            errorBody.put("error", ex.getStatus().getReasonPhrase());
            errorBody.put("message", ex.getMessage());
            return ResponseEntity.status(ex.getStatus()).body(errorBody);
            
        } catch (Exception ex) {
            log.error("Unexpected error during OTP verification", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        try {
            log.info("Login attempt for email: {}", loginRequest.getEmail());
            LoginResponse response = userService.loginUser(loginRequest);

            setTokenCookie(httpServletResponse, response.getToken(), 7 * 24 * 60 * 60);

            return ResponseEntity.ok(response);
        } catch (JobException ex) {
            log.error("Error during login: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during login", ex);
            throw JobException.internalServerError("An unexpected error occurred during login");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Response> logoutUser(HttpServletResponse response) {
        setTokenCookie(response, null, 0);
        return ResponseEntity.ok(new Response("Logged out successfully"));
    }

    private void setTokenCookie(HttpServletResponse response, String token, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
    
    private Map<String, Object> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        return errorResponse;
    }
}
