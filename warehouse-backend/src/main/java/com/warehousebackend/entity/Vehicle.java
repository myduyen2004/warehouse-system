package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String licensePlate;

    @Column(length = 50)
    private String vehicleType; // TRUCK, VAN, MOTORCYCLE

    @Column(length = 50)
    private String brand;

    @Column(length = 50)
    private String model;

    @Column
    private Integer year;

    private Double capacity; // Tải trọng (kg)

    private Double volumeCapacity; // Thể tích (m3)

    @Column(length = 20)
    private String status = "AVAILABLE"; // AVAILABLE, IN_USE, MAINTENANCE, BROKEN

    private Double currentMileage; // km

    private Double fuelEfficiency; // km/liter

    @Column(name = "last_maintenance_date")
    private LocalDateTime lastMaintenanceDate;

    @Column(name = "next_maintenance_date")
    private LocalDateTime nextMaintenanceDate;

    private Double currentLatitude;

    private Double currentLongitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_driver_id")
    private User currentDriver;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Shipment> shipments = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public Boolean needsMaintenance() {
        return nextMaintenanceDate != null &&
                nextMaintenanceDate.isBefore(LocalDateTime.now().plusDays(7));
    }

    public Boolean isAvailable() {
        return "AVAILABLE".equals(status);
    }
}