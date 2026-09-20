package com.projects.PersonalBlog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
// lớp AuthResponse được sử dụng để trả về thông tin xác thực (authentication) sau khi người dùng đăng nhập thành công. Nó chứa hai trường: accessToken và refreshToken, đại diện cho token truy cập và token làm mới (refresh token) tương ứng. Các trường này được sử dụng để xác thực và quản lý phiên làm việc của người dùng trong ứng dụng.
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
}
