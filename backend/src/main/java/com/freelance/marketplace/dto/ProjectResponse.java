package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private List<String> requiredSkills;
    private Project.ProjectStatus status;
    private UserDto client;
    private LocalDateTime createdAt;
    
    public ProjectResponse() {}
    
    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.budget = project.getBudget();
        this.deadline = project.getDeadline();
        this.requiredSkills = project.getRequiredSkills();
        this.status = project.getStatus();
        this.client = new UserDto(project.getClient());
        this.createdAt = project.getCreatedAt();
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getBudget() {
        return budget;
    }
    
    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
    
    public LocalDate getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
    
    public List<String> getRequiredSkills() {
        return requiredSkills;
    }
    
    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
    
    public Project.ProjectStatus getStatus() {
        return status;
    }
    
    public void setStatus(Project.ProjectStatus status) {
        this.status = status;
    }
    
    public UserDto getClient() {
        return client;
    }
    
    public void setClient(UserDto client) {
        this.client = client;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        
        public UserDto() {}
        
        public UserDto(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
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
    }
} 