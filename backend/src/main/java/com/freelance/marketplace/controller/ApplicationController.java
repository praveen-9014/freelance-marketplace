package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApplicationRequest;
import com.freelance.marketplace.dto.ApplicationResponse;
import com.freelance.marketplace.entity.Application;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.service.ApplicationService;
import com.freelance.marketplace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody ApplicationRequest applicationRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ApplicationResponse application = applicationService.createApplication(applicationRequest, currentUser.getId());
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<Page<ApplicationResponse>> getApplicationsByProject(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService.getApplicationsByProject(projectId, pageable);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/freelancer")
    public ResponseEntity<Page<ApplicationResponse>> getApplicationsByFreelancer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService.getApplicationsByFreelancer(currentUser.getId(), pageable);
        return ResponseEntity.ok(applications);
    }
    
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam Application.ApplicationStatus status) {
        ApplicationResponse application = applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long applicationId) {
        return applicationService.getApplicationById(applicationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/check/{projectId}")
    public ResponseEntity<Boolean> hasUserAppliedToProject(@PathVariable Long projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean hasApplied = applicationService.hasUserAppliedToProject(projectId, currentUser.getId());
        return ResponseEntity.ok(hasApplied);
    }
} 