package com.example.jobportal.controller;

import com.example.jobportal.dto.ChatRoomResponse;
import com.example.jobportal.exception.JobException;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final JwtUtil jwtUtil;

    @PostMapping("/room")
    public ResponseEntity<?> getOrCreateRoom(
            @RequestParam Long seekerUserId,
            @RequestParam Long jobId,
            HttpServletRequest request) {
        try {
            log.info("=== Chat Room Creation Started ===");
            log.info("Request: seekerUserId={}, jobId={}", seekerUserId, jobId);
            
            // Validate request parameters
            if (seekerUserId == null || seekerUserId <= 0) {
                log.error("Invalid seekerUserId: {}", seekerUserId);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid seeker user ID", HttpStatus.BAD_REQUEST));
            }
            
            if (jobId == null || jobId <= 0) {
                log.error("Invalid jobId: {}", jobId);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid job ID", HttpStatus.BAD_REQUEST));
            }
            
            try {
                Long userId = jwtUtil.getUserIdFromRequest(request);
                log.info("Authenticated user ID: {}", userId);
                
                // Call service to create/get chat room
                ChatRoomResponse response = chatService.getOrCreateChatRoom(seekerUserId, jobId, userId);
                log.info("Chat room created/fetched successfully. RoomId: {}", response.getId());
                log.info("=== Chat Room Creation Completed Successfully ===");
                
                return ResponseEntity.ok(response);
                
            } catch (IllegalArgumentException e) {
                log.error("Invalid JWT token: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Invalid or expired token", HttpStatus.UNAUTHORIZED));
            }
            
        } catch (JobException ex) {
            log.error("JobException during chat room creation: Status={}, Message={}", ex.getStatus(), ex.getMessage());
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("timestamp", LocalDateTime.now());
            errorBody.put("status", ex.getStatus().value());
            errorBody.put("error", ex.getStatus().getReasonPhrase());
            errorBody.put("message", ex.getMessage());
            return ResponseEntity.status(ex.getStatus()).body(errorBody);
            
        } catch (Exception ex) {
            log.error("Unexpected error during chat room creation", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getUserRooms(
            HttpServletRequest request) {
        try {
            log.info("=== Fetching user chat rooms ===");
            
            Long userId = jwtUtil.getUserIdFromRequest(request);
            log.info("Fetching rooms for user ID: {}", userId);
            
            List<ChatRoomResponse> rooms = chatService.getUserChatRooms(userId);
            log.info("Retrieved {} chat rooms", rooms.size());
            
            return ResponseEntity.ok(rooms);
            
        } catch (JobException ex) {
            log.error("JobException while fetching rooms: {}", ex.getMessage());
            return ResponseEntity.status(ex.getStatus())
                .body(createErrorResponse(ex.getMessage(), ex.getStatus()));
                
        } catch (Exception ex) {
            log.error("Unexpected error while fetching rooms", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<?> getChatMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            HttpServletRequest request) {
        try {
            log.info("=== Fetching chat messages ===");
            log.info("RoomId: {}, Page: {}, Size: {}", roomId, page, size);
            
            if (roomId == null || roomId <= 0) {
                log.error("Invalid roomId: {}", roomId);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid room ID", HttpStatus.BAD_REQUEST));
            }
            
            if (page < 0) {
                log.error("Invalid page number: {}", page);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Page number cannot be negative", HttpStatus.BAD_REQUEST));
            }
            
            if (size <= 0 || size > 100) {
                log.error("Invalid size: {}", size);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Size must be between 1 and 100", HttpStatus.BAD_REQUEST));
            }
            
            Long userId = jwtUtil.getUserIdFromRequest(request);
            log.info("Fetching messages for user ID: {}", userId);
            
            var messages = chatService.getChatMessages(userId, roomId, PageRequest.of(page, size));
            log.info("Retrieved {} messages", messages.getSize());
            
            return ResponseEntity.ok(messages);
            
        } catch (JobException ex) {
            log.error("JobException while fetching messages: {}", ex.getMessage());
            return ResponseEntity.status(ex.getStatus())
                .body(createErrorResponse(ex.getMessage(), ex.getStatus()));
                
        } catch (Exception ex) {
            log.error("Unexpected error while fetching messages", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR));
        }
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
