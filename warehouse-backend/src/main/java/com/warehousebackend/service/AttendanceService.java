package com.warehousebackend.service;

import com.warehousebackend.dto.attendance.*;
import com.warehousebackend.entity.Attendance;
import com.warehousebackend.entity.AttendanceStatus;
import com.warehousebackend.entity.User;
import com.warehousebackend.repository.AttendanceRepository;
import com.warehousebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final FaceRecognitionService faceRecognitionService;
    private final FileStorageService fileStorageService;

    // Giờ làm việc chuẩn
    private static final LocalTime WORK_START_TIME = LocalTime.of(8, 0); // 8:00 AM
    private static final LocalTime LATE_THRESHOLD = LocalTime.of(8, 15); // Muộn sau 8:15 AM

    @Transactional
    public AttendanceResponse checkIn(CheckInRequest request) {
        // 1. Xác thực user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Kiểm tra đã check-in hôm nay chưa
        LocalDateTime today = LocalDateTime.now();
        attendanceRepository.findByUserAndDate(user, today)
                .ifPresent(a -> {
                    throw new RuntimeException("Already checked in today");
                });

        // 3. Nhận diện khuôn mặt
        FaceRecognitionResponse faceResult =
                faceRecognitionService.recognizeFace(request.getFaceImageBase64());

        System.out.println("👤 Check-in request from user: " + user.getId());
        System.out.println("🔍 Face recognition result:");
        System.out.println("   - Success: " + faceResult.getSuccess());
        System.out.println("   - Recognized user_id: " + faceResult.getUserId());
        System.out.println("   - Confidence: " + faceResult.getConfidence() + "%");
        System.out.println("   - Message: " + faceResult.getMessage());

        if (!faceResult.getSuccess()) {
            throw new RuntimeException("Face recognition failed: " + faceResult.getMessage());
        }

        if (!faceResult.getUserId().equals(user.getId())) {
            System.err.println("❌ Face mismatch!");
            System.err.println("   Expected user_id: " + user.getId());
            System.err.println("   Recognized user_id: " + faceResult.getUserId());
            throw new RuntimeException(
                    "Face does not match registered user. Expected: " + user.getId() +
                            ", Got: " + faceResult.getUserId()
            );
        }

        // 4. Lưu ảnh check-in
        String photoUrl = fileStorageService.saveBase64Image(
                request.getFaceImageBase64(),
                "attendance/checkin/" + user.getId() + "_" + System.currentTimeMillis()
        );

        // 5. Xác định status (ON_TIME hoặc LATE)
        LocalTime checkInTime = LocalTime.now();
        AttendanceStatus status = checkInTime.isBefore(LATE_THRESHOLD)
                ? AttendanceStatus.ON_TIME
                : AttendanceStatus.LATE;

        // 6. Tạo attendance record
        Attendance attendance = Attendance.builder()
                .user(user)
                .checkInTime(today)
                .status(status)
                .checkInPhotoUrl(photoUrl)
                .checkInLocation(request.getLocation())
                .notes(request.getNotes())
                .faceRecognitionConfidence(faceResult.getConfidence())
                .isVerified(true)
                .build();

        attendance = attendanceRepository.save(attendance);

        // 7. Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return convertToResponse(attendance);
    }

    @Transactional
    public AttendanceResponse checkOut(CheckOutRequest request) {
        // 1. Xác thực user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Tìm attendance chưa check-out
        Attendance attendance = attendanceRepository.findLatestUncheckedOut(user)
                .orElseThrow(() -> new RuntimeException("No check-in record found"));

        // 3. Nhận diện khuôn mặt
        FaceRecognitionResponse faceResult =
                faceRecognitionService.recognizeFace(request.getFaceImageBase64());
        System.out.println("👤 Check-in request from user: " + user.getId());
        System.out.println("🔍 Face recognition result:");
        System.out.println("   - Success: " + faceResult.getSuccess());
        System.out.println("   - Recognized user_id: " + faceResult.getUserId());
        System.out.println("   - Confidence: " + faceResult.getConfidence() + "%");
        System.out.println("   - Message: " + faceResult.getMessage());

        if (!faceResult.getSuccess() || !faceResult.getUserId().equals(user.getId())) {
            throw new RuntimeException("Face recognition failed");
        }
        if (!faceResult.getUserId().equals(user.getId())) {
            System.err.println("❌ Face mismatch!");
            System.err.println("   Expected user_id: " + user.getId());
            System.err.println("   Recognized user_id: " + faceResult.getUserId());
            throw new RuntimeException(
                    "Face does not match registered user. Expected: " + user.getId() +
                            ", Got: " + faceResult.getUserId()
            );
        }

        // 4. Lưu ảnh check-out
        String photoUrl = fileStorageService.saveBase64Image(
                request.getFaceImageBase64(),
                "attendance/checkout/" + user.getId() + "_" + System.currentTimeMillis()
        );

        // 5. Update attendance
        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.setCheckOutPhotoUrl(photoUrl);
        attendance.setCheckOutLocation(request.getLocation());
        if (request.getNotes() != null) {
            attendance.setNotes(attendance.getNotes() + " | " + request.getNotes());
        }

        attendance = attendanceRepository.save(attendance);

        return convertToResponse(attendance);
    }

    // Lấy attendance của user trong khoảng thời gian
    public List<AttendanceResponse> getUserAttendance(Long userId,
                                                      LocalDateTime startDate,
                                                      LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserAndDateRange(user, startDate, endDate)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Lấy tất cả attendance trong ngày (cho manager)
    public List<AttendanceResponse> getTodayAttendance() {
        return attendanceRepository.findAllByDate(LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Thống kê attendance của user
    public AttendanceStatistics getUserStatistics(Long userId, int month, int year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusDays(1);

        List<Attendance> attendances = attendanceRepository
                .findByUserAndDateRange(user, startDate, endDate);

        long presentDays = attendances.stream()
                .filter(a -> a.getStatus() != AttendanceStatus.ABSENT)
                .count();

        long lateDays = attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                .count();

        Double totalHours = attendanceRepository.getTotalWorkingHours(user, month, year);

        return AttendanceStatistics.builder()
                .totalDays(attendances.size())
                .presentDays((int) presentDays)
                .lateDays((int) lateDays)
                .totalWorkingHours(totalHours != null ? totalHours : 0.0)
                .averageWorkingHours(presentDays > 0 ? totalHours / presentDays : 0.0)
                .build();
    }

    private AttendanceResponse convertToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .userId(attendance.getUser().getId())
                .username(attendance.getUser().getUsername())
                .fullName(attendance.getUser().getFullName())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus().name())
                .checkInPhotoUrl(attendance.getCheckInPhotoUrl())
                .checkOutPhotoUrl(attendance.getCheckOutPhotoUrl())
                .checkInLocation(attendance.getCheckInLocation())
                .checkOutLocation(attendance.getCheckOutLocation())
                .workingHours(attendance.getWorkingHours())
                .faceRecognitionConfidence(attendance.getFaceRecognitionConfidence())
                .isVerified(attendance.getIsVerified())
                .notes(attendance.getNotes())
                .build();
    }
}