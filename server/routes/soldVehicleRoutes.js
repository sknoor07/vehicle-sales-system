const express = require('express');
const router = express.Router();
const SoldVehicle = require('../models/SoldVehicle');
const auth = require('../middleware/auth');

router.get('/', auth('admin'), async (req, res) => {
  console.log('GET /api/sold-vehicles hit by user:', req.user);
  try {
    const soldVehicles = await SoldVehicle.find();
    console.log('Sold vehicles fetched:', soldVehicles);
    res.json(soldVehicles);
  } catch (err) {
    console.error('Error fetching sold vehicles:', err.message);
    res.status(500).json({ message: 'Failed to fetch sold vehicles', error: err.message });
  }
});

router.delete('/:id', auth('admin'), async (req, res) => {
  console.log('DELETE /api/sold-vehicles/:id hit with ID:', req.params.id);
  try {
    const soldVehicle = await SoldVehicle.findById(req.params.id);
    if (!soldVehicle) {
      console.log('Sold vehicle not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Sold vehicle not found' });
    }
    await SoldVehicle.deleteOne({ _id: req.params.id });
    console.log('Sold vehicle deleted:', soldVehicle);
    res.json({ message: 'Sold vehicle deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete sold vehicle', error: err.message });
  }
});

module.exports = router;