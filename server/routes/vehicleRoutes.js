const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const SoldVehicle = require('../models/SoldVehicle');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination set to uploads/');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Multer filename:', filename);
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), auth('admin'), async (req, res) => {
  console.log('Processing vehicle creation:', req.body, req.file);

  const { name, category, price, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const vehicle = new Vehicle({ name, category, price, description, imageUrl });

  try {
    await vehicle.save();
    console.log('Vehicle saved:', vehicle);
    res.json(vehicle);
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(400).json({ message: 'Failed to save vehicle', error: err.message });
  }
});

module.exports = router;

/*router.post('/', (req, res, next) => {
  console.log('Request hit /api/vehicles:', req.method, req.headers);
  next();
}, upload.single('image'), async (req, res) => {
  console.log('Processing vehicle creation:', req.body, req.file);
  
  const { name, category, price, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const vehicle = new Vehicle({ name, category, price, description, imageUrl });

  try {
    await vehicle.save();
    console.log('Vehicle saved:', vehicle);
    res.json(vehicle);
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(400).json({ message: 'Failed to save vehicle', error: err.message });
  }
});

module.exports = router;*/

// Update a vehicle (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { name, category, price, description } = req.body;
  const updateData = { name, category, price, description };
  if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(vehicle);
});

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err.message);
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
});
module.exports = router;

// New POST to sell a vehicle
router.post('/sell/:id', auth('admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create sold vehicle record
    const soldVehicle = new SoldVehicle({
      name: vehicle.name,
      category: vehicle.category,
      price: vehicle.price,
      description: vehicle.description,
      imageUrl: vehicle.imageUrl,
      soldBy: req.user.id,
    });

    // Save sold vehicle and delete original
    await soldVehicle.save();
    await Vehicle.deleteOne({ _id: req.params.id });

    console.log('Vehicle sold:', soldVehicle);
    res.json(soldVehicle);
  } catch (err) {
    console.error('Sell error:', err.message);
    res.status(500).json({ message: 'Failed to sell vehicle', error: err.message });
  }
});

module.exports = router;