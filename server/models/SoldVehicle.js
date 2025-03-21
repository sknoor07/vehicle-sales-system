const mongoose = require('mongoose');

const soldVehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  soldDate: { type: Date, default: Date.now },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who sold it
});

module.exports = mongoose.model('SoldVehicle', soldVehicleSchema);