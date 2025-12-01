class Warehouse {
  final int? id;
  final String name;
  final String? address;
  final String? city;
  final String? country;
  final double? capacity;
  final String? managerId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Warehouse({
    this.id,
    required this.name,
    this.address,
    this.city,
    this.country,
    this.capacity,
    this.managerId,
    this.createdAt,
    this.updatedAt,
  });

  factory Warehouse.fromJson(Map<String, dynamic> json) {
    return Warehouse(
      id: json['id'],
      name: json['name'],
      address: json['address'],
      city: json['city'],
      country: json['country'],
      capacity: json['capacity']?.toDouble(),
      managerId: json['managerId'],
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
      'name': name,
      'address': address,
      'city': city,
      'country': country,
      'capacity': capacity,
      'managerId': managerId,
    };
  }

  Warehouse copyWith({
    int? id,
    String? name,
    String? address,
    String? city,
    String? country,
    double? capacity,
    String? managerId,
  }) {
    return Warehouse(
      id: id ?? this.id,
      name: name ?? this.name,
      address: address ?? this.address,
      city: city ?? this.city,
      country: country ?? this.country,
      capacity: capacity ?? this.capacity,
      managerId: managerId ?? this.managerId,
    );
  }
}