const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  name: String,
  fastTrackPrice: Number,
  minHeight: Number,
  imageUrl: String
});

module.exports = mongoose.model('Ride', rideSchema);
