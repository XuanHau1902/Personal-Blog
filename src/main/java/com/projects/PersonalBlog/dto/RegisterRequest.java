package com.projects.PersonalBlog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
public class RegisterRequest {

    @NotBlank 
    private String username;
    @NotBlank 
    private String password;
}
