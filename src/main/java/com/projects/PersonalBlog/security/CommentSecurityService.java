package com.projects.PersonalBlog.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.projects.PersonalBlog.repository.CommentRepository;

@Component("commentSecurity")
public class CommentSecurityService {

    private final CommentRepository commentRepository;

    public CommentSecurityService (CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public boolean isCommentOwner(Long commentId, Authentication authentication) {
        String currentUsername = authentication.getName();
        return commentRepository.findById(commentId)
                .map(comment -> comment.getAuthor().getUsername().equals(currentUsername))
                .orElse(false);
    }
}
