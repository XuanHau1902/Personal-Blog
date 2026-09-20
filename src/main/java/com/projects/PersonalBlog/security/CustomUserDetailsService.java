package com.projects.PersonalBlog.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

import com.projects.PersonalBlog.entity.User;
import com.projects.PersonalBlog.repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên tên người dùng (username) và trả về một đối tượng UserDetails chứa thông tin xác thực và quyền hạn của người dùng đó.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), getAuthorities(user));
    }

    //Phương thức này tạo ra một danh sách các quyền hạn (authorities) cho người dùng dựa trên vai trò (role) của họ. Nó trả về một danh sách chứa một đối tượng SimpleGrantedAuthority với tên quyền hạn được định dạng là "ROLE_" + tên vai trò của người dùng.
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

}
