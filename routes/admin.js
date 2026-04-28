const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ProjectTemplate = require('../models/ProjectTemplate');
const { requireAdmin } = require('../middleware/auth');
const matchingController = require('../controllers/matchingController');

// Admin Dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().populate('skillsToTeach skillsToLearn selectedTemplate');
    const templates = await ProjectTemplate.find();
    
    // Count users waiting for each template
    const waitingCounts = {};
    users.forEach(u => {
      if (u.selectedTemplate) {
        const id = u.selectedTemplate._id.toString();
        waitingCounts[id] = (waitingCounts[id] || 0) + 1;
      }
    });

    res.render('admin_dashboard', { title: 'Admin Dashboard', users, templates, waitingCounts });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Trigger Matching
router.post('/match/:templateId', requireAdmin, async (req, res) => {
  try {
    const teams = await matchingController.runMatching(req.params.templateId);
    res.redirect('/admin/dashboard?matched=' + teams.length);
  } catch (err) {
    res.status(500).send('Matching failed');
  }
});

module.exports = router;
