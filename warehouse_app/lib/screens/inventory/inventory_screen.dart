import 'package:flutter/material.dart';
import '../../models/inventory.dart';
import '../../services/inventory_service.dart';
import '../../widgets/loading_indicator.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({Key? key}) : super(key: key);

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final InventoryService _inventoryService = InventoryService();
  List<Inventory> _inventory = [];
  bool _isLoading = false;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _loadInventory();
  }

  Future<void> _loadInventory() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final inventory = await _inventoryService.getAllInventory();
      setState(() {
        _inventory = inventory;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Lỗi khi tải tồn kho: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _adjustStock(Inventory item) async {
    final quantityController = TextEditingController();
    final reasonController = TextEditingController();

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Điều chỉnh tồn kho'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Sản phẩm ID: ${item.productId}'),
            Text('Số lượng hiện tại: ${item.quantity}'),
            const SizedBox(height: 16),
            TextField(
              controller: quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Số lượng thay đổi',
                hintText: 'Nhập số dương để tăng, số âm để giảm',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Lý do',
                hintText: 'Nhập lý do điều chỉnh',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              if (quantityController.text.isNotEmpty &&
                  reasonController.text.isNotEmpty) {
                Navigator.pop(context, true);
              }
            },
            child: const Text('Xác nhận'),
          ),
        ],
      ),
    );

    if (result == true) {
      try {
        await _inventoryService.adjustStock(
          item.id!,
          int.parse(quantityController.text),
          reasonController.text,
        );
        _loadInventory();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Đã điều chỉnh tồn kho')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Lỗi: $e')),
          );
        }
      }
    }

    quantityController.dispose();
    reasonController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const LoadingIndicator(message: 'Đang tải tồn kho...');
    }

    if (_errorMessage.isNotEmpty) {
      return ErrorView(
        message: _errorMessage,
        onRetry: _loadInventory,
      );
    }

    if (_inventory.isEmpty) {
      return const EmptyState(
        message: 'Chưa có tồn kho nào',
        icon: Icons.inventory,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadInventory,
      child: ListView.builder(
        itemCount: _inventory.length,
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) {
          final item = _inventory[index];
          final isLowStock = item.isLowStock;
          
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isLowStock ? Colors.orange : Colors.green,
                child: Icon(
                  isLowStock ? Icons.warning : Icons.check,
                  color: Colors.white,
                ),
              ),
              title: Text('Sản phẩm ID: ${item.productId}'),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Kho ID: ${item.warehouseId}'),
                  Text('Số lượng: ${item.quantity}'),
                  if (item.minQuantity != null)
                    Text('Tối thiểu: ${item.minQuantity}'),
                  if (item.location != null)
                    Text('Vị trí: ${item.location}'),
                  if (isLowStock)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.orange,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Sắp hết hàng',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              trailing: IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => _adjustStock(item),
              ),
            ),
          );
        },
      ),
    );
  }
}