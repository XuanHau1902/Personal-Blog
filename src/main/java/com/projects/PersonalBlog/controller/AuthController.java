package com.projects.PersonalBlog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.PersonalBlog.dto.AuthResponse;
import com.projects.PersonalBlog.dto.LoginRequest;
import com.projects.PersonalBlog.dto.RegisterRequest;
import com.projects.PersonalBlog.service.AuthService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    // phương thức register nhận một yêu cầu đăng ký người dùng mới, kiểm tra xem tên người dùng đã tồn tại chưa, nếu chưa thì tạo một đối tượng User mới, mã hóa mật khẩu và lưu vào cơ sở dữ liệu. Nếu tên người dùng đã tồn tại, nó sẽ ném ra một ngoại lệ.
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    // phương thức login nhận một yêu cầu đăng nhập, xác thực thông tin đăng nhập của người dùng và trả về một đối tượng AuthResponse chứa access token và refresh token nếu đăng nhập thành công.
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
