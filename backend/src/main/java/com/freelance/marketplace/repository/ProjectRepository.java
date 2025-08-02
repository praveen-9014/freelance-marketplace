package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    Page<Project> findByStatus(Project.ProjectStatus status, Pageable pageable);
    
    Page<Project> findByClient(User client, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.status = 'OPEN' AND " +
           "(:skill IS NULL OR :skill MEMBER OF p.requiredSkills)")
    Page<Project> findOpenProjectsBySkill(@Param("skill") String skill, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.status = 'OPEN' AND " +
           "(:skills IS NULL OR EXISTS (SELECT s FROM p.requiredSkills s WHERE s IN :skills))")
    Page<Project> findOpenProjectsBySkills(@Param("skills") List<String> skills, Pageable pageable);
} 