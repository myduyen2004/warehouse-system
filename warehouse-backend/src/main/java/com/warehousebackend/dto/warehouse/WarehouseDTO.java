package com.warehousebackend.dto.warehouse;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WarehouseDTO {
    @NotBlank(message = "Warehouse name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String district;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String phoneNumber;
    private String managerName;
    private String description;
}