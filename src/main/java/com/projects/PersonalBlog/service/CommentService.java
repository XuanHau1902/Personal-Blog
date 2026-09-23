package com.projects.PersonalBlog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projects.PersonalBlog.dto.CommentRequest;
import com.projects.PersonalBlog.dto.CommentResponse;
import com.projects.PersonalBlog.entity.Comment;
import com.projects.PersonalBlog.entity.Post;
import com.projects.PersonalBlog.entity.User;
import com.projects.PersonalBlog.repository.CommentRepository;
import com.projects.PersonalBlog.repository.PostRepository;
import com.projects.PersonalBlog.repository.UserRepository;

@Service 
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository =  userRepository;
    }

    public CommentResponse create(Long postId, CommentRequest request, String authorUsername) {
        User author = userRepository.findByUsername(authorUsername)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setContent(request.getContent());
        comment.setPost(post);

        Comment saveComment = commentRepository.save(comment);
        return mapToResponse(saveComment);
    }

    public List<CommentResponse> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId).stream()
                                .map(this::mapToResponse).toList();
    }

    public void delete(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return new CommentResponse(
            comment.getId(),
            comment.getContent(),
            comment.getAuthor().getUsername(),
            comment.getPost().getId()
        );
    }
        
}
