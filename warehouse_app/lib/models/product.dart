class Product {
  final int? id;
  final String name;
  final String? description;
  final String? sku;
  final double price;
  final int quantity;
  final String? category;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Product({
    this.id,
    required this.name,
    this.description,
    this.sku,
    required this.price,
    required this.quantity,
    this.category,
    this.createdAt,
    this.updatedAt,
  });

  // Convert JSON từ API thành Product object
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      sku: json['sku'],
      price: (json['price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      category: json['category'],
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : null,
    );
  }

  // Convert Product object thành JSON để gửi lên API
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'sku': sku,
      'price': price,
      'quantity': quantity,
      'category': category,
    };
  }

  // Copy với một số field thay đổi
  Product copyWith({
    int? id,
    String? name,
    String? description,
    String? sku,
    double? price,
    int? quantity,
    String? category,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      sku: sku ?? this.sku,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
      category: category ?? this.category,
    );
  }
}