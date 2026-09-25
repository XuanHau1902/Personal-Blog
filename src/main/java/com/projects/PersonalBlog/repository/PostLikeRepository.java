package com.projects.PersonalBlog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projects.PersonalBlog.entity.PostLike;
import java.util.List;


public interface PostLikeRepository extends JpaRepository<PostLike,Long>{

    //đếm số lượng tim
    long countByPostId(Long postId);

    //dùng để kiểm tra xem có tồn tại không
    boolean existsByPostIdAndUserUsername(Long postId, String username);

    //dùng để tìm kiếm
    Optional<PostLike> findByPostIdAndUserUsername(Long postId, String username);

    //tìm số tim của bài viết
    List<PostLike> findByPostId(Long postId);
}
