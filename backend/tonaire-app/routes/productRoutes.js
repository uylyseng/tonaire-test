const express = require('express');
const ProductController = require('../controllers/productController');
const { 
    validateCreateProduct, 
    validateUpdateProduct, 
    validateProductId, 
    handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

// GET /products - Get all products
router.get('/', ProductController.getAllProducts);

// GET /products/:id - Get product by ID
router.get('/:id', validateProductId, handleValidationErrors, ProductController.getProductById);

// POST /products - Create a new product
router.post('/', validateCreateProduct, handleValidationErrors, ProductController.createProduct);

// PUT /products/:id - Update product by ID
router.put('/:id', validateUpdateProduct, handleValidationErrors, ProductController.updateProduct);

// DELETE /products/:id - Delete product by ID
router.delete('/:id', validateProductId, handleValidationErrors, ProductController.deleteProduct);

module.exports = router;
