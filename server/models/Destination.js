const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  region:      { type: String },
  country:     { type: String, default: 'India' },
  rating:      { type: Number, default: 0 },
  trips:       { type: Number, default: 0 },
  badge:       { type: String },
  emoji:       { type: String },
  color:       { type: String },
  category:    { type: String },
  description: { type: String },
  reviews:     { type: Number, default: 0 },
  image:       { type: String },
  budget:      { type: String },
  tags:        [String],
});

module.exports = mongoose.model('Destination', destinationSchema);