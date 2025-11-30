package com.warehousebackend.dto.inventory;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockTransferDTO {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "From warehouse ID is required")
    private Long fromWarehouseId;

    @NotNull(message = "To warehouse ID is required")
    private Long toWarehouseId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String notes;
}