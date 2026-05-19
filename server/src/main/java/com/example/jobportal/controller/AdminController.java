package com.example.jobportal.controller;

import com.example.jobportal.dto.ProfileResponse;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    @DeleteMapping
    public ResponseEntity<String> deleteOwnAccount(
            HttpServletRequest httpServletRequest) {

        Long adminUserId = jwtUtil.getUserIdFromRequest(httpServletRequest);

        adminService.deleteAdminAccount(adminUserId);

        return ResponseEntity.ok("Admin account deleted successfully");
    }

    @PutMapping("/recruiter/{recruiterId}/reset-report")
    public ResponseEntity<String> resetRecruiterReport(@PathVariable Long recruiterId) {

        adminService.resetRecruiterReport(recruiterId);

        return ResponseEntity.ok("Recruiter report reset to 0");
    }

    @PutMapping("/recruiter/{recruiterId}/toggle-block")
    public ResponseEntity<String> toggleBlockRecruiter(@PathVariable Long recruiterId) {
        adminService.toggleBlockRecruiter(recruiterId);
        return ResponseEntity.ok("Recruiter block status toggled");
    }

    @DeleteMapping("/recruiter/{recruiterId}")
    public ResponseEntity<String> deleteRecruiter(@PathVariable Long recruiterId) {

        adminService.deleteRecruiter(recruiterId);

        return ResponseEntity.ok("Recruiter deleted successfully");
    }

    @GetMapping("/recruiters/reported")
    public ResponseEntity<List<ProfileResponse>> getReportedRecruiters() {
        List<ProfileResponse> recruiters = adminService.getReportedRecruiters();
        return ResponseEntity.ok(recruiters);
    }

    @GetMapping("/recruiters/unverified")
    public ResponseEntity<List<ProfileResponse>> getUnverifiedRecruiters() {
        return ResponseEntity.ok(adminService.getUnverifiedRecruiters());
    }

    @PutMapping("/recruiter/{recruiterId}/verify")
    public ResponseEntity<String> verifyRecruiter(@PathVariable Long recruiterId) {
        adminService.verifyRecruiter(recruiterId);
        return ResponseEntity.ok("Recruiter verified successfully");
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<ProfileResponse> getRecruiterProfile(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(adminService.getRecruiterProfile(recruiterId));
    }

}