package com.warehousebackend.dto.product;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String category;
    private String brand;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal costPrice;
    private String unit;
    private Double weight;
    private Double length;
    private Double width;
    private Double height;
    private String description;
    private String imageUrl;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;
}
