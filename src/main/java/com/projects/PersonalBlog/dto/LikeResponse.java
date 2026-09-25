package com.projects.PersonalBlog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class LikeResponse {

    private Long likeCount;
    private boolean liked;
}
