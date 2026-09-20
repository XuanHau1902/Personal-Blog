package com.projects.PersonalBlog.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Lấy header "Authorization" từ request,
        String authorizationHeader = request.getHeader("Authorization");
        // nếu header tồn tại và bắt đầu bằng "Bearer ", trích xuất token từ header.
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    // token JWT được trích xuất từ header Authorization bằng cách loại bỏ phần "Bearer " ở đầu chuỗi. Phần còn lại của chuỗi là token thực sự, được lưu trữ trong biến token để sử dụng trong các bước xác thực tiếp theo.
    String token = authorizationHeader.substring(7);
    try {
        // Phương thức extractUsername(token) của lớp JwtUtil được gọi để trích xuất tên người dùng (username) từ token JWT.
        String username = jwtUtil.extractUsername(token);
        // Nếu tên người dùng không null và chưa có xác thực trong SecurityContextHolder, tiến hành xác thực người dùng.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên tên người dùng (username) và trả về một đối tượng UserDetails chứa thông tin xác thực và quyền hạn của người dùng đó.
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            // Kiểm tra tính hợp lệ của token bằng cách so sánh tên người dùng trích xuất từ token với tên người dùng được cung cấp và kiểm tra xem token có hết hạn hay không. Nếu cả hai điều kiện đều đúng, token được coi là hợp lệ.
            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                // Tạo một đối tượng UsernamePasswordAuthenticationToken với thông tin người dùng và quyền hạn của họ, sau đó đặt đối tượng này vào SecurityContextHolder để xác thực người dùng trong ngữ cảnh bảo mật hiện tại.
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }   
            } catch (JwtException e) {
                // token lỗi/hết hạn — bỏ qua, để request đi tiếp như chưa xác thực
            }
        }   

        // Tiếp tục chuỗi bộ lọc (filter chain) để xử lý request tiếp theo, bất kể xác thực thành công hay không.
        filterChain.doFilter(request, response);
    }


}
