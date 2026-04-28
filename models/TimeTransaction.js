const mongoose = require('mongoose');

const timeTransactionSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  reason: { type: String, enum: ['teaching', 'project_completion', 'admin_adjustment'], required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  timestamp: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('TimeTransaction', timeTransactionSchema);
