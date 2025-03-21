const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// Record a sale (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { vehicleId, userId, price } = req.body;
  const sale = new Sale({ vehicleId, userId, price });
  await sale.save();

  // Update vehicle status
  await Vehicle.findByIdAndUpdate(vehicleId, { status: 'sold', soldDate: Date.now(), soldTo: userId });

  res.json(sale);
});

// Get all sales
router.get('/', auth, async (req, res) => {
  const sales = await Sale.find().populate('vehicleId').populate('userId');
  res.json(sales);
});

module.exports = router;