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
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String district;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private Integer capacity; // Sức chứa (m3)

    @Column(nullable = false)
    private Integer currentUsage = 0; // Đang sử dụng (m3)

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, MAINTENANCE

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 100)
    private String managerName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Inventory> inventories = new ArrayList<>();

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

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
    public Double getUsagePercentage() {
        if (capacity == 0) return 0.0;
        return (currentUsage * 100.0) / capacity;
    }

    public Integer getAvailableCapacity() {
        return capacity - currentUsage;
    }
}