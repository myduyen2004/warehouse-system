package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MyDuyen
 */

// Face recognition response
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaceRecognitionResponse {
    private Boolean success;
    private String message;
    private Long userId;
    private String username;
    private Double confidence;
    private String matchedPhotoUrl;
}