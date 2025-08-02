package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Application;
import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    Page<Application> findByProject(Project project, Pageable pageable);
    
    Page<Application> findByFreelancer(User freelancer, Pageable pageable);
    
    Optional<Application> findByProjectAndFreelancer(Project project, User freelancer);
    
    boolean existsByProjectAndFreelancer(Project project, User freelancer);
    
    List<Application> findByProjectAndStatus(Project project, Application.ApplicationStatus status);

    @Modifying
    @Transactional
    @Query("DELETE FROM Application a WHERE a.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
} 