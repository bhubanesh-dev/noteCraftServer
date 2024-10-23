const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

// Load environment variables
dotenv.config();

// Database connection
require('./dbconn');

// Middleware
app.use(express.json());
app.use(cors());

// Route Handlers
app.use(require('./router/auth'));
app.use(require('./router/notes'));

// Simple test route
app.get('/register', (req, res) => {
    res.send(`Hello register from the server`);
});

// Define Port and Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
