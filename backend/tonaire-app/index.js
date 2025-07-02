const express = require('express');
const cors = require('cors');
const { connectDB, closeDB } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Tonaire API is running',
        version: '1.0.0',
        endpoints: {
            'GET /api/products': 'Get all products',
            'GET /api/products/:id': 'Get product by ID',
            'POST /api/products': 'Create a new product',
            'PUT /api/products/:id': 'Update product by ID',
            'DELETE /api/products/:id': 'Delete product by ID'
        }
    });
});

// 404 handler - match all routes that haven't been handled yet
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API Documentation available at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM. Graceful shutdown...');
    await closeDB();
    process.exit(0);
});

startServer();
