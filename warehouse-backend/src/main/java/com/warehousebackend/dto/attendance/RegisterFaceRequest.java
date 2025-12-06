package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MyDuyen
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterFaceRequest {
    private Long userId;
    private String faceImageBase64;
}