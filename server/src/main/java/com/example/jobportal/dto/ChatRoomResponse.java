package com.example.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long otherPartyUserId; // The ID of the person the current user is talking to
    private String otherPartyName;
    private String otherPartyAvatar; // Optional: url for profile pic or logo
    private LocalDateTime createdAt;
}
