import 'package:flutter/material.dart';
import '../../models/warehouse.dart';
import '../../services/warehouse_service.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class WarehouseFormScreen extends StatefulWidget {
  final Warehouse? warehouse;

  const WarehouseFormScreen({
    Key? key,
    this.warehouse,
  }) : super(key: key);

  @override
  State<WarehouseFormScreen> createState() => _WarehouseFormScreenState();
}

class _WarehouseFormScreenState extends State<WarehouseFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _warehouseService = WarehouseService();

  late TextEditingController _nameController;
  late TextEditingController _addressController;
  late TextEditingController _cityController;
  late TextEditingController _countryController;
  late TextEditingController _capacityController;

  bool _isLoading = false;
  bool get _isEdit => widget.warehouse != null;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.warehouse?.name);
    _addressController = TextEditingController(text: widget.warehouse?.address);
    _cityController = TextEditingController(text: widget.warehouse?.city);
    _countryController = TextEditingController(text: widget.warehouse?.country);
    _capacityController = TextEditingController(
      text: widget.warehouse?.capacity?.toString(),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _countryController.dispose();
    _capacityController.dispose();
    super.dispose();
  }

  Future<void> _saveWarehouse() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      final warehouse = Warehouse(
        id: widget.warehouse?.id,
        name: _nameController.text,
        address: _addressController.text.isEmpty ? null : _addressController.text,
        city: _cityController.text.isEmpty ? null : _cityController.text,
        country: _countryController.text.isEmpty ? null : _countryController.text,
        capacity: _capacityController.text.isEmpty 
            ? null 
            : double.parse(_capacityController.text),
      );

      if (_isEdit) {
        await _warehouseService.updateWarehouse(widget.warehouse!.id!, warehouse);
      } else {
        await _warehouseService.createWarehouse(warehouse);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isEdit ? 'Đã cập nhật kho' : 'Đã tạo kho mới'),
          ),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEdit ? 'Sửa kho' : 'Thêm kho mới'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _nameController,
                label: 'Tên kho *',
                hint: 'Nhập tên kho',
                prefixIcon: const Icon(Icons.warehouse),
                validator: (value) => Validators.validateRequired(value, 'Tên kho'),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _addressController,
                label: 'Địa chỉ',
                hint: 'Nhập địa chỉ',
                prefixIcon: const Icon(Icons.location_on),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _cityController,
                label: 'Thành phố',
                hint: 'Nhập thành phố',
                prefixIcon: const Icon(Icons.location_city),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _countryController,
                label: 'Quốc gia',
                hint: 'Nhập quốc gia',
                prefixIcon: const Icon(Icons.flag),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _capacityController,
                label: 'Sức chứa (m²)',
                hint: 'Nhập sức chứa',
                keyboardType: TextInputType.number,
                prefixIcon: const Icon(Icons.square_foot),
                validator: (value) {
                  if (value != null && value.isNotEmpty) {
                    return Validators.validatePositiveNumber(value);
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: _isEdit ? 'Cập nhật' : 'Thêm mới',
                onPressed: _saveWarehouse,
                isLoading: _isLoading,
                icon: _isEdit ? Icons.save : Icons.add,
              ),
              const SizedBox(height: 8),
              CustomButton(
                text: 'Hủy',
                onPressed: () => Navigator.pop(context),
                isOutlined: true,
              ),
            ],
          ),
        ),
      ),
    );
  }
}