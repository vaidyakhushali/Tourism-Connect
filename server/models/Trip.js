const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  destination: { type: String, required: true },
  emoji:       { type: String },
  dates:       { type: String },
  budget:      { type: String },
  slots:       { type: Number, default: 10 },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  color:       { type: String },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image:       { type: String },
  date:        { type: String },
  spots:       { type: Number },
  total:       { type: Number },
  organizer:   { type: String },
  level:       { type: String },
  description: { type: String },
  itinerary:   [String],
  includes:    [String],
  gallery:     [{ url: String, caption: String }],
  price:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);