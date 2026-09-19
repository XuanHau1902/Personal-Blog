package com.projects.PersonalBlog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
}
