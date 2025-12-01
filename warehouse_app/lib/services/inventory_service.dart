import '../models/inventory.dart';
import 'api_service.dart';

class InventoryService {
  final ApiService _apiService = ApiService();

  Future<List<Inventory>> getAllInventory() async {
    try {
      final response = await _apiService.get('/inventory');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Inventory.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load inventory');
      }
    } catch (e) {
      print('Error getting inventory: $e');
      rethrow;
    }
  }

  Future<List<Inventory>> getInventoryByWarehouse(int warehouseId) async {
    try {
      final response = await _apiService.get('/inventory/warehouse/$warehouseId');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => Inventory.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load inventory');
      }
    } catch (e) {
      print('Error getting inventory: $e');
      rethrow;
    }
  }

  Future<Inventory> getInventoryById(int id) async {
    try {
      final response = await _apiService.get('/inventory/$id');
      
      if (response.statusCode == 200) {
        return Inventory.fromJson(response.data);
      } else {
        throw Exception('Failed to load inventory');
      }
    } catch (e) {
      print('Error getting inventory: $e');
      rethrow;
    }
  }

  Future<Inventory> createInventory(Inventory inventory) async {
    try {
      final response = await _apiService.post(
        '/inventory',
        inventory.toJson(),
      );
      
      if (response.statusCode == 201 || response.statusCode == 200) {
        return Inventory.fromJson(response.data);
      } else {
        throw Exception('Failed to create inventory');
      }
    } catch (e) {
      print('Error creating inventory: $e');
      rethrow;
    }
  }

  Future<Inventory> updateInventory(int id, Inventory inventory) async {
    try {
      final response = await _apiService.put(
        '/inventory/$id',
        inventory.toJson(),
      );
      
      if (response.statusCode == 200) {
        return Inventory.fromJson(response.data);
      } else {
        throw Exception('Failed to update inventory');
      }
    } catch (e) {
      print('Error updating inventory: $e');
      rethrow;
    }
  }

  Future<void> deleteInventory(int id) async {
    try {
      final response = await _apiService.delete('/inventory/$id');
      
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete inventory');
      }
    } catch (e) {
      print('Error deleting inventory: $e');
      rethrow;
    }
  }

  Future<void> adjustStock(int inventoryId, int quantity, String reason) async {
    try {
      final response = await _apiService.post('/inventory/$inventoryId/adjust', {
        'quantity': quantity,
        'reason': reason,
      });
      
      if (response.statusCode != 200) {
        throw Exception('Failed to adjust stock');
      }
    } catch (e) {
      print('Error adjusting stock: $e');
      rethrow;
    }
  }
}