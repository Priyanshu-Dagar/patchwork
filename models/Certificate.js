const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  issuedAt: { type: Date, default: Date.now, immutable: true },
  htmlContent: { type: String, required: true }
});

module.exports = mongoose.model('Certificate', certificateSchema);
