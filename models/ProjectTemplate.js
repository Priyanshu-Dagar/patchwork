const mongoose = require('mongoose');

const projectTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  defaultTasks: [{ title: String, description: String, order: Number }],
  estimatedHours: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('ProjectTemplate', projectTemplateSchema);
