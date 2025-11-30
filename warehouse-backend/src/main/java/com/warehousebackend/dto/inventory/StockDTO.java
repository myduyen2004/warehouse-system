package com.warehousebackend.dto.inventory;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockDTO {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String location;
    private String batchNumber;
    private String notes;
    private String referenceNumber;
}
