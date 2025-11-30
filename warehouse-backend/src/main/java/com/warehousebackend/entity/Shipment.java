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
@Table(name = "shipments", indexes = {
        @Index(name = "idx_tracking_number", columnList = "trackingNumber"),
        @Index(name = "idx_shipment_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String trackingNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private DeliveryRoute route;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ShipmentStatus status;

    @Column(length = 255)
    private String currentLocation; // JSON: {"lat": 21.028, "lng": 105.854}

    private Double currentLatitude;

    private Double currentLongitude;

    private Double currentSpeed; // km/h

    private Double distanceTraveled; // km

    private Double estimatedDistance; // km

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "actual_delivery_time")
    private LocalDateTime actualDeliveryTime;

    @Column(columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(length = 255)
    private String deliveryProofUrl; // Ảnh chứng minh giao hàng

    @Column(length = 100)
    private String recipientName;

    @Column(length = 255)
    private String recipientSignature;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ShipmentTracking> trackingHistory = new ArrayList<>();

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
    public Boolean isDelayed() {
        if (estimatedDeliveryTime == null) return false;
        return LocalDateTime.now().isAfter(estimatedDeliveryTime)
                && status != ShipmentStatus.DELIVERED;
    }

    public Long getDelayMinutes() {
        if (!isDelayed()) return 0L;
        return java.time.Duration.between(estimatedDeliveryTime, LocalDateTime.now()).toMinutes();
    }
}