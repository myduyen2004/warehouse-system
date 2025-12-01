import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<User> login(String username, String password) async {
    try {
      final response = await _apiService.post('/auth/login', {
        'username': username,
        'password': password,
      });

      if (response.statusCode == 200) {
        final user = User.fromJson(response.data);
        
        // Lưu token vào local storage
        if (user.token != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', user.token!);
          await prefs.setString('user_id', user.id.toString());
          await prefs.setString('username', user.username);
        }
        
        return user;
      } else {
        throw Exception('Login failed');
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  Future<User> register(String username, String email, String password) async {
    try {
      final response = await _apiService.post('/auth/register', {
        'username': username,
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        return User.fromJson(response.data);
      } else {
        throw Exception('Registration failed');
      }
    } catch (e) {
      print('Registration error: $e');
      rethrow;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_id');
    await prefs.remove('username');
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    return token != null && token.isNotEmpty;
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_id');
  }
}