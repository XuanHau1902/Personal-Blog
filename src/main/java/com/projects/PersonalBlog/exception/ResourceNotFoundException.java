package com.projects.PersonalBlog.exception;

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException (String message) {
        super(message);
    }
}
