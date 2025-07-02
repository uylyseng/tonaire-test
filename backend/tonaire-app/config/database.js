const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // Disable encryption for local Docker
        trustServerCertificate: true, // Trust self-signed certificates
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;

const connectDB = async () => {
    try {
        pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully');
        
        // Create table if it doesn't exist
        await createProductTable();
        
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

const createProductTable = async () => {
    try {
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PRODUCTS' AND xtype='U')
            CREATE TABLE PRODUCTS (
                PRODUCTID INT PRIMARY KEY IDENTITY(1,1),
                PRODUCTNAME NVARCHAR(100) NOT NULL,
                PRICE DECIMAL(10, 2) NOT NULL,
                STOCK INT NOT NULL
            );
        `);
        console.log('Products table created or already exists');
    } catch (error) {
        console.error('Error creating products table:', error);
        throw error;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return pool;
};

const closeDB = async () => {
    if (pool) {
        await pool.close();
        console.log('Database connection closed');
    }
};

module.exports = {
    connectDB,
    getPool,
    closeDB,
    sql
};
