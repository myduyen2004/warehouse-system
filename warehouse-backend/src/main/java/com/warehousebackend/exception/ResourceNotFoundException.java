package com.warehousebackend.exception;

/**
 * @author MyDuyen
 */

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}