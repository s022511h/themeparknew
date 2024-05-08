const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  basePrice: {
    type: Number,
    default: 20 
  },
  rides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  fastTrackRides: [{
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride'
    },
    price: Number
  }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
