package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* @author MyDuyen
*/

// Check-in request
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInRequest {
    private Long userId;
    private String faceImageBase64; // Ảnh khuôn mặt dạng Base64
    private String location; // GPS coordinates
    private String notes;
}