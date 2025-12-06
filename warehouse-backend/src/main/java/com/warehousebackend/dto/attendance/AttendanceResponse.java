package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author MyDuyen
 */

// Attendance response
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status;
    private String checkInPhotoUrl;
    private String checkOutPhotoUrl;
    private String checkInLocation;
    private String checkOutLocation;
    private Double workingHours;
    private Double faceRecognitionConfidence;
    private Boolean isVerified;
    private String notes;
}