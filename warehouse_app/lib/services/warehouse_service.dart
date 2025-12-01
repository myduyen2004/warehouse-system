import '../models/warehouse.dart';
import 'api_service.dart';

class WarehouseService {
  final ApiService _apiService = ApiService();

  Future<List<Warehouse>> getAllWarehouses() async {
    try {
      final response = await _apiService.get('/warehouses');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Warehouse.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load warehouses');
      }
    } catch (e) {
      print('Error getting warehouses: $e');
      rethrow;
    }
  }

  Future<Warehouse> getWarehouseById(int id) async {
    try {
      final response = await _apiService.get('/warehouses/$id');
      
      if (response.statusCode == 200) {
        return Warehouse.fromJson(response.data);
      } else {
        throw Exception('Failed to load warehouse');
      }
    } catch (e) {
      print('Error getting warehouse: $e');
      rethrow;
    }
  }

  Future<Warehouse> createWarehouse(Warehouse warehouse) async {
    try {
      final response = await _apiService.post(
        '/warehouses',
        warehouse.toJson(),
      );
      
      if (response.statusCode == 201 || response.statusCode == 200) {
        return Warehouse.fromJson(response.data);
      } else {
        throw Exception('Failed to create warehouse');
      }
    } catch (e) {
      print('Error creating warehouse: $e');
      rethrow;
    }
  }

  Future<Warehouse> updateWarehouse(int id, Warehouse warehouse) async {
    try {
      final response = await _apiService.put(
        '/warehouses/$id',
        warehouse.toJson(),
      );
      
      if (response.statusCode == 200) {
        return Warehouse.fromJson(response.data);
      } else {
        throw Exception('Failed to update warehouse');
      }
    } catch (e) {
      print('Error updating warehouse: $e');
      rethrow;
    }
  }

  Future<void> deleteWarehouse(int id) async {
    try {
      final response = await _apiService.delete('/warehouses/$id');
      
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete warehouse');
      }
    } catch (e) {
      print('Error deleting warehouse: $e');
      rethrow;
    }
  }
}