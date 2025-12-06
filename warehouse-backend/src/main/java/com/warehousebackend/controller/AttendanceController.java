package com.warehousebackend.controller;

import com.warehousebackend.dto.attendance.*;
import com.warehousebackend.service.AttendanceService;
import com.warehousebackend.service.FaceRecognitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final FaceRecognitionService faceRecognitionService;

    /**
     * Check-in (WAREHOUSE_STAFF only)
     */
    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<AttendanceResponse> checkIn(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(attendanceService.checkIn(request));
    }

    /**
     * Check-out (WAREHOUSE_STAFF only)
     */
    @PostMapping("/check-out")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<AttendanceResponse> checkOut(@RequestBody CheckOutRequest request) {
        return ResponseEntity.ok(attendanceService.checkOut(request));
    }

    /**
     * Đăng ký khuôn mặt
     */
    @PostMapping("/register-face")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<FaceRecognitionResponse> registerFace(
            @RequestBody RegisterFaceRequest request) {
        return ResponseEntity.ok(faceRecognitionService.registerFace(request));
    }

    /**
     * Lấy attendance của user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getUserAttendance(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(
                attendanceService.getUserAttendance(userId, startDate, endDate)
        );
    }

    /**
     * Lấy attendance hôm nay của user
     */
    @GetMapping("/user/{userId}/today")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getUserTodayAttendance(
            @PathVariable Long userId) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0);
        LocalDateTime tomorrow = today.plusDays(1);
        return ResponseEntity.ok(
                attendanceService.getUserAttendance(userId, today, tomorrow)
        );
    }

    /**
     * Lấy tất cả attendance hôm nay (Manager/Admin only)
     */
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getTodayAttendance() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    /**
     * Thống kê attendance của user
     */
    @GetMapping("/statistics/{userId}")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<AttendanceStatistics> getUserStatistics(
            @PathVariable Long userId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(
                attendanceService.getUserStatistics(userId, month, year)
        );
    }

    /**
     * Test face recognition
     */
    @PostMapping("/test-face")
    public ResponseEntity<FaceRecognitionResponse> testFaceRecognition(
            @RequestBody Map<String, String> request) {
        String faceImage = request.get("image");
        return ResponseEntity.ok(faceRecognitionService.recognizeFace(faceImage));
    }

    @GetMapping("/is-face-registered/{userId}")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<Map<String, Boolean>> isFaceRegistered(@PathVariable Long userId) {
        boolean registered = faceRecognitionService.hasFaceRegistered(userId);
        return ResponseEntity.ok(Map.of("registered", registered));
    }
    @GetMapping("/check-face-registered/{userId}")
    @PreAuthorize("hasAnyRole('WAREHOUSE_STAFF', 'MANAGER', 'ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkFaceRegistered(
            @PathVariable Long userId) {
        boolean isRegistered = faceRecognitionService.hasFaceRegistered(userId);
        return ResponseEntity.ok(Map.of("registered", isRegistered));
    }

}