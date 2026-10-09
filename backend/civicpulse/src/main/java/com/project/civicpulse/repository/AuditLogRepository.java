package com.project.civicpulse.repository;

import com.project.civicpulse.entity.AuditLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByTargetTypeAndTargetIdOrderByTimestampDesc(String targetType, Long targetId);
}
