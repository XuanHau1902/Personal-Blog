package com.projects.PersonalBlog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
public class AvatarRequest {

    private String avatarUrl;
    private String avatarPosition;
}
