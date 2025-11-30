package com.warehousebackend.dto.product;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private String brand;
    private BigDecimal price;
    private BigDecimal costPrice;
    private String unit;
    private Double weight;
    private String description;
    private String imageUrl;
    private String status;
    private String supplierName;
    private Integer totalStock;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .category(product.getCategory())
                .brand(product.getBrand())
                .price(product.getPrice())
                .costPrice(product.getCostPrice())
                .unit(product.getUnit())
                .weight(product.getWeight())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .supplierName(product.getSupplier() != null ?
                        product.getSupplier().getName() : null)
                .createdAt(product.getCreatedAt())
                .build();
    }
}