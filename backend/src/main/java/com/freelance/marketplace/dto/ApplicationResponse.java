package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.Application;
import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ApplicationResponse {
    
    private Long id;
    private String proposalMessage;
    private BigDecimal expectedPrice;
    private String portfolioLink;
    private Application.ApplicationStatus status;
    private ProjectDto project;
    private UserDto freelancer;
    private LocalDateTime createdAt;
    
    public ApplicationResponse() {}
    
    public ApplicationResponse(Application application) {
        this.id = application.getId();
        this.proposalMessage = application.getProposalMessage();
        this.expectedPrice = application.getExpectedPrice();
        this.portfolioLink = application.getPortfolioLink();
        this.status = application.getStatus();
        this.project = new ProjectDto(application.getProject());
        this.freelancer = new UserDto(application.getFreelancer());
        this.createdAt = application.getCreatedAt();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProposalMessage() {
        return proposalMessage;
    }
    
    public void setProposalMessage(String proposalMessage) {
        this.proposalMessage = proposalMessage;
    }
    
    public BigDecimal getExpectedPrice() {
        return expectedPrice;
    }
    
    public void setExpectedPrice(BigDecimal expectedPrice) {
        this.expectedPrice = expectedPrice;
    }
    
    public String getPortfolioLink() {
        return portfolioLink;
    }
    
    public void setPortfolioLink(String portfolioLink) {
        this.portfolioLink = portfolioLink;
    }
    
    public Application.ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(Application.ApplicationStatus status) {
        this.status = status;
    }
    
    public ProjectDto getProject() {
        return project;
    }
    
    public void setProject(ProjectDto project) {
        this.project = project;
    }
    
    public UserDto getFreelancer() {
        return freelancer;
    }
    
    public void setFreelancer(UserDto freelancer) {
        this.freelancer = freelancer;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public static class ProjectDto {
        private Long id;
        private String name;
        private String description;
        private BigDecimal budget;
        private LocalDate deadline;
        private List<String> requiredSkills;
        private LocalDateTime createdAt;
        private UserDto client;
        
        public ProjectDto() {}
        
        public ProjectDto(Project project) {
            this.id = project.getId();
            this.name = project.getName();
            this.description = project.getDescription();
            this.budget = project.getBudget();
            this.deadline = project.getDeadline();
            this.requiredSkills = project.getRequiredSkills();
            this.createdAt = project.getCreatedAt();
            this.client = new UserDto(project.getClient());
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
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public UserDto getClient() {
            return client;
        }
        
        public void setClient(UserDto client) {
            this.client = client;
        }
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