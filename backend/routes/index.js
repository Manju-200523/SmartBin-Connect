// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const sensorRoutes = require('./routes/sensorRoutes');
const cors = require('cors');


// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', sensorRoutes);



// MySQL connection setup using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

// Default route
app.get('/', (req, res) => {
  res.send('Smart Bin Backend is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = db;