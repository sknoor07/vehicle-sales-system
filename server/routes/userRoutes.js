const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/jwt');


// Register
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
  
    // Ensure role is either 'user' or 'admin'
    if (role && role !== 'admin' && role !== 'user') {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role: role || 'user' });  // Ensure the role is set here
    await user.save();
    res.json({ message: 'User registered' });
  });
  
  module.exports = router;

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, config.secret, { expiresIn: config.expiresIn });
    res.json({ token });  // Return only the token
  });
  
  const auth = require('../middleware/auth');

  module.exports = router;