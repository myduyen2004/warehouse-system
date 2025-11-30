package com.warehousebackend.dto.inventory;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Long warehouseId;
    private String warehouseName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer minThreshold;
    private Integer maxThreshold;
    private String location;
    private Boolean isLowStock;
    private Boolean isOverStock;
    private LocalDateTime lastUpdated;

    public static InventoryResponse from(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .productSku(inventory.getProduct().getSku())
                .warehouseId(inventory.getWarehouse().getId())
                .warehouseName(inventory.getWarehouse().getName())
                .quantity(inventory.getQuantity())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .minThreshold(inventory.getMinThreshold())
                .maxThreshold(inventory.getMaxThreshold())
                .location(inventory.getLocation())
                .isLowStock(inventory.isLowStock())
                .isOverStock(inventory.isOverStock())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}