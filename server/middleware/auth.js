const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

module.exports = (roleRequired) => {
  return (req, res, next) => {
    console.log('Auth middleware entered');
    const token = req.header('x-auth-token');
    console.log('Token received:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, config.secret);
      console.log('Token decoded:', decoded);
      req.user = decoded;

      // Role check if roleRequired is specified
      if (roleRequired && req.user.role !== roleRequired) {
        console.log('Role check failed:', req.user.role);
        return res.status(403).json({ message: `Access denied, ${roleRequired} only` });
      }
      console.log('Auth middleware completed');
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      res.status(401).json({ message: 'Token is not valid', error: err.message });
      return;
    }
  };
};