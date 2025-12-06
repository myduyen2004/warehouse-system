package com.warehousebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warehousebackend.dto.attendance.FaceRecognitionResponse;
import com.warehousebackend.dto.attendance.RegisterFaceRequest;
import com.warehousebackend.entity.FaceData;
import com.warehousebackend.entity.User;
import com.warehousebackend.repository.FaceDataRepository;
import com.warehousebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FaceRecognitionService {

    private final FaceDataRepository faceDataRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${face.recognition.api.url:http://localhost:5000}")
    private String faceApiUrl;

    /**
     * Đăng ký khuôn mặt cho user
     */
    @Transactional
    public FaceRecognitionResponse registerFace(RegisterFaceRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra đã đăng ký chưa
        Optional<FaceData> existingFaceData = faceDataRepository.findByUser(user);
        if (existingFaceData.isPresent()) {
            // Nếu đã có, xóa cái cũ để đăng ký lại
            faceDataRepository.delete(existingFaceData.get());
        }

        try {
            // Gọi Python ML service để extract face encoding
            Map<String, Object> payload = new HashMap<>();
            payload.put("image", request.getFaceImageBase64());
            payload.put("user_id", user.getId());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    faceApiUrl + "/api/face/register",
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = response.getBody();
                String faceEmbedding = objectMapper.writeValueAsString(result.get("embedding"));

                // Lưu vào database
                FaceData faceData = FaceData.builder()
                        .user(user)
                        .faceEmbedding(faceEmbedding)
                        .facePhotoUrl((String) result.get("photo_url"))
                        .isActive(true)
                        .totalPhotos(1)
                        .build();

                faceDataRepository.save(faceData);

                System.out.println("✅ Face registered successfully for user: " + user.getId());
                System.out.println("✅ FaceData saved to database");

                return FaceRecognitionResponse.builder()
                        .success(true)
                        .message("Face registered successfully")
                        .userId(user.getId())
                        .username(user.getUsername())
                        .confidence(100.0)
                        .build();
            }

            throw new RuntimeException("Face registration failed");

        } catch (Exception e) {
            System.err.println("❌ Error registering face: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error registering face: " + e.getMessage());
        }
    }

    /**
     * Nhận diện khuôn mặt
     */
    public FaceRecognitionResponse recognizeFace(String faceImageBase64) {
        try {
            // Gọi Python ML service để nhận diện
            Map<String, Object> payload = new HashMap<>();
            payload.put("image", faceImageBase64);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    faceApiUrl + "/api/face/recognize",
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = response.getBody();
                Boolean success = (Boolean) result.get("success");

                if (success) {
                    Long userId = ((Number) result.get("user_id")).longValue();
                    Double confidence = ((Number) result.get("confidence")).doubleValue();

                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    return FaceRecognitionResponse.builder()
                            .success(true)
                            .message("Face recognized")
                            .userId(userId)
                            .username(user.getUsername())
                            .confidence(confidence)
                            .matchedPhotoUrl((String) result.get("matched_photo"))
                            .build();
                }

                return FaceRecognitionResponse.builder()
                        .success(false)
                        .message((String) result.get("message"))
                        .confidence(0.0)
                        .build();
            }

            throw new RuntimeException("Face recognition failed");

        } catch (Exception e) {
            return FaceRecognitionResponse.builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .confidence(0.0)
                    .build();
        }
    }

    /**
     * Cập nhật face data
     */
    @Transactional
    public void updateFaceData(Long userId, String faceImageBase64) {
        FaceData faceData = faceDataRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Face data not found"));

        // Gọi ML service để update embedding
        // ... implementation tương tự registerFace

        faceData.setTotalPhotos(faceData.getTotalPhotos() + 1);
        faceData.setLastUpdated(LocalDateTime.now());
        faceDataRepository.save(faceData);
    }

    /**
     * Kiểm tra user đã đăng ký khuôn mặt chưa
     */
    public boolean hasFaceRegistered(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasRegistered = faceDataRepository.existsByUser(user);

        System.out.println("🔍 Checking face registration for user: " + userId);
        System.out.println("🔍 Result: " + (hasRegistered ? "REGISTERED" : "NOT REGISTERED"));

        return hasRegistered;
    }

    /**
     * Xóa face data
     */
    @Transactional
    public void deleteFaceData(Long userId) {
        FaceData faceData = faceDataRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Face data not found"));

        faceDataRepository.delete(faceData);
    }
}