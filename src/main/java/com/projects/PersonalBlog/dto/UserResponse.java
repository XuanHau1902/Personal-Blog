package com.projects.PersonalBlog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class UserResponse {

    private String username;
    private String avatarUrl;
    private String avatarPosition;
}
