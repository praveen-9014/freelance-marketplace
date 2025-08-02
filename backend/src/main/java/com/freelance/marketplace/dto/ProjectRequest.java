package com.freelance.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ProjectRequest {
    
    @NotBlank(message = "Project name is required")
    private String name;
    
    @NotBlank(message = "Project description is required")
    private String description;
    
    @NotNull(message = "Budget is required")
    @Positive(message = "Budget must be positive")
    private BigDecimal budget;
    
    @NotNull(message = "Deadline is required")
    private LocalDate deadline;
    
    @NotNull(message = "Required skills are required")
    private List<String> requiredSkills;
    
    public ProjectRequest() {}
    
    public ProjectRequest(String name, String description, BigDecimal budget, 
                         LocalDate deadline, List<String> requiredSkills) {
        this.name = name;
        this.description = description;
        this.budget = budget;
        this.deadline = deadline;
        this.requiredSkills = requiredSkills;
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
} 