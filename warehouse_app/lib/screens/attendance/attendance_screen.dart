import 'dart:io';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../../models/attendance.dart';
import '../../services/attendance_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/loading_indicator.dart';
import 'face_capture_screen.dart';
import 'attendance_history_screen.dart';
import 'register_face_screen.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({Key? key}) : super(key: key);

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final AttendanceService _attendanceService = AttendanceService();
  final AuthService _authService = AuthService();
  
  Attendance? _todayAttendance;
  bool _isLoading = false;
  bool _hasFaceRegistered = false;
  String? _userId;
  Position? _currentPosition;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    try {
      // Get current user
      _userId = await _authService.getUserId();
      if (_userId == null) {
        throw Exception('User not logged in');
      }

      // Get location
      await _getCurrentLocation();

      // Check if face is registered
      await _checkFaceRegistration();

      // Get today's attendance
      final attendances = await _attendanceService.getTodayAttendance(
        int.parse(_userId!),
      );

      setState(() {
        _todayAttendance = attendances.isNotEmpty ? attendances.first : null;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  Future<void> _checkFaceRegistration() async {
    try {
      // Call API to check if user has registered face
      final hasRegistered = await _attendanceService.hasFaceRegistered(
        int.parse(_userId!),
      );
      setState(() {
        _hasFaceRegistered = hasRegistered;
      });
    } catch (e) {
      print('Error checking face registration: $e');
      _hasFaceRegistered = false;
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permission denied');
        }
      }

      _currentPosition = await Geolocator.getCurrentPosition();
    } catch (e) {
      print('Error getting location: $e');
    }
  }

  Future<void> _navigateToRegisterFace() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const RegisterFaceScreen(),
      ),
    );

    if (result == true) {
      // Face registered successfully - reload data to update status
      await _loadData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đăng ký khuôn mặt thành công! Bạn có thể chấm công ngay.'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 3),
          ),
        );
      }
    }
  }

  Future<void> _handleCheckIn() async {
    // Check if face is registered
    if (!_hasFaceRegistered) {
      final confirm = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Chưa đăng ký khuôn mặt'),
          content: const Text(
            'Bạn cần đăng ký khuôn mặt trước khi chấm công. '
            'Bạn có muốn đăng ký ngay không?'
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Để sau'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Đăng ký ngay'),
            ),
          ],
        ),
      );

      if (confirm == true) {
        await _navigateToRegisterFace();
      }
      return;
    }

    // Navigate to face capture screen
    final File? faceImage = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FaceCaptureScreen(
          title: 'Chụp khuôn mặt Check-in',
          onImageCaptured: (file) {},
        ),
      ),
    );

    if (faceImage == null) return;

    setState(() => _isLoading = true);

    try {
      final location = _currentPosition != null
          ? '${_currentPosition!.latitude},${_currentPosition!.longitude}'
          : null;

      final attendance = await _attendanceService.checkIn(
        userId: int.parse(_userId!),
        faceImage: faceImage,
        location: location,
      );

      setState(() {
        _todayAttendance = attendance;
        _isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Check-in thành công! ${attendance.statusDisplay}'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Check-in thất bại: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _handleCheckOut() async {
    final File? faceImage = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FaceCaptureScreen(
          title: 'Chụp khuôn mặt Check-out',
          onImageCaptured: (file) {},
        ),
      ),
    );

    if (faceImage == null) return;

    setState(() => _isLoading = true);

    try {
      final location = _currentPosition != null
          ? '${_currentPosition!.latitude},${_currentPosition!.longitude}'
          : null;

      final attendance = await _attendanceService.checkOut(
        userId: int.parse(_userId!),
        faceImage: faceImage,
        location: location,
      );

      setState(() {
        _todayAttendance = attendance;
        _isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Check-out thành công!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Check-out thất bại: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chấm công'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AttendanceHistoryScreen(
                    userId: int.parse(_userId ?? '0'),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Đang tải...')
          : _buildBody(),
    );
  }

  Widget _buildBody() {
    final now = DateTime.now();
    final hasCheckedIn = _todayAttendance != null;
    final hasCheckedOut = hasCheckedIn && _todayAttendance!.hasCheckedOut;

    return RefreshIndicator(
      onRefresh: _loadData,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Current time card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Icon(
                      Icons.access_time,
                      size: 60,
                      color: Colors.blue,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}',
                      style: const TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${now.day}/${now.month}/${now.year}',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Face registration status
            if (!_hasFaceRegistered) ...[
              Card(
                color: Colors.orange[50],
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.warning, color: Colors.orange),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Bạn chưa đăng ký khuôn mặt',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Vui lòng đăng ký khuôn mặt để sử dụng tính năng chấm công',
                      ),
                      const SizedBox(height: 12),
                      CustomButton(
                        text: 'Đăng ký khuôn mặt',
                        onPressed: _navigateToRegisterFace,
                        icon: Icons.face,
                        color: Colors.orange,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Status card
            if (hasCheckedIn) ...[
              Card(
                color: hasCheckedOut ? Colors.grey[100] : Colors.green[50],
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Icon(
                            hasCheckedOut ? Icons.check_circle : Icons.login,
                            color: hasCheckedOut ? Colors.grey : Colors.green,
                            size: 32,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Check-in: ${_todayAttendance!.checkInTime.hour}:${_todayAttendance!.checkInTime.minute.toString().padLeft(2, '0')}',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'Trạng thái: ${_todayAttendance!.statusDisplay}',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                  ),
                                ),
                                if (hasCheckedOut) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    'Check-out: ${_todayAttendance!.checkOutTime!.hour}:${_todayAttendance!.checkOutTime!.minute.toString().padLeft(2, '0')}',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    'Giờ làm việc: ${_todayAttendance!.workingHours?.toStringAsFixed(1)} giờ',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Action buttons
            if (!hasCheckedIn) ...[
              CustomButton(
                text: 'Check-in',
                onPressed: _handleCheckIn,
                icon: Icons.login,
                color: Colors.green,
              ),
            ] else if (!hasCheckedOut) ...[
              CustomButton(
                text: 'Check-out',
                onPressed: _handleCheckOut,
                icon: Icons.logout,
                color: Colors.orange,
              ),
            ] else ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.check_circle, color: Colors.green),
                    SizedBox(width: 8),
                    Text(
                      'Bạn đã hoàn thành chấm công hôm nay',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            // Register/Update face button (always visible)
            if (_hasFaceRegistered)
              CustomButton(
                text: 'Cập nhật khuôn mặt',
                onPressed: _navigateToRegisterFace,
                icon: Icons.refresh,
                isOutlined: true,
              ),
          ],
        ),
      ),
    );
  }
}