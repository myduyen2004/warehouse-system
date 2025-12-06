package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MyDuyen
 */

// Check-out request
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckOutRequest {
    private Long userId;
    private String faceImageBase64;
    private String location;
    private String notes;
}
