package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.User;

public class AuthResponse {
    
    private String token;
    private UserDto user;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDto(user);
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private User.UserRole role;
        private String createdAt;
        
        public UserDto() {}
        
        public UserDto(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
            this.createdAt = user.getCreatedAt().toString();
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public User.UserRole getRole() {
            return role;
        }
        
        public void setRole(User.UserRole role) {
            this.role = role;
        }
        
        public String getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
} 