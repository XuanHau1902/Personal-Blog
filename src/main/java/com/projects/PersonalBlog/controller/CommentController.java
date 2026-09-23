package com.projects.PersonalBlog.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.PersonalBlog.dto.CommentRequest;
import com.projects.PersonalBlog.dto.CommentResponse;
import com.projects.PersonalBlog.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/posts/{postId}")
    public List<CommentResponse> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPost(postId);
    }

    @PostMapping("/posts/{postId}")
    public CommentResponse createComment(@PathVariable Long postId, @Valid @RequestBody CommentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return commentService.create(postId, request, userDetails.getUsername());
    }

    @PreAuthorize("hasRole('ADMIN') or @commentSecurity.isCommentOwner(#id, authentication)")
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.delete(id);
    }
    
}
