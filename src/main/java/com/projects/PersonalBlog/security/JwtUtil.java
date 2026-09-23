package com.projects.PersonalBlog.security;

import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

@Component 
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    //Phương thức getSigningKey() giải mã chuỗi bí mật (secret) từ định dạng Base64 và tạo ra một đối tượng SecretKey sử dụng thuật toán HMAC-SHA để ký JWT. SecretKey này được sử dụng để đảm bảo tính toàn vẹn và xác thực của token.
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //Phương thức generateAccessToken(String username) tạo ra một JWT mới với tên người dùng (username) làm chủ đề (subject), thời gian phát hành hiện tại, thời gian hết hạn dựa trên accessTokenExpiration, và ký token bằng khóa bí mật. Token này được sử dụng để xác thực người dùng trong các yêu cầu tiếp theo.
    public String generateAccessToken(String username) {
    return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
            .claim("type", "access")
            .signWith(getSigningKey())
            .compact();
    }

    //Phương thức extractUsername(String token) trích xuất tên người dùng (subject) từ một JWT đã ký. Nó sử dụng khóa bí mật để xác thực token và trả về chủ đề (subject) của token.
    public String extractUsername(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    //Phương thức isTokenExpired(String token) kiểm tra xem một JWT đã hết hạn hay chưa. Nó trích xuất thời gian hết hạn từ token và so sánh với thời gian hiện tại. Nếu thời gian hết hạn trước thời gian hiện tại, token được coi là đã hết hạn.
    public boolean isTokenExpired(String token) {
    Date expiration = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getExpiration();
    return expiration.before(new Date());
    }

    //Phương thức isTokenValid(String token, String username) kiểm tra tính hợp lệ của một JWT bằng cách so sánh tên người dùng trích xuất từ token với tên người dùng được cung cấp và kiểm tra xem token có hết hạn hay không. Nếu cả hai điều kiện đều đúng, token được coi là hợp lệ.
    public boolean isTokenValid(String token, String username) {
    return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

    //Phương thức generateRefreshToken(String username) tạo ra một JWT mới được sử dụng làm refresh token. Nó có cùng cấu trúc như access token nhưng có thời gian hết hạn dài hơn, được xác định bởi refreshTokenExpiration. Refresh token được sử dụng để lấy access token mới khi access token hiện tại hết hạn.
    public String generateRefreshToken(String username) {
    return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
            .claim("type", "refresh")
            .signWith(getSigningKey())
            .compact();
    }

    //hàm này để xác định loại token là access hay refresh
    public String extractType(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("type", String.class);
    }

}
