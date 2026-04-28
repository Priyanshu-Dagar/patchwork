const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTemplate', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['matching', 'active', 'completed', 'cancelled'], default: 'matching' },
  startDate: Date,
  endDate: Date,
  timeCreditsEarned: { type: Number, default: 0 },
  showcaseItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ShowcaseItem' }
});

module.exports = mongoose.model('Project', projectSchema);
