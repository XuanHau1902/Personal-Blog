package com.projects.PersonalBlog.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.PersonalBlog.dto.AvatarRequest;
import com.projects.PersonalBlog.dto.UserResponse;
import com.projects.PersonalBlog.service.UserService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getCurrentUser(userDetails.getUsername());
    }

    @PutMapping("/me/avatar")
    public UserResponse updateAvatar(@RequestBody AvatarRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return userService.updateAvatar(userDetails.getUsername(), request);
    }
    
}
