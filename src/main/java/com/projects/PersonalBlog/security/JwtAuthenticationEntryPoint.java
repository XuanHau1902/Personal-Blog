package com.projects.PersonalBlog.security;

import java.io.IOException;
import java.time.Instant;

import org.springframework.security.core.AuthenticationException;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.projects.PersonalBlog.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Component 
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint{

    
    private final ObjectMapper objectMapper;
    // ↑ Dùng để convert object Java thành JSON string
    // VD: ErrorResponse object → {"status": 401, "message": "..."}

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override 
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        // ↑ Set HTTP status code = 401 (Unauthorized)
        // Bảo client: "Bạn chưa được xác thực"
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        // ↑ Set header: Content-Type: application/json
        // Bảo client: "Response này là JSON format"
        ErrorResponse body = new ErrorResponse(Instant.now(), 401, "Yêu cầu xác thực");
        // ↑ Tạo object ErrorResponse
        response.getWriter().write(objectMapper.writeValueAsString(body));
        // ↑ Ghi JSON vào response body
        // objectMapper.writeValueAsString(body) → convert ErrorResponse thành JSON string
        // response.getWriter().write(...) → viết JSON string vào response
    }
}
