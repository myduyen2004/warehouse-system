package com.warehousebackend.entity;

/**
 * @author MyDuyen
 */

public enum TransactionType {
    STOCK_IN,      // Nhập kho
    STOCK_OUT,     // Xuất kho
    ADJUSTMENT,    // Điều chỉnh
    RETURN,        // Trả hàng
    TRANSFER,      // Chuyển kho
    DAMAGE         // Hư hỏng
}