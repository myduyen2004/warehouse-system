class Inventory {
  final int? id;
  final int productId;
  final int warehouseId;
  final int quantity;
  final int? minQuantity;
  final int? maxQuantity;
  final String? location;
  final DateTime? lastRestocked;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Inventory({
    this.id,
    required this.productId,
    required this.warehouseId,
    required this.quantity,
    this.minQuantity,
    this.maxQuantity,
    this.location,
    this.lastRestocked,
    this.createdAt,
    this.updatedAt,
  });

  factory Inventory.fromJson(Map<String, dynamic> json) {
    return Inventory(
      id: json['id'],
      productId: json['productId'],
      warehouseId: json['warehouseId'],
      quantity: json['quantity'] ?? 0,
      minQuantity: json['minQuantity'],
      maxQuantity: json['maxQuantity'],
      location: json['location'],
      lastRestocked: json['lastRestocked'] != null 
          ? DateTime.parse(json['lastRestocked']) 
          : null,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'warehouseId': warehouseId,
      'quantity': quantity,
      'minQuantity': minQuantity,
      'maxQuantity': maxQuantity,
      'location': location,
      'lastRestocked': lastRestocked?.toIso8601String(),
    };
  }

  Inventory copyWith({
    int? id,
    int? productId,
    int? warehouseId,
    int? quantity,
    int? minQuantity,
    int? maxQuantity,
    String? location,
    DateTime? lastRestocked,
  }) {
    return Inventory(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      warehouseId: warehouseId ?? this.warehouseId,
      quantity: quantity ?? this.quantity,
      minQuantity: minQuantity ?? this.minQuantity,
      maxQuantity: maxQuantity ?? this.maxQuantity,
      location: location ?? this.location,
      lastRestocked: lastRestocked ?? this.lastRestocked,
    );
  }

  bool get isLowStock {
    if (minQuantity != null) {
      return quantity <= minQuantity!;
    }
    return false;
  }
}