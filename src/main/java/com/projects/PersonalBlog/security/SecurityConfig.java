package com.projects.PersonalBlog.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity 
public class SecurityConfig {

    //hàm passwordEncoder() tạo ra một đối tượng PasswordEncoder sử dụng thuật toán mã hóa BCrypt để mã hóa mật khẩu người dùng trước khi lưu vào cơ sở dữ liệu. BCrypt là một thuật toán băm mật khẩu mạnh, giúp bảo vệ mật khẩu khỏi các cuộc tấn công brute-force và rainbow table.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //hàm authenticationManager() lấy đối tượng AuthenticationManager từ cấu hình xác thực (AuthenticationConfiguration) của Spring Security. AuthenticationManager chịu trách nhiệm xác thực thông tin đăng nhập của người dùng, ví dụ như kiểm tra tên người dùng và mật khẩu. Việc sử dụng AuthenticationManager giúp tách biệt logic xác thực khỏi các thành phần khác trong ứng dụng, làm cho mã nguồn dễ bảo trì và mở rộng hơn.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    //hàm securityFilterChain() cấu hình các quy tắc bảo mật cho ứng dụng web. Nó thực hiện các bước sau:
    //1. Vô hiệu hóa CSRF (Cross-Site Request Forgery) vì ứng dụng sử dụng JWT cho xác thực.
    //2. Cấu hình CORS (Cross-Origin Resource Sharing) để cho phép các yêu cầu từ các nguồn khác nhau (ví dụ: frontend và backend).
    //3. Thiết lập chính sách quản lý phiên (session) là STATELESS, nghĩa là không lưu trữ thông tin phiên trên máy chủ, mà dựa vào JWT để xác thực.
    //4. Cấu hình quyền truy cập cho các endpoint: cho phép truy cập công khai cho các endpoint liên quan đến xác thực (/api/auth/**) và các yêu cầu GET đến /api/posts/**, trong khi yêu cầu xác thực cho tất cả các endpoint khác.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))    
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
    }

    //hàm corsConfigurationSource() tạo ra một cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng. CORS là một cơ chế bảo mật trình duyệt cho phép hoặc từ chối các yêu cầu từ các nguồn khác nhau (domain, protocol, port). Trong trường hợp này, cấu hình cho phép các yêu cầu từ "http://localhost:5173" với các phương thức GET, POST, PUT, DELETE và OPTIONS, cũng như tất cả các tiêu đề (headers). Cấu hình này được đăng ký cho tất cả các endpoint của ứng dụng ("/**").
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
