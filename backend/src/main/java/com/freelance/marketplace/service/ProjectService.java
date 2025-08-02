package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.ProjectRequest;
import com.freelance.marketplace.dto.ProjectResponse;
import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.ApplicationRepository;
import com.freelance.marketplace.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private UserService userService;
    
    public ProjectResponse createProject(ProjectRequest projectRequest, Long clientId) {
        User client = userService.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setBudget(projectRequest.getBudget());
        project.setDeadline(projectRequest.getDeadline());
        project.setRequiredSkills(projectRequest.getRequiredSkills());
        project.setClient(client);
        
        Project savedProject = projectRepository.save(project);
        return new ProjectResponse(savedProject);
    }
    
    public Page<ProjectResponse> getAllProjects(Pageable pageable) {
        Page<Project> projects = projectRepository.findAll(pageable);
        return projects.map(ProjectResponse::new);
    }
    
    public Page<ProjectResponse> getOpenProjects(Pageable pageable) {
        Page<Project> projects = projectRepository.findByStatus(Project.ProjectStatus.OPEN, pageable);
        return projects.map(ProjectResponse::new);
    }
    
    public Page<ProjectResponse> getProjectsBySkill(String skill, Pageable pageable) {
        Page<Project> projects = projectRepository.findOpenProjectsBySkill(skill, pageable);
        return projects.map(ProjectResponse::new);
    }
    
    public Page<ProjectResponse> getProjectsBySkills(List<String> skills, Pageable pageable) {
        Page<Project> projects = projectRepository.findOpenProjectsBySkills(skills, pageable);
        return projects.map(ProjectResponse::new);
    }
    
    public Page<ProjectResponse> getProjectsByClient(Long clientId, Pageable pageable) {
        User client = userService.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Page<Project> projects = projectRepository.findByClient(client, pageable);
        return projects.map(ProjectResponse::new);
    }
    
    public Optional<ProjectResponse> getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .map(ProjectResponse::new);
    }
    
    public Project getProjectEntityById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public ProjectResponse updateProject(Long projectId, @Valid ProjectRequest projectRequest, Long clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getClient().getId().equals(clientId)) {
            throw new RuntimeException("You do not have permission to update this project");
        }

        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setBudget(projectRequest.getBudget());
        project.setDeadline(projectRequest.getDeadline());
        project.setRequiredSkills(projectRequest.getRequiredSkills());

        Project updatedProject = projectRepository.save(project);
        return new ProjectResponse(updatedProject);
    }


    @Transactional
    public void deleteProject(Long projectId, Long clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getClient().getId().equals(clientId)) {
            throw new RuntimeException("You do not have permission to delete this project");
        }

        applicationRepository.deleteByProjectId(projectId);

        projectRepository.delete(project);
    }



} 