package com.projects.PersonalBlog.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor 
//lấy dữ liệu từ cơ sở dữ liệu và gửi về cho client, dữ liệu này sẽ được sử dụng để hiển thị thông tin của một bài viết cụ thể.
public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private String coverImageUrl;
    private boolean published;
    private String authorUsername;
    private Set<String> tags;

}
