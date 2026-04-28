const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  skillsToTeach: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  skillsToLearn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  timeCredits: { type: Number, default: 10 },
  activeProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  selectedTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTemplate', default: null },
  completedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('User', userSchema);
