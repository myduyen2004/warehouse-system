class Attendance {
  final int? id;
  final int userId;
  final String username;
  final String? fullName;
  final DateTime checkInTime;
  final DateTime? checkOutTime;
  final String status;
  final String? checkInPhotoUrl;
  final String? checkOutPhotoUrl;
  final String? checkInLocation;
  final String? checkOutLocation;
  final double? workingHours;
  final double? faceRecognitionConfidence;
  final bool isVerified;
  final String? notes;

  Attendance({
    this.id,
    required this.userId,
    required this.username,
    this.fullName,
    required this.checkInTime,
    this.checkOutTime,
    required this.status,
    this.checkInPhotoUrl,
    this.checkOutPhotoUrl,
    this.checkInLocation,
    this.checkOutLocation,
    this.workingHours,
    this.faceRecognitionConfidence,
    required this.isVerified,
    this.notes,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'],
      userId: json['userId'],
      username: json['username'],
      fullName: json['fullName'],
      checkInTime: DateTime.parse(json['checkInTime']),
      checkOutTime: json['checkOutTime'] != null 
          ? DateTime.parse(json['checkOutTime']) 
          : null,
      status: json['status'],
      checkInPhotoUrl: json['checkInPhotoUrl'],
      checkOutPhotoUrl: json['checkOutPhotoUrl'],
      checkInLocation: json['checkInLocation'],
      checkOutLocation: json['checkOutLocation'],
      workingHours: json['workingHours']?.toDouble(),
      faceRecognitionConfidence: json['faceRecognitionConfidence']?.toDouble(),
      isVerified: json['isVerified'] ?? true,
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'username': username,
      'fullName': fullName,
      'checkInTime': checkInTime.toIso8601String(),
      'checkOutTime': checkOutTime?.toIso8601String(),
      'status': status,
      'checkInPhotoUrl': checkInPhotoUrl,
      'checkOutPhotoUrl': checkOutPhotoUrl,
      'checkInLocation': checkInLocation,
      'checkOutLocation': checkOutLocation,
      'workingHours': workingHours,
      'faceRecognitionConfidence': faceRecognitionConfidence,
      'isVerified': isVerified,
      'notes': notes,
    };
  }

  bool get hasCheckedOut => checkOutTime != null;

  String get statusDisplay {
    switch (status) {
      case 'ON_TIME':
        return 'Đúng giờ';
      case 'LATE':
        return 'Muộn';
      case 'EARLY_LEAVE':
        return 'Về sớm';
      case 'ABSENT':
        return 'Vắng';
      default:
        return status;
    }
  }
}