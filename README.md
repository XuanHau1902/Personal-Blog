# Personal Blog

Dự án học tập cá nhân: xây dựng blog có xác thực, tập trung vào **Spring Security + JWT + phân quyền** — chủ đề mà hầu hết phỏng vấn Java đều hỏi.

## Tech Stack

**Backend:** Spring Boot 4, Spring Security 6, JWT (jjwt), Spring Data JPA, MySQL, Lombok

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios

## Tính năng

- Đăng ký / đăng nhập bằng JWT (access token + refresh token), tự động refresh khi access token hết hạn
- Phân quyền `USER` / `ADMIN` — admin sửa/xoá được bài viết của mọi người, user chỉ sửa/xoá được bài của mình (kiểm tra ở cả server lẫn UI)
- Viết bài markdown, tag (many-to-many), bản nháp/xuất bản, cover image + gallery ảnh (Cloudinary)
- Bình luận theo bài viết, xoá bình luận (chủ bình luận hoặc admin)
- Like (tim) bài viết
- Form đăng ký/đăng nhập/viết bài dùng react-hook-form + Zod validate

## Tiến độ

- [x] **Tuần 1** — Spring Security từ gốc: filter chain, `UserDetailsService`, `PasswordEncoder`, đăng ký/đăng nhập trả JWT
- [x] **Tuần 2** — Domain bài viết & tag, phân trang `Pageable`, kiểm tra quyền sở hữu bằng `@PreAuthorize`, upload ảnh
- [x] **Tuần 3** — Frontend: route công khai/bảo vệ, Axios interceptor tự refresh token, form với react-hook-form + Zod
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
   cloudinary:
     cloud-name: <cloud name Cloudinary>
     api-key: <api key>
     api-secret: <api secret>
   ```
   (`cloudinary.*` chỉ cần nếu muốn dùng tính năng upload ảnh.)
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
| POST | `/api/auth/refresh` | Cấp access token mới từ refresh token |
| GET | `/api/posts?page=&size=&tag=&q=` | Danh sách bài đã xuất bản, tìm theo tiêu đề/tag |
| GET | `/api/posts/{id}` | Chi tiết bài viết |
| POST | `/api/posts` | Tạo bài (yêu cầu đăng nhập) |
| PUT | `/api/posts/{id}` | Sửa bài (chủ bài hoặc `ADMIN`) |
| DELETE | `/api/posts/{id}` | Xoá bài (chủ bài hoặc `ADMIN`) |
| POST | `/api/posts/{id}/likes` | Toggle like/unlike (yêu cầu đăng nhập) |
| GET | `/api/comments/posts/{postId}` | Danh sách bình luận của 1 bài |
| POST | `/api/comments/posts/{postId}` | Đăng bình luận (yêu cầu đăng nhập) |
| DELETE | `/api/comments/{id}` | Xoá bình luận (chủ bình luận hoặc `ADMIN`) |
| POST | `/api/files/upload` | Upload ảnh lên Cloudinary (multipart, yêu cầu đăng nhập) |
