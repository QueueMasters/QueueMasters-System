package com.queuemaster.backend.Services;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class SaleRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plateNumber;
    private String washType;
    private double amount;
    private LocalDate date;
}