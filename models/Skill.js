const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, enum: ['Design', 'Development', 'Marketing', 'Writing', 'Business'], required: true },
  popularity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Skill', skillSchema);
