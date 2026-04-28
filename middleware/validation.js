const mongoose = require('mongoose');

exports.validateProjectCreation = (req, res, next) => {
  const { templateId, title } = req.body;
  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    return res.status(400).json({ error: 'Invalid template ID' });
  }
  if (!title || title.length < 5 || title.length > 100) {
    return res.status(400).json({ error: 'Title must be 5–100 characters' });
  }
  next();
};

exports.validateSkillConflict = (req, res, next) => {
  const { teachIds = [], learnIds = [] } = req.body;
  // Ensure we handle both single values (strings) and arrays
  const teachArr = Array.isArray(teachIds) ? teachIds : [teachIds];
  const learnArr = Array.isArray(learnIds) ? learnIds : [learnIds];
  
  const intersect = teachArr.filter(id => id && learnArr.includes(id));
  if (intersect.length > 0) {
    return res.status(400).json({ error: 'A skill cannot be both taught and learned' });
  }
  next();
};
