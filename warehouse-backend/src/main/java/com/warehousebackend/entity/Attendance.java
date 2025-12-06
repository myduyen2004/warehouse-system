package com.warehousebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttendanceStatus status; // ON_TIME, LATE, EARLY_LEAVE, ABSENT

    @Column(name = "check_in_photo_url")
    private String checkInPhotoUrl;

    @Column(name = "check_out_photo_url")
    private String checkOutPhotoUrl;

    @Column(name = "check_in_location")
    private String checkInLocation; // GPS coordinates

    @Column(name = "check_out_location")
    private String checkOutLocation;

    @Column(length = 500)
    private String notes;

    @Column(name = "face_recognition_confidence")
    private Double faceRecognitionConfidence;

    @Column(name = "is_verified")
    private Boolean isVerified = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Tính tổng số giờ làm việc
    public Double getWorkingHours() {
        if (checkInTime != null && checkOutTime != null) {
            long minutes = java.time.Duration.between(checkInTime, checkOutTime).toMinutes();
            return minutes / 60.0;
        }
        return 0.0;
    }
}

