package com.projects.PersonalBlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projects.PersonalBlog.entity.Comment;
import java.util.List;


public interface CommentRepository extends JpaRepository<Comment, Long>{

    List<Comment> findByPostId(Long postId);

    List<Comment> findByParentId(Long parentId);
}
