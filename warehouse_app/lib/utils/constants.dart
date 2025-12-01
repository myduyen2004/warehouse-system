import 'package:flutter/material.dart';

class AppConstants {
  // API Constants
  static const String apiBaseUrl = 'http://10.0.2.2:8080/api';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String usernameKey = 'username';
  
  // App Info
  static const String appName = 'Warehouse Management';
  static const String appVersion = '1.0.0';
  
  // Colors
  static const Color primaryColor = Colors.blue;
  static const Color accentColor = Colors.blueAccent;
  static const Color errorColor = Colors.red;
  static const Color successColor = Colors.green;
  static const Color warningColor = Colors.orange;
  
  // Padding & Spacing
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  
  // Border Radius
  static const double defaultBorderRadius = 8.0;
  static const double largeBorderRadius = 12.0;
  
  // Font Sizes
  static const double titleFontSize = 24.0;
  static const double subtitleFontSize = 18.0;
  static const double bodyFontSize = 14.0;
  static const double captionFontSize = 12.0;
  
  // Icon Sizes
  static const double smallIconSize = 20.0;
  static const double defaultIconSize = 24.0;
  static const double largeIconSize = 32.0;
}

class AppStrings {
  // Auth
  static const String login = 'Đăng nhập';
  static const String logout = 'Đăng xuất';
  static const String register = 'Đăng ký';
  static const String username = 'Tên đăng nhập';
  static const String password = 'Mật khẩu';
  static const String email = 'Email';
  
  // Common
  static const String save = 'Lưu';
  static const String cancel = 'Hủy';
  static const String delete = 'Xóa';
  static const String edit = 'Sửa';
  static const String add = 'Thêm';
  static const String search = 'Tìm kiếm';
  static const String confirm = 'Xác nhận';
  static const String back = 'Quay lại';
  static const String loading = 'Đang tải...';
  static const String error = 'Lỗi';
  static const String success = 'Thành công';
  
  // Products
  static const String products = 'Sản phẩm';
  static const String productName = 'Tên sản phẩm';
  static const String productSku = 'Mã SKU';
  static const String productPrice = 'Giá';
  static const String productQuantity = 'Số lượng';
  static const String productCategory = 'Danh mục';
  static const String productDescription = 'Mô tả';
  
  // Warehouse
  static const String warehouses = 'Kho hàng';
  static const String warehouseName = 'Tên kho';
  static const String warehouseAddress = 'Địa chỉ';
  static const String warehouseCity = 'Thành phố';
  static const String warehouseCountry = 'Quốc gia';
  
  // Inventory
  static const String inventory = 'Tồn kho';
  static const String lowStock = 'Sắp hết hàng';
  static const String outOfStock = 'Hết hàng';
  static const String inStock = 'Còn hàng';
}