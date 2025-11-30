package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "warehouse_id"}),
        indexes = {
                @Index(name = "idx_warehouse_product", columnList = "warehouse_id, product_id"),
                @Index(name = "idx_quantity", columnList = "quantity")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false)
    private Integer reservedQuantity = 0; // Số lượng đã đặt hàng nhưng chưa xuất

    @Column(nullable = false)
    private Integer minThreshold = 10; // Mức tồn kho tối thiểu

    @Column(nullable = false)
    private Integer maxThreshold = 1000; // Mức tồn kho tối đa

    @Column(length = 50)
    private String location; // Vị trí trong kho (A1, B2, etc.)

    @Column(length = 50)
    private String batchNumber; // Số lô

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate; // Hạn sử dụng

    @Column(name = "last_stock_in")
    private LocalDateTime lastStockIn;

    @Column(name = "last_stock_out")
    private LocalDateTime lastStockOut;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    // Helper methods
    public Integer getAvailableQuantity() {
        return quantity - reservedQuantity;
    }

    public Boolean isLowStock() {
        return quantity < minThreshold;
    }

    public Boolean isOverStock() {
        return quantity > maxThreshold;
    }

    public Boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDateTime.now());
    }

    public Boolean isExpiringSoon(int days) {
        return expiryDate != null &&
                expiryDate.isBefore(LocalDateTime.now().plusDays(days));
    }
}