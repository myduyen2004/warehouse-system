package com.warehousebackend.dto.vehicle;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private String licensePlate;
    private String vehicleType;
    private String brand;
    private String model;
    private Integer year;
    private Double capacity;
    private Double volumeCapacity;
    private String status;
    private Double currentMileage;
    private Double fuelEfficiency;
    private LocalDateTime lastMaintenanceDate;
    private LocalDateTime nextMaintenanceDate;
    private Boolean needsMaintenance;
    private String currentDriverName;
    private LocalDateTime createdAt;

    public static VehicleResponse from(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .licensePlate(vehicle.getLicensePlate())
                .vehicleType(vehicle.getVehicleType())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .capacity(vehicle.getCapacity())
                .volumeCapacity(vehicle.getVolumeCapacity())
                .status(vehicle.getStatus())
                .currentMileage(vehicle.getCurrentMileage())
                .fuelEfficiency(vehicle.getFuelEfficiency())
                .lastMaintenanceDate(vehicle.getLastMaintenanceDate())
                .nextMaintenanceDate(vehicle.getNextMaintenanceDate())
                .needsMaintenance(vehicle.needsMaintenance())
                .currentDriverName(vehicle.getCurrentDriver() != null ?
                        vehicle.getCurrentDriver().getFullName() : null)
                .createdAt(vehicle.getCreatedAt())
                .build();
    }
}