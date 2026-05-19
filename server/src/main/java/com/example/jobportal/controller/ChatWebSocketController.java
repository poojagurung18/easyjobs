package com.example.jobportal.controller;

import com.example.jobportal.dto.ChatMessageRequest;
import com.example.jobportal.dto.ChatMessageResponse;
import com.example.jobportal.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor headerAccessor) {
        // The sender's ID was set as the principal's name in WebSocketConfig
        Long senderId = Long.parseLong(headerAccessor.getUser().getName());

        // Save message to database
        ChatMessageResponse savedMessage = chatService.saveMessage(
                chatMessageRequest.getChatRoomId(),
                senderId,
                chatMessageRequest.getContent()
        );

        // Send to the recipient's specific queue
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessageRequest.getRecipientId()),
                "/queue/messages",
                savedMessage
        );

        // Also send back to the sender so their UI can update if they are on multiple devices
        messagingTemplate.convertAndSendToUser(
                String.valueOf(senderId),
                "/queue/messages",
                savedMessage
        );
    }
}
