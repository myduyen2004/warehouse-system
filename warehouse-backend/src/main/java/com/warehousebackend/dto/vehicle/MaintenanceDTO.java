package com.warehousebackend.dto.vehicle;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaintenanceDTO {
    @NotNull(message = "Next maintenance date is required")
    private LocalDateTime nextMaintenanceDate;

    private String notes;
}