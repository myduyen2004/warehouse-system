package com.warehousebackend.exception;

/**
 * @author MyDuyen
 */

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}