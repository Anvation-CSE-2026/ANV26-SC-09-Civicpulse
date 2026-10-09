package com.project.civicpulse.repository;

import com.project.civicpulse.entity.Report;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    List<Report> findAllByDeletedFalseOrderByCreatedAtDesc();

    long countByUserIdAndDeletedFalse(Long userId);

    Optional<Report> findByIdAndDeletedFalse(Long id);

    Optional<Report> findFirstByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    @Query("SELECT r FROM Report r WHERE r.deleted = false AND (r.assignedAdmin IS NULL OR r.assignedAdmin.id = :adminId) ORDER BY r.createdAt DESC")
    List<Report> findActiveReportsForAdmin(@Param("adminId") Long adminId);

    // Backward-compatible aliases
    default List<Report> findByUserIdOrderByCreatedAtDesc(Long userId) {
        return findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
    }

    default List<Report> findAllByOrderByCreatedAtDesc() {
        return findAllByDeletedFalseOrderByCreatedAtDesc();
    }

    default long countByUserId(Long userId) {
        return countByUserIdAndDeletedFalse(userId);
    }

    default Optional<Report> findFirstByUserIdOrderByCreatedAtDesc(Long userId) {
        return findFirstByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
    }
}
