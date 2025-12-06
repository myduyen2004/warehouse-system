import 'package:dio/dio.dart';
import '../models/product.dart';
import 'api_service.dart';

class ProductService {
  final ApiService _apiService = ApiService();

  // Lấy danh sách tất cả products
  Future<List<Product>> getAllProducts() async {
    try {
      final response = await _apiService.get('/products');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      print('Error getting products: $e');
      rethrow;
    }
  }

  // Lấy chi tiết một product
  Future<Product> getProductById(int id) async {
    try {
      final response = await _apiService.get('/products/$id');
      
      if (response.statusCode == 200) {
        return Product.fromJson(response.data);
      } else {
        throw Exception('Failed to load product');
      }
    } catch (e) {
      print('Error getting product: $e');
      rethrow;
    }
  }

  // Tạo product mới
  Future<Product> createProduct(Product product) async {
    try {
      final response = await _apiService.post(
        '/products',
        product.toJson(),
      );
      
      if (response.statusCode == 201 || response.statusCode == 200) {
        return Product.fromJson(response.data);
      } else {
        throw Exception('Failed to create product');
      }
    } catch (e) {
      print('Error creating product: $e');
      rethrow;
    }
  }

  // Cập nhật product
  Future<Product> updateProduct(int id, Product product) async {
    try {
      final response = await _apiService.put(
        '/products/$id',
        product.toJson(),
      );
      
      if (response.statusCode == 200) {
        return Product.fromJson(response.data);
      } else {
        throw Exception('Failed to update product');
      }
    } catch (e) {
      print('Error updating product: $e');
      rethrow;
    }
  }

  // Xóa product
  Future<void> deleteProduct(int id) async {
    try {
      final response = await _apiService.delete('/products/$id');
      
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete product');
      }
    } catch (e) {
      print('Error deleting product: $e');
      rethrow;
    }
  }

  // Tìm kiếm products theo từ khóa
  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await _apiService.get('/products/search?q=$query');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to search products');
      }
    } catch (e) {
      print('Error searching products: $e');
      rethrow;
    }
  }

  // Lấy products theo category
  Future<List<Product>> getProductsByCategory(String category) async {
    try {
      final response = await _apiService.get('/products/category/$category');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products by category');
      }
    } catch (e) {
      print('Error getting products by category: $e');
      rethrow;
    }
  }

  // Lấy products có số lượng thấp (low stock)
  Future<List<Product>> getLowStockProducts({int threshold = 10}) async {
    try {
      final response = await _apiService.get('/products/low-stock?threshold=$threshold');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load low stock products');
      }
    } catch (e) {
      print('Error getting low stock products: $e');
      rethrow;
    }
  }
}