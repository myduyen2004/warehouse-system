import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  
  late Dio _dio;
  
  // Thay đổi URL này thành URL Spring Boot backend của bạn
  static const String baseUrl = 'http://192.168.1.10:8080/api';
  // Nếu chạy trên Android emulator: http://10.0.2.2:8080/api
  // Nếu chạy trên thiết bị thật: http://192.168.x.x:8080/api
  
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    // Interceptor để thêm token vào mỗi request
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        print('API Error: ${error.message}');
        return handler.next(error);
      },
    ));
  }
  
  // GET request
  Future<Response> get(String endpoint) async {
    try {
      return await _dio.get(endpoint);
    } catch (e) {
      rethrow;
    }
  }
  
  // POST request
  Future<Response> post(String endpoint, dynamic data) async {
    try {
      return await _dio.post(endpoint, data: data);
    } catch (e) {
      rethrow;
    }
  }
  
  // PUT request
  Future<Response> put(String endpoint, dynamic data) async {
    try {
      return await _dio.put(endpoint, data: data);
    } catch (e) {
      rethrow;
    }
  }
  
  // DELETE request
  Future<Response> delete(String endpoint) async {
    try {
      return await _dio.delete(endpoint);
    } catch (e) {
      rethrow;
    }
  }
}