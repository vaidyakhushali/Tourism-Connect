const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  username:   { type: String, required: true, unique: true },
  email:      { type: String, unique: true, sparse: true },
  password:   { type: String, required: true },
  initials:   { type: String },
  places:     { type: Number, default: 0 },
  verified:   { type: Boolean, default: false },
  tags:       [String],
  color:      { type: String },
  status:     { type: String, default: 'Active' },
  country:    { type: String },
  phone:      { type: String },
  visited:    [String],
  avatar:     { type: String },
  bio:        { type: String },
  followers:  { type: Number, default: 0 },
  tripsCount: { type: Number, default: 0 },
  isAdmin:    { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);