const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Password policy (ensure passwords meet required criteria)
const PasswordValidator = require('password-validator');
const schema = new PasswordValidator();
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // Check for blank fields
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!schema.validate(password)) {
    return res.status(400).json({ error: 'Password does not meet policy requirements' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user in the database
    const newUser = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: { email: newUser.email } });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 'P2002') { // Unique constraint violation for email
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for blank fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await prisma.customer.findUnique({
      where: { email },
    });

    // If user is not found, return 404
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session variables
    req.session.customer_id = user.customer_id;
    req.session.email = user.email;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;

    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred while trying to log in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Get session route
router.get('/session', (req, res) => {
  if (req.session && req.session.customer_id) {
    res.status(200).json({
      customer_id: req.session.customer_id,
      email: req.session.email,
      first_name: req.session.first_name,
      last_name: req.session.last_name,
    });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

module.exports = router;
