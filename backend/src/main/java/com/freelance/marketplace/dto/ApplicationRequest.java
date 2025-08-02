package com.freelance.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ApplicationRequest {
    
    @NotBlank(message = "Proposal message is required")
    private String proposalMessage;
    
    @Positive(message = "Expected price must be positive")
    private BigDecimal expectedPrice;
    
    private String portfolioLink;
    
    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    public ApplicationRequest() {}
    
    public ApplicationRequest(String proposalMessage, BigDecimal expectedPrice, 
                             String portfolioLink, Long projectId) {
        this.proposalMessage = proposalMessage;
        this.expectedPrice = expectedPrice;
        this.portfolioLink = portfolioLink;
        this.projectId = projectId;
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
    
    public Long getProjectId() {
        return projectId;
    }
    
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
} 