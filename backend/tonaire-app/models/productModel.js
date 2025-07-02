const { getPool, sql } = require('../config/database');

class ProductModel {
    // Get all products
    static async getAllProducts() {
        try {
            const pool = getPool();
            const result = await pool.request().query('SELECT * FROM PRODUCTS ORDER BY PRODUCTID');
            return result.recordset;
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // Get product by ID
    static async getProductById(id) {
        try {
            const pool = getPool();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM PRODUCTS WHERE PRODUCTID = @id');
            
            return result.recordset[0] || null;
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    // Create new product
    static async createProduct(productData) {
        try {
            const { productName, price, stock } = productData;
            const pool = getPool();
            
            const result = await pool.request()
                .input('productName', sql.NVarChar, productName)
                .input('price', sql.Decimal(10, 2), price)
                .input('stock', sql.Int, stock)
                .query(`
                    INSERT INTO PRODUCTS (PRODUCTNAME, PRICE, STOCK) 
                    OUTPUT INSERTED.* 
                    VALUES (@productName, @price, @stock)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    // Update product by ID
    static async updateProduct(id, productData) {
        try {
            const { productName, price, stock } = productData;
            const pool = getPool();
            
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('productName', sql.NVarChar, productName)
                .input('price', sql.Decimal(10, 2), price)
                .input('stock', sql.Int, stock)
                .query(`
                    UPDATE PRODUCTS 
                    SET PRODUCTNAME = @productName, PRICE = @price, STOCK = @stock 
                    OUTPUT INSERTED.*
                    WHERE PRODUCTID = @id
                `);
            
            return result.recordset[0] || null;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    // Delete product by ID
    static async deleteProduct(id) {
        try {
            const pool = getPool();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM PRODUCTS WHERE PRODUCTID = @id');
            
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}

module.exports = ProductModel;
