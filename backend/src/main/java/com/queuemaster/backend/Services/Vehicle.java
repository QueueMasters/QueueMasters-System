package com.queuemaster.backend.Services;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plateNumber;
    private String carModel;
    private String washType;
    private String status;
    private boolean isPaid;
    private double amountPaid;
    private String phoneNumber;
}