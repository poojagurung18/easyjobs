package com.example.jobportal.controller;

import com.example.jobportal.dto.ChangePasswordRequest;
import com.example.jobportal.dto.Response;
import com.example.jobportal.entity.User;
import com.example.jobportal.security.JwtUtil;
import com.example.jobportal.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {
        Long userId = jwtUtil.getUserIdFromRequest(httpRequest);
        Response response = userService.changePassword(userId, request);
        return ResponseEntity.ok(response);
    }
}
