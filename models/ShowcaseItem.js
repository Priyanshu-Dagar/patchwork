const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  title: String,
  description: String,
  imageUrl: String,
  demoUrl: String,
  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('ShowcaseItem', showcaseSchema);
