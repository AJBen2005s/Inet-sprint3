const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS to allow requests from the React frontend
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from React dev server
    methods: 'GET,POST', // Allow these HTTP methods
    credentials: true, // Allow cookies or credentials to be sent with requests
}));

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// Express session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Use 'true' only when using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // Session expires after 1 day
    },
}));

// Import routes for user authentication and products
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');

// Use the routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
