package com.warehousebackend.dto.shipment;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationUpdateDTO {
    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Double speed;
    private String location;
    private String notes;
}