const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location:   { type: String, required: true },
  caption:    { type: String, required: true },
  emoji:      { type: String },
  color:      { type: String },
  likes:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:   [{ text: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  status:     { type: String, default: 'Published' },
  image:      { type: String },
  tags:       [String],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);