import 'package:flutter/material.dart';
import '../../models/product.dart';
import '../../services/product_service.dart';
import '../../utils/validators.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class ProductFormScreen extends StatefulWidget {
  final Product? product;

  const ProductFormScreen({
    Key? key,
    this.product,
  }) : super(key: key);

  @override
  State<ProductFormScreen> createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _productService = ProductService();

  late TextEditingController _nameController;
  late TextEditingController _skuController;
  late TextEditingController _priceController;
  late TextEditingController _quantityController;
  late TextEditingController _categoryController;
  late TextEditingController _descriptionController;

  bool _isLoading = false;
  bool get _isEdit => widget.product != null;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product?.name);
    _skuController = TextEditingController(text: widget.product?.sku);
    _priceController = TextEditingController(
      text: widget.product?.price.toString(),
    );
    _quantityController = TextEditingController(
      text: widget.product?.quantity.toString(),
    );
    _categoryController = TextEditingController(text: widget.product?.category);
    _descriptionController = TextEditingController(
      text: widget.product?.description,
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _skuController.dispose();
    _priceController.dispose();
    _quantityController.dispose();
    _categoryController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      final product = Product(
        id: widget.product?.id,
        name: _nameController.text,
        sku: _skuController.text.isEmpty ? null : _skuController.text,
        price: double.parse(_priceController.text),
        quantity: int.parse(_quantityController.text),
        category: _categoryController.text.isEmpty ? null : _categoryController.text,
        description: _descriptionController.text.isEmpty 
            ? null 
            : _descriptionController.text,
      );

      if (_isEdit) {
        await _productService.updateProduct(widget.product!.id!, product);
      } else {
        await _productService.createProduct(product);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isEdit ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm mới'),
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
        title: Text(_isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'),
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
                label: 'Tên sản phẩm *',
                hint: 'Nhập tên sản phẩm',
                prefixIcon: const Icon(Icons.inventory_2),
                validator: (value) => Validators.validateRequired(value, 'Tên sản phẩm'),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _skuController,
                label: 'Mã SKU',
                hint: 'Nhập mã SKU',
                prefixIcon: const Icon(Icons.qr_code),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _priceController,
                label: 'Giá *',
                hint: 'Nhập giá sản phẩm',
                keyboardType: TextInputType.number,
                prefixIcon: const Icon(Icons.attach_money),
                validator: Validators.validatePositiveNumber,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _quantityController,
                label: 'Số lượng *',
                hint: 'Nhập số lượng',
                keyboardType: TextInputType.number,
                prefixIcon: const Icon(Icons.numbers),
                validator: Validators.validatePositiveInteger,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _categoryController,
                label: 'Danh mục',
                hint: 'Nhập danh mục',
                prefixIcon: const Icon(Icons.category),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _descriptionController,
                label: 'Mô tả',
                hint: 'Nhập mô tả sản phẩm',
                maxLines: 4,
                prefixIcon: const Icon(Icons.description),
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: _isEdit ? 'Cập nhật' : 'Thêm mới',
                onPressed: _saveProduct,
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