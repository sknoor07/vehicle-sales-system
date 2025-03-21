const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  saleDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Sale', saleSchema);