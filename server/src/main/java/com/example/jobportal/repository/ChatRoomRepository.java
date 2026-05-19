package com.example.jobportal.repository;

import com.example.jobportal.entity.ChatRoom;
import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.Recruiter;
import com.example.jobportal.entity.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByJobAndSeekerAndRecruiter(Job job, Seeker seeker, Recruiter recruiter);
    
    @Query("SELECT c FROM ChatRoom c WHERE c.seeker.user.id = :userId OR c.recruiter.user.id = :userId ORDER BY c.createdAt DESC")
    List<ChatRoom> findByUserId(Long userId);
}
