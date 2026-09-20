package com.projects.PersonalBlog.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.projects.PersonalBlog.dto.PostRequest;
import com.projects.PersonalBlog.dto.PostResponse;
import com.projects.PersonalBlog.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    //hàm này sẽ xử lý yêu cầu GET đến endpoint "/api/posts" và trả về danh sách các bài viết đã được xuất bản dựa trên các tiêu chí tìm kiếm (tag và q) và phân trang. Nó sử dụng phương thức getPublishedPosts của PostService để truy vấn cơ sở dữ liệu và trả về kết quả dưới dạng một trang (Page) chứa các đối tượng PostResponse.
    public Page<PostResponse> getPosts(
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) String q,
        Pageable pageable
    ) {
        return postService.getPublishedPosts(tag, q, pageable);
    }

    @GetMapping("/{id}")
    //hàm này sẽ xử lý yêu cầu GET đến endpoint "/api/posts/{id}" và trả về thông tin chi tiết của một bài viết dựa trên ID của nó. Nó sử dụng phương thức getPostById của PostService để truy vấn cơ sở dữ liệu và trả về kết quả dưới dạng một đối tượng PostResponse. Nếu bài viết với ID được cung cấp không tồn tại, phương thức này sẽ ném ra một ngoại lệ.
    public PostResponse getPostById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.getPostById(id, userDetails);
    }

    @PostMapping
    //hàm này sẽ xử lý yêu cầu POST đến endpoint "/api/posts" để tạo một bài viết mới. Nó nhận dữ liệu từ client dưới dạng PostRequest và thông tin người dùng hiện tại từ UserDetails. Sau đó, nó sử dụng phương thức create của PostService để tạo bài viết mới và trả về kết quả dưới dạng một đối tượng PostResponse chứa thông tin của bài viết vừa được tạo.
    public PostResponse createPost(@Valid @RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.create(request, userDetails.getUsername());
    }

    //kiểm tra quyền truy cập: Chỉ cho phép người dùng có vai trò ADMIN hoặc là chủ sở hữu của bài viết mới được phép cập nhật bài viết. Điều này được thực hiện bằng cách sử dụng annotation @PreAuthorize với điều kiện kiểm tra quyền truy cập.
    @PreAuthorize("hasRole('ADMIN') or @postSecurity.isPostOwner(#id, authentication)")
    @PutMapping("/{id}")
    //hàm này sẽ xử lý yêu cầu PUT đến endpoint "/api/posts/{id}" để cập nhật thông tin của một bài viết dựa trên ID của nó. Nó nhận dữ liệu từ client dưới dạng PostRequest và ID của bài viết từ đường dẫn URL. Sau đó, nó sử dụng phương thức update của PostService để cập nhật bài viết và trả về kết quả dưới dạng một đối tượng PostResponse chứa thông tin của bài viết đã được cập nhật.
    public PostResponse updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest request) {
        return postService.update(id, request);
    }

    //kiểm tra quyền truy cập: Chỉ cho phép người dùng có vai trò ADMIN hoặc là chủ sở hữu của bài viết mới được phép xóa bài viết. Điều này được thực hiện bằng cách sử dụng annotation @PreAuthorize với điều kiện kiểm tra quyền truy cập.
    @PreAuthorize("hasRole('ADMIN') or @postSecurity.isPostOwner(#id, authentication)")
    @DeleteMapping ("/{id}")
    //hàm này sẽ xử lý yêu cầu DELETE đến endpoint "/api/posts/{id}" để xóa một bài viết dựa trên ID của nó. Nó nhận ID của bài viết từ đường dẫn URL và sử dụng phương thức delete của PostService để xóa bài viết khỏi cơ sở dữ liệu. Nếu bài viết với ID được cung cấp không tồn tại, phương thức này sẽ ném ra một ngoại lệ.
    public void deletePost(@PathVariable Long id) {
        postService.delete(id);
    }
}
