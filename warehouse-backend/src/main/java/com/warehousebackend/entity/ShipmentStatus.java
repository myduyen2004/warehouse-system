package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

public enum ShipmentStatus {
    PENDING,           // Chờ lấy hàng
    PICKED_UP,         // Đã lấy hàng
    IN_TRANSIT,        // Đang vận chuyển
    OUT_FOR_DELIVERY,  // Đang giao hàng
    DELIVERED,         // Đã giao
    FAILED,            // Giao thất bại
    RETURNED,          // Đã trả lại
    CANCELLED          // Đã hủy
}