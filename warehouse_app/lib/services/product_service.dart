import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../models/product.dart';

class ProductService {
  final ApiService _apiService = ApiService();

  /// Lấy danh sách tất cả sản phẩm
  Future<List<Product>> getAllProducts() async {
    try {
      final response = await _apiService.get('/products'); // endpoint Spring Boot
      final data = response.data as List;
      return data.map((json) => Product.fromJson(json)).toList();
    } on DioError catch (e) {
      throw Exception('Lỗi khi tải danh sách sản phẩm: ${e.message}');
    }
  }

  /// Lấy chi tiết 1 sản phẩm theo id
  Future<Product> getProductById(int id) async {
    try {
      final response = await _apiService.get('/products/$id');
      return Product.fromJson(response.data);
    } on DioError catch (e) {
      throw Exception('Lỗi khi lấy chi tiết sản phẩm: ${e.message}');
    }
  }

  /// Tạo sản phẩm mới
  Future<void> createProduct(Product product) async {
    try {
      await _apiService.post('/products', product.toJson());
    } on DioError catch (e) {
      throw Exception('Lỗi khi tạo sản phẩm: ${e.message}');
    }
  }

  /// Cập nhật sản phẩm
  Future<void> updateProduct(int id, Product product) async {
    try {
      await _apiService.put('/products/$id', product.toJson());
    } on DioError catch (e) {
      throw Exception('Lỗi khi cập nhật sản phẩm: ${e.message}');
    }
  }

  /// Xóa sản phẩm
  Future<void> deleteProduct(int id) async {
    try {
      await _apiService.delete('/products/$id');
    } on DioError catch (e) {
      throw Exception('Lỗi khi xóa sản phẩm: ${e.message}');
    }
  }
}
