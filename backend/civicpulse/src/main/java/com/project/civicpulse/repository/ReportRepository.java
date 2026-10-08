package com.project.civicpulse.repository;

import com.project.civicpulse.entity.Report;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Report> findAllByOrderByCreatedAtDesc();
}
