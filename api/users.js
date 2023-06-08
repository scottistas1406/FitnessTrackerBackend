/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const users = [];
// POST /api/users/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the username already exists
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }
  
    // Check if the password meets the length requirement
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password should be at least 8 characters long' });
    }
  
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    // Save the user to the database
    users.push({ username, password: hashedPassword });
  
    // Return a success message
    return res.status(201).json({ message: 'User registered successfully' });
  });

// POST /api/users/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user in the database
    const user = users.find(user => user.username === username);
  
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  
    // Check if the password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  
    // Return a success message or any additional data you want to include
    return res.status(200).json({ message: 'Login successful' });
  });

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
