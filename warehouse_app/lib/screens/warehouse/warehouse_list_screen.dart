import 'package:flutter/material.dart';
import '../../models/warehouse.dart';
import '../../services/warehouse_service.dart';
import '../../widgets/loading_indicator.dart';
import 'warehouse_form_screen.dart';

class WarehouseListScreen extends StatefulWidget {
  const WarehouseListScreen({Key? key}) : super(key: key);

  @override
  State<WarehouseListScreen> createState() => _WarehouseListScreenState();
}

class _WarehouseListScreenState extends State<WarehouseListScreen> {
  final WarehouseService _warehouseService = WarehouseService();
  List<Warehouse> _warehouses = [];
  bool _isLoading = false;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _loadWarehouses();
  }

  Future<void> _loadWarehouses() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final warehouses = await _warehouseService.getAllWarehouses();
      setState(() {
        _warehouses = warehouses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Lỗi khi tải danh sách kho: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteWarehouse(int id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: const Text('Bạn có chắc muốn xóa kho này?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _warehouseService.deleteWarehouse(id);
        _loadWarehouses();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Đã xóa kho')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Lỗi khi xóa: $e')),
          );
        }
      }
    }
  }

  Future<void> _navigateToForm({Warehouse? warehouse}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => WarehouseFormScreen(warehouse: warehouse),
      ),
    );

    if (result == true) {
      _loadWarehouses();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToForm(),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const LoadingIndicator(message: 'Đang tải danh sách kho...');
    }

    if (_errorMessage.isNotEmpty) {
      return ErrorView(
        message: _errorMessage,
        onRetry: _loadWarehouses,
      );
    }

    if (_warehouses.isEmpty) {
      return const EmptyState(
        message: 'Chưa có kho nào',
        icon: Icons.warehouse,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadWarehouses,
      child: ListView.builder(
        itemCount: _warehouses.length,
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final warehouse = _warehouses[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: Colors.blue,
                child: Icon(Icons.warehouse, color: Colors.white),
              ),
              title: Text(
                warehouse.name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (warehouse.address != null)
                    Text('Địa chỉ: ${warehouse.address}'),
                  if (warehouse.city != null)
                    Text('Thành phố: ${warehouse.city}'),
                  if (warehouse.capacity != null)
                    Text('Sức chứa: ${warehouse.capacity} m²'),
                ],
              ),
              trailing: PopupMenuButton(
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit, size: 20),
                        SizedBox(width: 8),
                        Text('Sửa'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete, size: 20, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Xóa', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
                onSelected: (value) {
                  if (value == 'edit') {
                    _navigateToForm(warehouse: warehouse);
                  } else if (value == 'delete') {
                    _deleteWarehouse(warehouse.id!);
                  }
                },
              ),
            ),
          );
        },
      ),
    );
  }
}