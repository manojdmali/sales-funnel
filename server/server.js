const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/db.config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large Excel payloads

// Database Connection Logic
const connectDB = async () => {
    try {
        if (dbConfig.DB_TYPE === 'mongodb') {
            // MongoDB Connection
            // const mongoose = require('mongoose');
            // await mongoose.connect(dbConfig.MONGODB.URI, dbConfig.MONGODB.OPTIONS);
            console.log('MongoDB Connected Successfully (Mock)');
        } else if (dbConfig.DB_TYPE === 'mysql') {
            // MySQL Connection
            // const mysql = require('mysql2/promise');
            // const connection = await mysql.createConnection(dbConfig.MYSQL);
            console.log('MySQL Connected Successfully (Mock)');
        }
    } catch (error) {
        console.error('Database Connection Failed:', error);
        process.exit(1);
    }
};

// Initialize DB
connectDB();

// Routes
app.get('/api/datasets', (req, res) => {
    // Logic to fetch datasets from DB
    res.json([]);
});

app.post('/api/datasets/save', (req, res) => {
    // Logic to save datasets to DB
    console.log('Received datasets to save');
    res.json({ message: 'Saved successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
