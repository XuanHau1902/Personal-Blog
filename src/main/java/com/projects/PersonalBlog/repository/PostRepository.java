package com.projects.PersonalBlog.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projects.PersonalBlog.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Tìm kiếm bài viết đã xuất bản theo thẻ (tag) và từ khóa (q)
    @Query("""
        SELECT DISTINCT p FROM Post p
        LEFT JOIN p.tags t
        WHERE p.published = true
        AND (:tag IS NULL OR t.name = :tag)
        AND (:q IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')))
        """)
    Page<Post> findPublishedPosts(@Param("tag") String tag, @Param("q") String q, Pageable pageable);
}
