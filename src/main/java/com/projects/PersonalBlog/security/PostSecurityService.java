package com.projects.PersonalBlog.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.projects.PersonalBlog.repository.PostRepository;

@Component("postSecurity")
public class PostSecurityService {

    private final PostRepository postRepository;

    public PostSecurityService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    //hàm này sẽ kiểm tra xem người dùng hiện tại có phải là chủ sở hữu của bài viết với ID được cung cấp hay không. Nó lấy tên người dùng hiện tại từ đối tượng Authentication và so sánh với tên người dùng của tác giả bài viết trong cơ sở dữ liệu. Nếu bài viết tồn tại và tên người dùng trùng khớp, hàm trả về true; nếu không, nó trả về false.
    public boolean isPostOwner(Long postId, Authentication authentication) {
        String currentUsername = authentication.getName();
        return postRepository.findById(postId)
                .map(post -> post.getAuthor().getUsername().equals(currentUsername))
                .orElse(false);
    }
}
