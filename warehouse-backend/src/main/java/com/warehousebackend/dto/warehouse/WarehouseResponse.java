package com.warehousebackend.dto.warehouse;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Warehouse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String district;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private Integer currentUsage;
    private Integer availableCapacity;
    private Double usagePercentage;
    private String status;
    private String phoneNumber;
    private String managerName;
    private String description;
    private LocalDateTime createdAt;

    public static WarehouseResponse from(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .city(warehouse.getCity())
                .district(warehouse.getDistrict())
                .latitude(warehouse.getLatitude())
                .longitude(warehouse.getLongitude())
                .capacity(warehouse.getCapacity())
                .currentUsage(warehouse.getCurrentUsage())
                .availableCapacity(warehouse.getAvailableCapacity())
                .usagePercentage(warehouse.getUsagePercentage())
                .status(warehouse.getStatus())
                .phoneNumber(warehouse.getPhoneNumber())
                .managerName(warehouse.getManagerName())
                .description(warehouse.getDescription())
                .createdAt(warehouse.getCreatedAt())
                .build();
    }
}