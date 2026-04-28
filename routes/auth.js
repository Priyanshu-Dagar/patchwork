const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register - Patchwork', error: null });
});

// Register Logic
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('register', { title: 'Register', error: 'Username or Email already exists' });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    res.render('register', { title: 'Register', error: 'Error creating user' });
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login - Patchwork', error: null });
});

// Login Logic
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.render('login', { title: 'Login', error: 'Invalid username or password' });
    }
    // Set session
    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { title: 'Login', error: 'An error occurred' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
