package com.queuemaster.backend.Repositories;

import com.queuemaster.backend.Services.SaleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<SaleRecord, Long> {
    List<SaleRecord> findByDate(LocalDate date);
}