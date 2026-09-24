package com.projects.PersonalBlog.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.projects.PersonalBlog.dto.FileUploadResponse;
import com.projects.PersonalBlog.service.FileUploadService;

@RestController 
@RequestMapping("/api/files") 
public class FileController {

    private final FileUploadService fileUploadService;

    public FileController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/upload")
    public FileUploadResponse upload(@RequestParam("file") MultipartFile file) {
        String url = fileUploadService.upload(file);
        return new FileUploadResponse(url);
    }
}
