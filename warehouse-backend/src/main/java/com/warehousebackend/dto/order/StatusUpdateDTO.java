package com.warehousebackend.dto.order;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateDTO {
    @NotNull(message = "Status is required")
    private String status;
    private String notes;
}