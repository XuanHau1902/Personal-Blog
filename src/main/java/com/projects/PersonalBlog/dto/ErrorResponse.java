package com.projects.PersonalBlog.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter 
@AllArgsConstructor 
public class ErrorResponse {

    private Instant timestamps;
    private int status;
    private String message;
}
