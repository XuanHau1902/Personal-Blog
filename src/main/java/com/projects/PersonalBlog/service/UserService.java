package com.projects.PersonalBlog.service;

import org.springframework.stereotype.Service;

import com.projects.PersonalBlog.dto.AvatarRequest;
import com.projects.PersonalBlog.dto.UserResponse;
import com.projects.PersonalBlog.entity.User;
import com.projects.PersonalBlog.exception.ResourceNotFoundException;
import com.projects.PersonalBlog.repository.UserRepository;

@Service 
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    public UserResponse updateAvatar(String username, AvatarRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->new ResourceNotFoundException("User not found"));
        user.setAvatarUrl(request.getAvatarUrl());
        user.setAvatarPosition(request.getAvatarPosition());
        userRepository.save(user);
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(user.getUsername(), user.getAvatarUrl(), user.getAvatarPosition());
    }
}
