const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { requireLogin } = require('../middleware/auth');

// View Certificate
router.get('/:projectId', requireLogin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const user = await User.findById(req.session.user.id);

    if (!project || project.status !== 'completed') {
        return res.status(404).send('Certificate not available');
    }

    if (!project.members.some(m => m.equals(user._id))) {
        return res.status(403).send('Access denied');
    }

    res.render('certificate', { title: 'Certificate of Completion', user, project });
  } catch (err) {
    res.status(500).send('Error generating certificate');
  }
});

module.exports = router;
