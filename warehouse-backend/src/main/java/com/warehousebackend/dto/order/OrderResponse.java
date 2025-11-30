package com.warehousebackend.dto.order;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.shipment.ShipmentSummary;
import com.warehousebackend.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String warehouseName;
    private String status;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private Integer totalItems;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    private List<OrderItemResponse> items;
    private ShipmentSummary shipment;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .warehouseName(order.getWarehouse().getName())
                .status(order.getStatus().name())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .shippingAddress(order.getShippingAddress())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discount(order.getDiscount())
                .tax(order.getTax())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .totalItems(order.getTotalItems())
                .orderDate(order.getOrderDate())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .actualDeliveryDate(order.getActualDeliveryDate())
                .items(order.getItems().stream()
                        .map(OrderItemResponse::from)
                        .collect(Collectors.toList()))
                .shipment(order.getShipment() != null ?
                        ShipmentSummary.from(order.getShipment()) : null)
                .build();
    }
}