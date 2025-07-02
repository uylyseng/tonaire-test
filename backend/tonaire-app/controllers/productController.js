const ProductModel = require('../models/productModel');

class ProductController {
    // GET /products - Get all products
    static async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAllProducts();
            res.status(200).json({
                success: true,
                message: 'Products retrieved successfully',
                data: products
            });
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // GET /products/:id - Get product by ID
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductModel.getProductById(parseInt(id));
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product retrieved successfully',
                data: product
            });
        } catch (error) {
            console.error('Error in getProductById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // POST /products - Create a new product
    static async createProduct(req, res) {
        try {
            const { productName, price, stock } = req.body;
            const productData = {
                productName,
                price: parseFloat(price),
                stock: parseInt(stock)
            };

            const newProduct = await ProductModel.createProduct(productData);
            
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            console.error('Error in createProduct:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // PUT /products/:id - Update product by ID
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { productName, price, stock } = req.body;
            
            const productData = {
                productName,
                price: parseFloat(price),
                stock: parseInt(stock)
            };

            const updatedProduct = await ProductModel.updateProduct(parseInt(id), productData);
            
            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            console.error('Error in updateProduct:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // DELETE /products/:id - Delete product by ID
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProductModel.deleteProduct(parseInt(id));
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = ProductController;
