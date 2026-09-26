package com.projects.PersonalBlog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class CommentResponse {

    private Long id;
    private String content;
    private String authorUsername;
    private String authorAvatarUrl;
    private String authorAvatarPosition;
    private Long postId;
    private Long parentId;
}
