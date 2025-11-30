package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions", indexes = {
        @Index(name = "idx_transaction_date", columnList = "transactionDate"),
        @Index(name = "idx_inventory_type", columnList = "inventory_id, type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type; // STOCK_IN, STOCK_OUT, ADJUSTMENT, RETURN

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer beforeQuantity;

    @Column(nullable = false)
    private Integer afterQuantity;

    @Column(length = 100)
    private String referenceNumber; // Số chứng từ

    @Column(length = 50)
    private String referenceType; // ORDER, PURCHASE_ORDER, RETURN, etc.

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }
}