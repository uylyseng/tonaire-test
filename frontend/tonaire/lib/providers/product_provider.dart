import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../models/product.dart';

class ProductProvider with ChangeNotifier {
  List<Product> _products = [];
  List<Product> _filteredProducts = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';
  Timer? _debounceTimer;

  List<Product> get products => _filteredProducts.isEmpty && _searchQuery.isEmpty ? _products : _filteredProducts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;

  // Real API base URL - using local backend
  static const String _baseUrl = 'http://localhost:3000/api/products';

  // Fetch all products
  Future<void> fetchProducts() async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await http.get(Uri.parse(_baseUrl));
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          final List<dynamic> productsData = responseData['data'];
          _products = productsData.map((json) => Product.fromJson(json)).toList();
        } else {
          _error = responseData['message'] ?? 'Failed to load products';
        }
      } else {
        _error = 'Failed to load products. Status code: ${response.statusCode}';
      }
    } catch (e) {
      _error = 'Error: $e';
    } finally {
      _setLoading(false);
    }
  }

  // Add new product
  Future<void> addProduct(Product product) async {
    _setLoading(true);
    _error = null;

    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(product.toJson()),
      );

      final Map<String, dynamic> responseData = json.decode(response.body);

      if (response.statusCode == 201 && responseData['success'] == true) {
        final newProduct = Product.fromJson(responseData['data']);
        _products.add(newProduct);
        notifyListeners();
      } else {
        _error = responseData['message'] ?? 'Failed to add product';
      }
    } catch (e) {
      _error = 'Error: $e';
    } finally {
      _setLoading(false);
    }
  }

  // Update existing product
  Future<void> updateProduct(Product product) async {
    _setLoading(true);
    _error = null;

    try {
      final response = await http.put(
        Uri.parse('$_baseUrl/${product.id}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(product.toJson()),
      );

      final Map<String, dynamic> responseData = json.decode(response.body);

      if (response.statusCode == 200 && responseData['success'] == true) {
        final updatedProduct = Product.fromJson(responseData['data']);
        final index = _products.indexWhere((p) => p.id == updatedProduct.id);
        if (index != -1) {
          _products[index] = updatedProduct;
          notifyListeners();
        }
      } else {
        _error = responseData['message'] ?? 'Failed to update product';
      }
    } catch (e) {
      _error = 'Error: $e';
    } finally {
      _setLoading(false);
    }
  }

  // Delete product
  Future<void> deleteProduct(int id) async {
    _setLoading(true);
    _error = null;

    try {
      final response = await http.delete(Uri.parse('$_baseUrl/$id'));
      final Map<String, dynamic> responseData = json.decode(response.body);

      if (response.statusCode == 200 && responseData['success'] == true) {
        _products.removeWhere((product) => product.id == id);
        notifyListeners();
      } else {
        _error = responseData['message'] ?? 'Failed to delete product';
      }
    } catch (e) {
      _error = 'Error: $e';
    } finally {
      _setLoading(false);
    }
  }

  // Debounced search functionality
  void searchProducts(String query) {
    _searchQuery = query;
    
    // Cancel previous timer
    _debounceTimer?.cancel();
    
    // Create new timer with 500ms delay
    _debounceTimer = Timer(const Duration(milliseconds: 500), () {
      _performSearch(query);
    });
  }

  void _performSearch(String query) {
    if (query.isEmpty) {
      _filteredProducts = [];
    } else {
      _filteredProducts = _products
          .where((product) => 
              product.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    }
    notifyListeners();
  }

  // Sort products by different criteria
  void sortProducts(String criteria) {
    List<Product> productsToSort = List.from(products);
    
    switch (criteria) {
      case 'name':
        productsToSort.sort((a, b) => a.name.compareTo(b.name));
        break;
      case 'price_low':
        productsToSort.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'price_high':
        productsToSort.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'stock':
        productsToSort.sort((a, b) => b.stock.compareTo(a.stock));
        break;
    }
    
    if (_searchQuery.isEmpty) {
      _products = productsToSort;
    } else {
      _filteredProducts = productsToSort;
    }
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    super.dispose();
  }
}
