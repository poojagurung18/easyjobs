package com.example.jobportal.service.impl;

import com.example.jobportal.dto.ProfileResponse;
import com.example.jobportal.entity.Recruiter;
import com.example.jobportal.entity.User;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.RecruiterRepository;
import com.example.jobportal.repository.UserRepository;
import com.example.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;

    @Override
    public void deleteAdminAccount(Long adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> JobException.notFound("Admin not found"));

        userRepository.delete(admin);
    }

    @Override
    public void resetRecruiterReport(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterId)
                .orElseThrow(() -> JobException.notFound("Recruiter not found"));

        recruiter.setReportCount(0);
        recruiterRepository.save(recruiter);
    }

    @Override
    public void deleteRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterId)
                .orElseThrow(() -> JobException.notFound("Recruiter not found"));

        User user = recruiter.getUser();

        recruiterRepository.delete(recruiter);
        userRepository.delete(user);
    }

    @Override
    public List<ProfileResponse> getReportedRecruiters() {
        List<Recruiter> recruiters = recruiterRepository.findByReportCountGreaterThan(2);

        return recruiters.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void verifyRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        recruiter.setVerified(true);

        recruiterRepository.save(recruiter);
    }

    @Override
    public void toggleBlockRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterId)
                .orElseThrow(() -> JobException.notFound("Recruiter not found"));

        recruiter.setBlocked(!recruiter.isBlocked());
        recruiterRepository.save(recruiter);
    }

    public List<ProfileResponse> getUnverifiedRecruiters() {

        List<Recruiter> recruiters = recruiterRepository.findByIsVerifiedFalse();

        return recruiters.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProfileResponse getRecruiterProfile(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterId)
                .orElseThrow(() -> JobException.notFound("Recruiter not found"));
        return mapToResponse(recruiter);
    }

    private ProfileResponse mapToResponse(Recruiter recruiter) {
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .companyName(recruiter.getCompanyName())
                .companyEmail(recruiter.getCompanyEmail())
                .contactPerson(recruiter.getContactPerson())
                .phoneNumber(recruiter.getPhoneNumber())
                .companyWebsite(recruiter.getCompanyWebsite())
                .companyAddress(recruiter.getCompanyAddress())
                .industryType(recruiter.getIndustryType())
                .panNumber(recruiter.getPanNumber())
                .description(recruiter.getDescription())
                .logoUrl(recruiter.getCompanyLogo())
                .publicId(recruiter.getPublicId())
                .reportCount(recruiter.getReportCount())
                .approved(recruiter.isVerified())
                .blocked(recruiter.isBlocked());

        if (recruiter.getUser() != null) {
            builder.userId(recruiter.getUser().getId())
                   .email(recruiter.getUser().getEmail())
                   .role(recruiter.getUser().getRole() != null ? recruiter.getUser().getRole().name() : null);
        }

        return builder.build();
    }
}