class User {
  final int? id;
  final String username;
  final String email;
  final String? fullName;
  final String? role;
  final String? token;
  final DateTime? createdAt;

  User({
    this.id,
    required this.username,
    required this.email,
    this.fullName,
    this.role,
    this.token,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      fullName: json['fullName'],
      role: json['role'],
      token: json['token'],
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'fullName': fullName,
      'role': role,
      'token': token,
    };
  }

  bool get isAdmin => role?.toLowerCase() == 'admin';
  bool get isManager => role?.toLowerCase() == 'manager';
}