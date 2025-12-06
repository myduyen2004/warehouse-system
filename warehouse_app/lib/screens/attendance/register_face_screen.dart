import 'dart:io';
import 'package:flutter/material.dart';
import '../../services/attendance_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/custom_button.dart';
import 'face_capture_screen.dart';

class RegisterFaceScreen extends StatefulWidget {
  const RegisterFaceScreen({Key? key}) : super(key: key);

  @override
  State<RegisterFaceScreen> createState() => _RegisterFaceScreenState();
}

class _RegisterFaceScreenState extends State<RegisterFaceScreen> {
  final AttendanceService _attendanceService = AttendanceService();
  final AuthService _authService = AuthService();
  
  File? _capturedImage;
  bool _isLoading = false;
  String? _userId;

  @override
  void initState() {
    super.initState();
    _loadUserId();
  }

  Future<void> _loadUserId() async {
    _userId = await _authService.getUserId();
  }

  Future<void> _captureFace() async {
    final File? faceImage = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FaceCaptureScreen(
          title: 'Chụp khuôn mặt đăng ký',
          onImageCaptured: (file) {},
        ),
      ),
    );

    if (faceImage != null) {
      setState(() {
        _capturedImage = faceImage;
      });
    }
  }

  Future<void> _registerFace() async {
    if (_capturedImage == null || _userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chụp ảnh khuôn mặt')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final success = await _attendanceService.registerFace(
        userId: int.parse(_userId!),
        faceImage: _capturedImage!,
      );

      setState(() => _isLoading = false);

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đăng ký khuôn mặt thành công!'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true);
        }
      } else {
        throw Exception('Đăng ký thất bại');
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: $e'),
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
        title: const Text('Đăng ký khuôn mặt'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Instructions
            Card(
              color: Colors.blue[50],
              child: const Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.info, color: Colors.blue),
                        SizedBox(width: 8),
                        Text(
                          'Hướng dẫn',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Text('1. Đảm bảo khuôn mặt được chiếu sáng tốt'),
                    Text('2. Nhìn thẳng vào camera'),
                    Text('3. Không đeo kính đen hoặc khẩu trang'),
                    Text('4. Chỉ có một khuôn mặt trong khung hình'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Preview image
            if (_capturedImage != null) ...[
              Card(
                child: Column(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        'Ảnh đã chụp',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(
                        _capturedImage!,
                        height: 300,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Capture button
            CustomButton(
              text: _capturedImage == null 
                  ? 'Chụp ảnh khuôn mặt' 
                  : 'Chụp lại',
              onPressed: _captureFace,
              icon: Icons.camera_alt,
              isOutlined: _capturedImage != null,
            ),
            const SizedBox(height: 16),

            // Register button
            if (_capturedImage != null) ...[
              CustomButton(
                text: 'Đăng ký',
                onPressed: _registerFace,
                isLoading: _isLoading,
                icon: Icons.check,
                color: Colors.green,
              ),
            ],

            const SizedBox(height: 24),

            // Tips
            Card(
              color: Colors.orange[50],
              child: const Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.lightbulb, color: Colors.orange),
                        SizedBox(width: 8),
                        Text(
                          'Lưu ý',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.orange,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Bạn chỉ cần đăng ký khuôn mặt một lần. '
                      'Sau khi đăng ký thành công, bạn có thể sử dụng '
                      'tính năng chấm công bằng khuôn mặt.',
                      style: TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}