package com.example.jobportal.service.impl;

import com.example.jobportal.dto.ChatMessageResponse;
import com.example.jobportal.dto.ChatRoomResponse;
import com.example.jobportal.entity.*;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.repository.*;
import com.example.jobportal.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final JobRepository jobRepository;
    private final SeekerRepository seekerRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ChatRoomResponse getOrCreateChatRoom(Long seekerUserId, Long jobId, Long currentUserId) {
        try {
            log.info("=== Chat Room Creation Service Started ===");
            log.info("Seeker User ID: {}, Job ID: {}, Current User ID: {}", seekerUserId, jobId, currentUserId);
            
            // Validate inputs
            if (seekerUserId == null || seekerUserId <= 0) {
                log.error("Invalid seekerUserId: {}", seekerUserId);
                throw JobException.badRequest("Invalid seeker user ID");
            }
            
            if (jobId == null || jobId <= 0) {
                log.error("Invalid jobId: {}", jobId);
                throw JobException.badRequest("Invalid job ID");
            }
            
            if (currentUserId == null || currentUserId <= 0) {
                log.error("Invalid currentUserId: {}", currentUserId);
                throw JobException.badRequest("Invalid current user ID");
            }
            
            // Find the job
            log.info("Finding job with ID: {}", jobId);
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> {
                        log.error("Job not found with ID: {}", jobId);
                        return JobException.notFound("Job not found");
                    });
            
            log.info("Job found. Title: {}, Recruiter ID: {}", job.getTitle(), job.getRecruiter().getUser().getId());
            
            // Check if job has a recruiter
            if (job.getRecruiter() == null) {
                log.error("Job {} has no associated recruiter", jobId);
                throw JobException.badRequest("Job has no recruiter assigned");
            }
            
            // Find the seeker
            log.info("Finding seeker with User ID: {}", seekerUserId);
            Seeker seeker = seekerRepository.findByUserId(seekerUserId)
                    .orElseThrow(() -> {
                        log.error("Seeker not found with User ID: {}", seekerUserId);
                        return JobException.notFound("Seeker not found");
                    });
            
            log.info("Seeker found. Name: {}", seeker.getFirstName() + " " + seeker.getLastName());
            
            Recruiter recruiter = job.getRecruiter();
            
            // Authorization check: current user must be either the seeker or the recruiter
            boolean isCurrentUserSeeker = seekerUserId.equals(currentUserId);
            boolean isCurrentUserRecruiter = recruiter.getUser().getId().equals(currentUserId);
            
            log.info("Authorization check - isCurrentUserSeeker: {}, isCurrentUserRecruiter: {}", isCurrentUserSeeker, isCurrentUserRecruiter);
            
            if (!isCurrentUserSeeker && !isCurrentUserRecruiter) {
                log.error("User {} is neither seeker nor recruiter for this job", currentUserId);
                throw JobException.forbidden("You don't have permission to create a chat room for this job and seeker");
            }
            
            // Get or create chat room
            log.info("Looking for existing chat room...");
            ChatRoom chatRoom = chatRoomRepository.findByJobAndSeekerAndRecruiter(job, seeker, recruiter)
                    .orElseGet(() -> {
                        log.info("Chat room not found. Creating new one...");
                        ChatRoom newRoom = ChatRoom.builder()
                                .job(job)
                                .seeker(seeker)
                                .recruiter(recruiter)
                                .build();
                        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
                        log.info("New chat room created with ID: {}", savedRoom.getId());
                        return savedRoom;
                    });
            
            log.info("Chat room ready. ID: {}", chatRoom.getId());
            log.info("=== Chat Room Creation Service Completed Successfully ===");
            
            return mapToChatRoomResponse(chatRoom, seekerUserId);
            
        } catch (JobException ex) {
            log.error("JobException during chat room creation: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error during chat room creation", ex);
            throw JobException.internalServerError("Failed to create/retrieve chat room: " + ex.getMessage());
        }
    }

    @Override
    public List<ChatRoomResponse> getUserChatRooms(Long userId) {
        try {
            log.info("Fetching chat rooms for user ID: {}", userId);
            
            if (userId == null || userId <= 0) {
                log.error("Invalid userId: {}", userId);
                throw JobException.badRequest("Invalid user ID");
            }
            
            List<ChatRoom> rooms = chatRoomRepository.findByUserId(userId);
            log.info("Found {} chat rooms for user {}", rooms.size(), userId);
            
            List<ChatRoomResponse> responses = rooms.stream()
                    .map(room -> mapToChatRoomResponse(room, userId))
                    .collect(Collectors.toList());
            
            return responses;
            
        } catch (JobException ex) {
            log.error("JobException while fetching user chat rooms: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error while fetching user chat rooms", ex);
            throw JobException.internalServerError("Failed to fetch chat rooms: " + ex.getMessage());
        }
    }

    @Override
    public Page<ChatMessageResponse> getChatMessages(Long userId, Long roomId, Pageable pageable) {
        try {
            log.info("Fetching messages for user ID: {}, Room ID: {}", userId, roomId);
            
            if (roomId == null || roomId <= 0) {
                log.error("Invalid roomId: {}", roomId);
                throw JobException.badRequest("Invalid room ID");
            }
            
            ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                    .orElseThrow(() -> {
                        log.error("Chat room not found with ID: {}", roomId);
                        return JobException.notFound("Chat room not found");
                    });

            // Security check: ensure user is part of the chat
            boolean isSeeker = chatRoom.getSeeker().getUser().getId().equals(userId);
            boolean isRecruiter = chatRoom.getRecruiter().getUser().getId().equals(userId);
            
            log.info("Security check - isSeeker: {}, isRecruiter: {}", isSeeker, isRecruiter);
            
            if (!isSeeker && !isRecruiter) {
                log.error("User {} is not part of chat room {}", userId, roomId);
                throw JobException.forbidden("Unauthorized access to chat room");
            }

            Page<ChatMessageResponse> messages = chatMessageRepository.findByChatRoomOrderByTimestampDesc(chatRoom, pageable)
                    .map(msg -> ChatMessageResponse.builder()
                            .id(msg.getId())
                            .chatRoomId(chatRoom.getId())
                            .senderId(msg.getSender().getId())
                            .content(msg.getContent())
                            .timestamp(msg.getTimestamp())
                            .isRead(msg.isRead())
                            .build());
            
            log.info("Retrieved {} messages from chat room {}", messages.getSize(), roomId);
            return messages;
            
        } catch (JobException ex) {
            log.error("JobException while fetching messages: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error while fetching messages", ex);
            throw JobException.internalServerError("Failed to fetch messages: " + ex.getMessage());
        }
    }

    @Override
    @Transactional
    public ChatMessageResponse saveMessage(Long roomId, Long senderId, String content) {
        try {
            log.info("Saving message to room ID: {}, Sender ID: {}", roomId, senderId);
            
            if (roomId == null || roomId <= 0) {
                log.error("Invalid roomId: {}", roomId);
                throw JobException.badRequest("Invalid room ID");
            }
            
            if (senderId == null || senderId <= 0) {
                log.error("Invalid senderId: {}", senderId);
                throw JobException.badRequest("Invalid sender ID");
            }
            
            if (content == null || content.trim().isEmpty()) {
                log.error("Message content is empty");
                throw JobException.badRequest("Message content cannot be empty");
            }
            
            ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                    .orElseThrow(() -> {
                        log.error("Chat room not found with ID: {}", roomId);
                        return JobException.notFound("Chat room not found");
                    });

            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> {
                        log.error("User not found with ID: {}", senderId);
                        return JobException.notFound("Sender not found");
                    });

            // Verify sender is part of the chat room
            boolean isSenderPartOfRoom = chatRoom.getSeeker().getUser().getId().equals(senderId) ||
                                        chatRoom.getRecruiter().getUser().getId().equals(senderId);
            
            if (!isSenderPartOfRoom) {
                log.error("Sender {} is not part of chat room {}", senderId, roomId);
                throw JobException.forbidden("You are not part of this chat room");
            }

            ChatMessage message = ChatMessage.builder()
                    .chatRoom(chatRoom)
                    .sender(sender)
                    .content(content)
                    .isRead(false)
                    .build();

            ChatMessage saved = chatMessageRepository.save(message);
            log.info("Message saved successfully. ID: {}", saved.getId());

            return ChatMessageResponse.builder()
                    .id(saved.getId())
                    .chatRoomId(chatRoom.getId())
                    .senderId(senderId)
                    .content(saved.getContent())
                    .timestamp(saved.getTimestamp())
                    .isRead(saved.isRead())
                    .build();
                    
        } catch (JobException ex) {
            log.error("JobException while saving message: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error while saving message", ex);
            throw JobException.internalServerError("Failed to save message: " + ex.getMessage());
        }
    }

    private ChatRoomResponse mapToChatRoomResponse(ChatRoom room, Long currentUserId) {
        boolean isSeeker = room.getSeeker().getUser().getId().equals(currentUserId);
        
        Long otherPartyId = isSeeker ? room.getRecruiter().getUser().getId() : room.getSeeker().getUser().getId();
        String otherPartyName = isSeeker ? room.getRecruiter().getCompanyName() : room.getSeeker().getFirstName() + " " + room.getSeeker().getLastName();
        String otherPartyAvatar = isSeeker ? room.getRecruiter().getCompanyLogo() : null; // Seeker might not have avatar yet

        return ChatRoomResponse.builder()
                .id(room.getId())
                .jobId(room.getJob().getId())
                .jobTitle(room.getJob().getTitle())
                .otherPartyUserId(otherPartyId)
                .otherPartyName(otherPartyName)
                .otherPartyAvatar(otherPartyAvatar)
                .createdAt(room.getCreatedAt())
                .build();
    }
}
