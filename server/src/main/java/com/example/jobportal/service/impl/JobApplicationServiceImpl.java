package com.example.jobportal.service.impl;

import com.example.jobportal.dto.JobResponse;
import com.example.jobportal.dto.MailBody;
import com.example.jobportal.entity.*;
import com.example.jobportal.enums.ApplicationStatus;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.EmailService;
import com.example.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final SeekerRepository seekerRepository;
    private final RecruiterRepository recruiterRepository;
    private final EmailService emailService;

    @Override
    public void applyJob(Long userId, Long jobId, String resumeUrl, String publicId, String coverLetter, List<JobDocument> uploadedDocuments) {

        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> JobException.notFound("Seeker profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> JobException.notFound("Job not found"));

        Recruiter recruiter = job.getRecruiter();

        if (applicationRepository.existsByJobAndSeeker(job, seeker)) {
            throw JobException.badRequest("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .seeker(seeker)
                .job(job)
                .recruiter(recruiter)
                .resumeUrl(resumeUrl)
                .resumePublicId(publicId)
                .coverLetter(coverLetter)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(new Date())
                .uploadedDocuments(uploadedDocuments)
                .build();

        applicationRepository.save(application);
    }

    @Override
    public List<JobApplication> getApplicationsBySeeker(Long seekerId) {
        Seeker seeker = seekerRepository.findById(seekerId)
                .orElseThrow(() -> JobException.notFound("Seeker not found"));
        return applicationRepository.findBySeeker(seeker);
    }

    @Override
    public List<JobResponse> getRecommendedJobs(Long userId) {

        Seeker seeker = seekerRepository.findByUserId(userId)
                .orElseThrow(() -> JobException.notFound("Seeker not found"));

        String skills = seeker.getSkills();
        String qualification = seeker.getQualification().name();

        List<String> skillList = Arrays.stream(skills.split(","))
                .map(String::trim)
                .toList();

        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .filter(job -> matches(job, skillList, qualification))
                .map(this::mapToResponse)
                .toList();
    }

    private boolean matches(Job job, List<String> skills, String qualification) {

        String title = job.getTitle().toLowerCase();
        String description = job.getDescription().toLowerCase();

        for (String skill : skills) {
            if (title.contains(skill.toLowerCase()) || description.contains(skill.toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    @Override
    public List<JobApplication> getApplicationsForRecruiter(Long userId) {

        Recruiter recruiter = recruiterRepository.getRecruiterByUserId(userId);

        if (recruiter == null) {
            throw JobException.notFound("Recruiter not found");
        }

        return applicationRepository.findByRecruiter(recruiter);
    }

    @Override
    public List<JobApplication> getApplicationsForRecruiterJob(Long jobId, Long userId) {

        Recruiter recruiter = recruiterRepository.getRecruiterByUserId(userId);

        if (recruiter == null) {
            throw JobException.notFound("Recruiter not found");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> JobException.notFound("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw JobException.badRequest("You are not allowed to view these applications");
        }

        return applicationRepository.findByJob(job);
    }

    @Override
    public void updateApplicationStatus(Long applicationId,
                                        Long recruiterUserId,
                                        ApplicationStatus status,
                                        Date interviewDate) {

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> JobException.notFound("Application not found"));

        if (!application.getRecruiter().getUser().getId().equals(recruiterUserId)) {
            throw JobException.badRequest("You are not authorized to update this application");
        }

        if (status == ApplicationStatus.SHORTLISTED) {
            if (interviewDate == null) {
                throw JobException.badRequest("Interview date is required for shortlisted candidates");
            }
            application.setInterviewDate(interviewDate);

            // Send notification email to seeker
            try {
                User user = application.getSeeker().getUser();
                if (user != null && user.getEmail() != null) {
                    java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("E, MMM dd, yyyy 'at' hh:mm a");
                    String formattedDateTime = formatter.format(interviewDate);
                    
                    String subject = "Interview Scheduled - " + application.getJob().getTitle();
                    Recruiter recruiter = application.getRecruiter();
                    String contactPerson = recruiter.getContactPerson() != null ? recruiter.getContactPerson() : "N/A";
                    String email = recruiter.getCompanyEmail() != null ? recruiter.getCompanyEmail() : "N/A";
                    String phone = recruiter.getPhoneNumber() != null ? recruiter.getPhoneNumber() : "N/A";

                    String text = String.format(
                        "Dear %s,\n\n" +
                        "Congratulations! Your application for the position of \"%s\" at \"%s\" has been shortlisted.\n\n" +
                        "Your interview has been scheduled for:\n" +
                        "%s\n\n" +
                        "Recruiter Contact Details:\n" +
                        "- Contact Person: %s\n" +
                        "- Email: %s\n" +
                        "- Phone: %s\n\n" +
                        "Please check your dashboard or message the recruiter if you have any questions.\n\n" +
                        "Best regards,\n" +
                        "EasyJobs Team",
                        user.getName(),
                        application.getJob().getTitle(),
                        recruiter.getCompanyName(),
                        formattedDateTime,
                        contactPerson,
                        email,
                        phone
                    );
                    
                    MailBody mailBody = MailBody.builder()
                            .to(user.getEmail())
                            .subject(subject)
                            .text(text)
                            .build();
                            
                    emailService.sendSimpleMessage(mailBody);
                }
            } catch (Exception e) {
                // Log and ignore to prevent blocking the status update if email sending fails
                System.err.println("Failed to send interview notification email: " + e.getMessage());
            }
        }

        if (status == ApplicationStatus.REJECTED) {
            application.setInterviewDate(null);
        }

        application.setStatus(status);

        applicationRepository.save(application);
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .status(job.getStatus())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getCompanyName())
                .deadline(job.getDeadline())
                .noOfOpenings(job.getNoOfOpenings())
                .requiredDocuments(job.getRequiredDocuments())
                .recruiterLogo(job.getRecruiter() != null ? job.getRecruiter().getCompanyLogo() : null)
                .build();
    }
}