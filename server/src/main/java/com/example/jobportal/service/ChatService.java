package com.example.jobportal.service;

import com.example.jobportal.dto.ChatMessageResponse;
import com.example.jobportal.dto.ChatRoomResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService {
    ChatRoomResponse getOrCreateChatRoom(Long seekerUserId, Long jobId, Long currentUserId);
    List<ChatRoomResponse> getUserChatRooms(Long userId);
    Page<ChatMessageResponse> getChatMessages(Long userId, Long roomId, Pageable pageable);
    ChatMessageResponse saveMessage(Long roomId, Long senderId, String content);
}
