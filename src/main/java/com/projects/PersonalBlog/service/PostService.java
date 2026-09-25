package com.projects.PersonalBlog.service;


import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import com.projects.PersonalBlog.entity.User;
import com.projects.PersonalBlog.exception.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.projects.PersonalBlog.dto.LikeResponse;
import com.projects.PersonalBlog.dto.PostRequest;
import com.projects.PersonalBlog.dto.PostResponse;
import com.projects.PersonalBlog.entity.Post;
import com.projects.PersonalBlog.entity.PostLike;
import com.projects.PersonalBlog.entity.Tag;
import com.projects.PersonalBlog.repository.CommentRepository;
import com.projects.PersonalBlog.repository.PostLikeRepository;
import com.projects.PersonalBlog.repository.PostRepository;
import com.projects.PersonalBlog.repository.TagRepository;
import com.projects.PersonalBlog.repository.UserRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    public PostService(PostRepository postRepository, TagRepository tagRepository, UserRepository userRepository, CommentRepository commentRepository, PostLikeRepository postLikeRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.postLikeRepository = postLikeRepository;
    }

    //hàm này sẽ tạo một bài viết mới dựa trên dữ liệu từ PostRequest và tên người dùng của tác giả. Nó tìm kiếm người dùng trong cơ sở dữ liệu dựa trên tên người dùng, nếu không tìm thấy sẽ ném ra một ngoại lệ. Sau đó, nó tạo một đối tượng Post mới, thiết lập các trường thông tin từ PostRequest và danh sách thẻ liên quan. Cuối cùng, nó lưu bài viết vào cơ sở dữ liệu và trả về một đối tượng PostResponse chứa thông tin của bài viết vừa được tạo.
    public PostResponse create(PostRequest request, String authorUsername) {
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setCoverImagePosition(request.getCoverImagePosition());
        post.setAuthor(author);
        post.setTags(resolveTags(request.getTagNames()));
        post.setPublished(request.isPublished());

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    //hàm này sẽ lấy danh sách các bài viết đã được đăng từ cơ sở dữ liệu dựa trên các tiêu chí tìm kiếm và phân trang. Nó sử dụng phương thức findPublishedPosts của postRepository để truy vấn cơ sở dữ liệu, sau đó chuyển đổi kết quả thành một trang (Page) chứa các đối tượng PostResponse để gửi về cho client.
    public Page<PostResponse> getPublishedPosts(String tag, String q, Pageable pageable) {
        return postRepository.findPublishedPosts(tag, q, pageable)
                .map(this::mapToResponse);
    }

    //hàm này sẽ lấy thông tin chi tiết của một bài viết dựa trên ID của nó. Nó sử dụng phương thức findById của postRepository để truy vấn cơ sở dữ liệu. Nếu bài viết với ID được cung cấp tồn tại, nó sẽ chuyển đổi đối tượng Post thành một đối tượng PostResponse và trả về cho client. Nếu bài viết không tồn tại, phương thức sẽ ném ra một ngoại lệ.
    public PostResponse getPostById(Long id, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.isPublished() && !canViewDraft(post, userDetails)) {
            throw new ResourceNotFoundException("Post not found");
        }
        return mapToResponse(post, userDetails);
    }

    private boolean canViewDraft(Post post, UserDetails currentUser) {
        if (currentUser == null) {
            return false;
        }

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = post.getAuthor().getUsername().equals(currentUser.getUsername());
        return isAdmin || isOwner;
    }
    //hàm này sẽ cập nhật thông tin của một bài viết dựa trên ID của nó và dữ liệu mới từ PostRequest. Nó sử dụng phương thức findById của postRepository để truy vấn cơ sở dữ liệu. Nếu bài viết tồn tại, nó sẽ cập nhật các trường thông tin của bài viết với dữ liệu mới từ PostRequest, bao gồm tiêu đề, nội dung, URL hình ảnh bìa và danh sách thẻ. Sau đó, nó lưu bài viết đã được cập nhật vào cơ sở dữ liệu và trả về một đối tượng PostResponse chứa thông tin mới của bài viết. Nếu bài viết không tồn tại, phương thức sẽ ném ra một ngoại lệ.
    public PostResponse update(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setCoverImagePosition(request.getCoverImagePosition());
        post.setTags(resolveTags(request.getTagNames()));
        post.setPublished(request.isPublished());
        Post updatedPost = postRepository.save(post);
        return mapToResponse(updatedPost);
    }

    public LikeResponse toggleLike(Long postId, String username) {
        postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserUsername(postId, username);
        if(existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
        } else {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Post post = postRepository.findById(postId).orElseThrow();
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);
        }

        long likeCount = postLikeRepository.countByPostId(postId);
        boolean liked = existingLike.isEmpty();
        return new LikeResponse(likeCount,liked);
    }

    //hàm này xử lý việc xóa một bài viết dựa trên ID của nó. Nó sử dụng phương thức deleteById của postRepository để xóa bài viết khỏi cơ sở dữ liệu. Nếu bài viết với ID được cung cấp không tồn tại, phương thức này sẽ ném ra một ngoại lệ.
    public void delete(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() ->new ResourceNotFoundException("Post not found"));
        commentRepository.deleteAll(commentRepository.findByPostId(id));
        postLikeRepository.deleteAll(postLikeRepository.findByPostId(id));
        postRepository.delete(post);
    }

    //hàm này sẽ lấy danh sách các tên thẻ từ PostRequest và kiểm tra xem các thẻ này đã tồn tại trong cơ sở dữ liệu hay chưa. Nếu một thẻ chưa tồn tại, nó sẽ tạo một thẻ mới và lưu vào cơ sở dữ liệu. Cuối cùng, hàm này trả về một tập hợp (Set) các đối tượng Tag tương ứng với danh sách tên thẻ đã được cung cấp.
    private Set<Tag> resolveTags(List<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        for (String name : tagNames) {
            Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(newTag(name)));
            tags.add(tag);
        }
        return tags;
    }

    //hàm này sẽ tạo một đối tượng Tag mới với tên được cung cấp. Nó thiết lập tên của thẻ và trả về đối tượng Tag mới này. Hàm này được sử dụng trong quá trình tạo bài viết để tạo các thẻ mới nếu chúng chưa tồn tại trong cơ sở dữ liệu.
    private Tag newTag(String tagName) {
        Tag tag = new Tag();
        tag.setName(tagName);
        return tag;
    }

    private PostResponse mapToResponse(Post post) {
    return mapToResponse(post, null);
    }


    //hàm này sẽ chuyển đổi một đối tượng Post (bài viết) thành một đối tượng PostResponse (phản hồi bài viết). Nó lấy thông tin từ bài viết, bao gồm ID, tiêu đề, nội dung, URL hình ảnh bìa, trạng thái xuất bản, tên người dùng của tác giả và danh sách tên thẻ liên quan đến bài viết. Cuối cùng, nó trả về một đối tượng PostResponse chứa tất cả thông tin này để gửi về cho client.
    private PostResponse mapToResponse(Post post, UserDetails currentUser) {
        
        Set<String> tagNames = post.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());
        long likeCount = postLikeRepository.countByPostId(post.getId());
        boolean liked = currentUser != null && postLikeRepository.existsByPostIdAndUserUsername(post.getId(), currentUser.getUsername());
            return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.getCoverImagePosition(),
                post.isPublished(),
                post.getAuthor().getUsername(),
                tagNames,likeCount, liked
            );
    }
}
