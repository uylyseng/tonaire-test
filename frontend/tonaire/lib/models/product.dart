class Product {
  final int? id;
  final String name;
  final double price;
  final int stock;

  Product({
    this.id,
    required this.name,
    required this.price,
    required this.stock,
  });

  Product copyWith({
    int? id,
    String? name,
    double? price,
    int? stock,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      price: price ?? this.price,
      stock: stock ?? this.stock,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': id,
      'productName': name,
      'price': price,
      'stock': stock,
    };
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['PRODUCTID'] as int?,
      name: json['PRODUCTNAME'] as String,
      price: (json['PRICE'] as num).toDouble(),
      stock: json['STOCK'] as int,
    );
  }
}
