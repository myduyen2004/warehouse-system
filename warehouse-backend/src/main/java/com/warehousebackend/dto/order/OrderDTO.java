package com.warehousebackend.dto.order;

/**
 * @author MyDuyen
 */

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDTO {
    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    private Long customerId;

    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemDTO> items;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingDistrict;
    private Double shippingLatitude;
    private Double shippingLongitude;

    private BigDecimal shippingFee;
    private BigDecimal discount;
    private String paymentMethod;
    private String notes;
}