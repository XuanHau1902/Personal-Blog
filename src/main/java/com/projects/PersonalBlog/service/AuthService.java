package com.projects.PersonalBlog.service;

import java.util.DuplicateFormatFlagsException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projects.PersonalBlog.dto.AuthResponse;
import com.projects.PersonalBlog.dto.LoginRequest;
import com.projects.PersonalBlog.dto.RefreshRequest;
import com.projects.PersonalBlog.dto.RegisterRequest;
import com.projects.PersonalBlog.entity.User;
import com.projects.PersonalBlog.exception.DuplicateResourceException;
import com.projects.PersonalBlog.exception.InvalidTokenException;
import com.projects.PersonalBlog.repository.UserRepository;
import com.projects.PersonalBlog.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // Đăng ký người dùng mới
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);

        userRepository.save(user);
    }

    // Đăng nhập người dùng và trả về token JWT
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String accessToken = jwtUtil.generateAccessToken(request.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(request.getUsername());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        return response;
    }

    //hàm
    public AuthResponse refresh(RefreshRequest request) {
        String token = request.getRefreshToken();

        //kiểm tra xem refreshtoken đã hết hạn chưa
        if (jwtUtil.isTokenExpired(token)) {
            throw new InvalidTokenException("Refresh token expired");
        }

        //kiểm tra xem có phải refresh token hay không
        if (!"refresh".equals(jwtUtil.extractType(token))) {
            throw new InvalidTokenException("Invalid token type");
        }

        //sinh ra access token mới
        String username = jwtUtil.extractUsername(token);
        String newAccessToken = jwtUtil.generateAccessToken(username);

        //set lại access token
        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(token);
        return response;
    }
}
