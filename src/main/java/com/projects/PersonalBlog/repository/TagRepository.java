package com.projects.PersonalBlog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projects.PersonalBlog.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

    // Tìm kiếm thẻ (tag) theo tên
    Optional<Tag> findByName(String name);
}
