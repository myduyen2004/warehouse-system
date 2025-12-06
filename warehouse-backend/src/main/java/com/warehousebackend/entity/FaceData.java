package com.warehousebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "face_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaceData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "face_embedding", columnDefinition = "TEXT")
    private String faceEmbedding; // JSON string của face encoding (128-d vector)

    @Column(name = "face_photo_url")
    private String facePhotoUrl; // URL ảnh khuôn mặt đã đăng ký

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "total_photos")
    private Integer totalPhotos = 0; // Số lượng ảnh đã train

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}