package com.warehousebackend.dto.vehicle;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleDTO {
    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    private String brand;
    private String model;
    private Integer year;

    @NotNull(message = "Capacity is required")
    @Min(value = 0, message = "Capacity must be positive")
    private Double capacity;

    private Double volumeCapacity;
    private Double currentMileage;
    private Double fuelEfficiency;
}