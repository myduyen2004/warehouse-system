import 'dart:convert';
import 'dart:io';
import 'package:image/image.dart' as img;
import '../models/attendance.dart';
import 'api_service.dart';

class AttendanceService {
  final ApiService _apiService = ApiService();

  // Check-in với face recognition
  Future<Attendance> checkIn({
    required int userId,
    required File faceImage,
    String? location,
    String? notes,
  }) async {
    try {
      // Convert image to base64
      final bytes = await faceImage.readAsBytes();
      
      // Resize image để giảm size (optional)
      img.Image? image = img.decodeImage(bytes);
      if (image != null) {
        image = img.copyResize(image, width: 800);
      }
      
      final resizedBytes = image != null ? img.encodeJpg(image, quality: 85) : bytes;
      final base64Image = base64Encode(resizedBytes);

      final response = await _apiService.post('/attendance/check-in', {
        'userId': userId,
        'faceImageBase64': 'data:image/jpeg;base64,$base64Image',
        'location': location,
        'notes': notes,
      });

      if (response.statusCode == 200) {
        return Attendance.fromJson(response.data);
      } else {
        throw Exception('Check-in failed');
      }
    } catch (e) {
      print('Error checking in: $e');
      rethrow;
    }
  }

  // Check-out với face recognition
  Future<Attendance> checkOut({
    required int userId,
    required File faceImage,
    String? location,
    String? notes,
  }) async {
    try {
      final bytes = await faceImage.readAsBytes();
      
      img.Image? image = img.decodeImage(bytes);
      if (image != null) {
        image = img.copyResize(image, width: 800);
      }
      
      final resizedBytes = image != null ? img.encodeJpg(image, quality: 85) : bytes;
      final base64Image = base64Encode(resizedBytes);

      final response = await _apiService.post('/attendance/check-out', {
        'userId': userId,
        'faceImageBase64': 'data:image/jpeg;base64,$base64Image',
        'location': location,
        'notes': notes,
      });

      if (response.statusCode == 200) {
        return Attendance.fromJson(response.data);
      } else {
        throw Exception('Check-out failed');
      }
    } catch (e) {
      print('Error checking out: $e');
      rethrow;
    }
  }

  // Đăng ký khuôn mặt
  Future<bool> registerFace({
    required int userId,
    required File faceImage,
  }) async {
    try {
      final bytes = await faceImage.readAsBytes();
      
      img.Image? image = img.decodeImage(bytes);
      if (image != null) {
        image = img.copyResize(image, width: 800);
      }
      
      final resizedBytes = image != null ? img.encodeJpg(image, quality: 85) : bytes;
      final base64Image = base64Encode(resizedBytes);

      final response = await _apiService.post('/attendance/register-face', {
        'userId': userId,
        'faceImageBase64': 'data:image/jpeg;base64,$base64Image',
      });

      return response.statusCode == 200;
    } catch (e) {
      print('Error registering face: $e');
      rethrow;
    }
  }

  // Lấy attendance hôm nay của user
  Future<List<Attendance>> getTodayAttendance(int userId) async {
    try {
      final response = await _apiService.get('/attendance/user/$userId/today');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Attendance.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load attendance');
      }
    } catch (e) {
      print('Error getting today attendance: $e');
      rethrow;
    }
  }

  // Lấy attendance trong khoảng thời gian
  Future<List<Attendance>> getUserAttendance({
    required int userId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final response = await _apiService.get(
        '/attendance/user/$userId'
        '?startDate=${startDate.toIso8601String()}'
        '&endDate=${endDate.toIso8601String()}',
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Attendance.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load attendance');
      }
    } catch (e) {
      print('Error getting user attendance: $e');
      rethrow;
    }
  }

  // Lấy tất cả attendance hôm nay (cho manager)
  Future<List<Attendance>> getAllTodayAttendance() async {
    try {
      final response = await _apiService.get('/attendance/today');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Attendance.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load attendance');
      }
    } catch (e) {
      print('Error getting all today attendance: $e');
      rethrow;
    }
  }

  // Kiểm tra user đã đăng ký khuôn mặt chưa
  Future<bool> hasFaceRegistered(int userId) async {
    try {
      final response = await _apiService.get(
        '/attendance/check-face-registered/$userId',
      );

      if (response.statusCode == 200) {
        return response.data['registered'] ?? false;
      }
      return false;
    } catch (e) {
      print('Error checking face registration: $e');
      return false;
    }
  }

  // Lấy thống kê attendance
  Future<Map<String, dynamic>> getStatistics({
    required int userId,
    required int month,
    required int year,
  }) async {
    try {
      final response = await _apiService.get(
        '/attendance/statistics/$userId?month=$month&year=$year',
      );

      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Failed to load statistics');
      }
    } catch (e) {
      print('Error getting statistics: $e');
      rethrow;
    }
  }
}