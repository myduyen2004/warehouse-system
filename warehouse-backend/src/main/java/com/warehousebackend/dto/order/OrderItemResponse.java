package com.warehousebackend.dto.order;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal subtotal;

    public static OrderItemResponse from(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productSku(item.getProduct().getSku())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .discount(item.getDiscount())
                .subtotal(item.getSubtotal())
                .build();
    }
}