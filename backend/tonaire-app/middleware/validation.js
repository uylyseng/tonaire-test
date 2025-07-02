const { body, param, validationResult } = require('express-validator');

// Validation rules for creating a product
const validateCreateProduct = [
    body('productName')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Product name must be between 1 and 100 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    
    body('stock')
        .notEmpty()
        .withMessage('Stock is required')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

// Validation rules for updating a product
const validateUpdateProduct = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),
    
    body('productName')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Product name must be between 1 and 100 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    
    body('stock')
        .notEmpty()
        .withMessage('Stock is required')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

// Validation rule for product ID parameter
const validateProductId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
    handleValidationErrors
};
