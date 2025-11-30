package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

public enum OrderStatus {
    PENDING,        // Chờ xử lý
    CONFIRMED,      // Đã xác nhận
    PROCESSING,     // Đang xử lý
    PACKED,         // Đã đóng gói
    READY_TO_SHIP,  // Sẵn sàng giao
    SHIPPED,        // Đang giao
    DELIVERED,      // Đã giao
    CANCELLED,      // Đã hủy
    RETURNED        // Đã trả hàng
}
