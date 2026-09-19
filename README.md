# Personal Blog

Dự án học tập cá nhân: xây dựng blog có xác thực, tập trung vào **Spring Security + JWT + phân quyền** — chủ đề mà hầu hết phỏng vấn Java đều hỏi.

## Tech Stack

**Backend:** Spring Boot 4, Spring Security 6, JWT (jjwt), Spring Data JPA, MySQL, Lombok

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios

## Tính năng

- Đăng ký / đăng nhập bằng JWT (access token + refresh token)
- Phân quyền `USER` / `ADMIN`
- *(Đang phát triển)* Viết bài markdown, tag (many-to-many), bình luận, upload ảnh bìa, bản nháp/xuất bản

## Tiến độ

- [x] **Tuần 1** — Spring Security từ gốc: filter chain, `UserDetailsService`, `PasswordEncoder`, đăng ký/đăng nhập trả JWT
- [ ] **Tuần 2** — Domain bài viết & tag, phân trang `Pageable`, kiểm tra quyền sở hữu bằng `@PreAuthorize`, upload ảnh
- [ ] **Tuần 3** — Frontend: route công khai/bảo vệ, Axios interceptor tự refresh token, form với react-hook-form + Zod
- [ ] **Tuần 4** — TanStack Query, phân trang vô tận, responsive, deploy

## Cấu trúc thư mục

```
src/         Backend Spring Boot
frontend/    Frontend React + Vite
```

## Chạy dự án

### Backend

1. Tạo database MySQL:
   ```sql
   CREATE DATABASE personal_blog;
   ```
2. Tạo file `src/main/resources/application-local.yaml` (không commit) với nội dung:
   ```yaml
   spring:
     datasource:
       username: root
       password: <mật khẩu MySQL của bạn>
   app:
     jwt:
       secret: <chuỗi random, ví dụ: openssl rand -base64 32>
   ```
3. Chạy với profile `local` (set biến môi trường `SPRING_PROFILES_ACTIVE=local`):
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

## API chính

| Method | Endpoint | Ghi chú |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập → `{ accessToken, refreshToken }` |
| POST | `/api/auth/refresh` | *(đang phát triển)* |
| GET | `/api/posts?page=&size=&tag=&q=` | *(đang phát triển)* |
| POST | `/api/posts` | *(đang phát triển, yêu cầu `ROLE_USER`)* |
| PUT | `/api/posts/{id}` | *(đang phát triển, chủ bài hoặc `ADMIN`)* |
| POST | `/api/posts/{id}/comments` | *(đang phát triển)* |
| POST | `/api/files/upload` | *(đang phát triển)* |
