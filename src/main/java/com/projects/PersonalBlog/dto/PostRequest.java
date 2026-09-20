package com.projects.PersonalBlog.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@NoArgsConstructor 
//lấy dữ liệu từ client gửi lên, dữ liệu này sẽ được sử dụng để tạo một bài viết mới trong hệ thống.
public class PostRequest {

    @NotBlank 
    private String title;

    private String content;

    private String coverImageUrl;

    private boolean published;

    private List<String> tagNames = new ArrayList<>();
}
