package com.projects.PersonalBlog.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Getter @Setter 
@NoArgsConstructor // tạo constructor mặc định không có tham số, cần thiết cho JPA để tạo các thực thể từ cơ sở dữ liệu.
public class Post {

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob//báo cho JPA biết rằng trường này có thể chứa dữ liệu lớn, chẳng hạn như văn bản dài hoặc hình ảnh.
    private String content;

    private boolean published = false;

    private String coverImageUrl;

    @ManyToOne(fetch = FetchType.LAZY) // thiết lập quan hệ nhiều-một giữa Post và User, với việc tải dữ liệu của User được thực hiện theo cách lười biếng (lazy loading).
    @JoinColumn (name = "author_id", nullable = false) // chỉ định tên cột trong bảng Post để lưu trữ khóa ngoại liên kết đến User, và cột này không được phép null.
    private User author;

    @ManyToMany 
    @JoinTable(
        name = "post_tags", // tên bảng liên kết giữa Post và Tag
        joinColumns = @JoinColumn(name = "post_id"), // cột khóa ngoại liên kết đến Post
        inverseJoinColumns = @JoinColumn(name = "tag_id") // cột khóa ngoại liên kết đến Tag
    )
    private Set<Tag> tags = new HashSet<>(); // khởi tạo tập hợp tags để tránh NullPointerException khi thêm thẻ vào bài viết.
}
