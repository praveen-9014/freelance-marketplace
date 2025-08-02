package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.ApplicationRequest;
import com.freelance.marketplace.dto.ApplicationResponse;
import com.freelance.marketplace.entity.Application;
import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserService userService;
    
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest, Long freelancerId) {
        Project project = projectService.getProjectEntityById(applicationRequest.getProjectId());
        User freelancer = userService.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        
        if (applicationRepository.existsByProjectAndFreelancer(project, freelancer)) {
            throw new RuntimeException("You have already applied to this project");
        }
        
        Application application = new Application();
        application.setProposalMessage(applicationRequest.getProposalMessage());
        application.setExpectedPrice(applicationRequest.getExpectedPrice());
        application.setPortfolioLink(applicationRequest.getPortfolioLink());
        application.setProject(project);
        application.setFreelancer(freelancer);
        
        Application savedApplication = applicationRepository.save(application);
        return new ApplicationResponse(savedApplication);
    }
    
    public Page<ApplicationResponse> getApplicationsByProject(Long projectId, Pageable pageable) {
        Project project = projectService.getProjectEntityById(projectId);
        Page<Application> applications = applicationRepository.findByProject(project, pageable);
        return applications.map(ApplicationResponse::new);
    }
    
    public Page<ApplicationResponse> getApplicationsByFreelancer(Long freelancerId, Pageable pageable) {
        User freelancer = userService.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        
        Page<Application> applications = applicationRepository.findByFreelancer(freelancer, pageable);
        return applications.map(ApplicationResponse::new);
    }
    
    public ApplicationResponse updateApplicationStatus(Long applicationId, Application.ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return new ApplicationResponse(updatedApplication);
    }
    
    public Optional<ApplicationResponse> getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .map(ApplicationResponse::new);
    }
    
    public boolean hasUserAppliedToProject(Long projectId, Long userId) {
        Project project = projectService.getProjectEntityById(projectId);
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return applicationRepository.existsByProjectAndFreelancer(project, user);
    }
    
    public List<Application> getApplicationsByProjectAndStatus(Long projectId, Application.ApplicationStatus status) {
        Project project = projectService.getProjectEntityById(projectId);
        return applicationRepository.findByProjectAndStatus(project, status);
    }
} 