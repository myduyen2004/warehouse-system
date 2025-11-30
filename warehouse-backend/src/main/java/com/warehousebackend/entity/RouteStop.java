package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_stops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private DeliveryRoute route;

    @Column(nullable = false)
    private Integer stopOrder;

    @Column(length = 255)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column
    private Integer estimatedArrivalMinutes; // Phút từ điểm xuất phát

    @Column
    private Integer serviceTime; // Thời gian phục vụ (phút)

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}