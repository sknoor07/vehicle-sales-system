const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// One-time setup endpoint (remove after use)
router.post('/setup', async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('POST /api/auth/setup hit with:', req.body);
  if (!username || !email || !password || role !== 'admin') {
    return res.status(400).json({ message: 'Must provide username, email, password, and role as admin' });
  }
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists, use /register instead' });
    }
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ message: 'Username or email already exists' });
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    });
    await user.save();
    console.log('First admin registered:', user);
    res.status(201).json({ message: 'First admin registered successfully', user: { username, email, role } });
  } catch (err) {
    console.error('Setup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log('User info fetched:', user);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', auth('admin'), async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log('POST /api/auth/register hit with:', req.body); // Debug log
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }
  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ message: 'Username or email already exists' });
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'user',
    });
    await user.save();
    console.log('New user registered:', user);
    res.status(201).json({ message: 'User registered successfully', user: { username, email, role } });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;