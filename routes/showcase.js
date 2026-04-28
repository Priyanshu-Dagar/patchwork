const express = require('express');
const router = express.Router();
const ShowcaseItem = require('../models/ShowcaseItem');
const Project = require('../models/Project');
const { requireLogin } = require('../middleware/auth');

// Gallery View
router.get('/', async (req, res) => {
  try {
    const items = await ShowcaseItem.find().populate('projectId').sort('-votes');
    res.render('showcase', { title: 'Project Showcase', items });
  } catch (err) {
    res.status(500).send('Error loading gallery');
  }
});

// Create Showcase Item
router.post('/add', requireLogin, async (req, res) => {
  const { projectId, title, description, imageUrl, demoUrl } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'completed') {
        return res.status(400).send('Project must be completed to showcase');
    }
    const newItem = new ShowcaseItem({ projectId, title, description, imageUrl, demoUrl });
    await newItem.save();
    res.redirect('/showcase');
  } catch (err) {
    res.status(500).send('Error adding to showcase');
  }
});

// Vote
router.post('/:id/vote', requireLogin, async (req, res) => {
  try {
    const item = await ShowcaseItem.findById(req.params.id);
    if (item.voters.includes(req.session.user.id)) {
      return res.status(400).send('Already voted');
    }
    item.votes += 1;
    item.voters.push(req.session.user.id);
    await item.save();
    res.redirect('/showcase');
  } catch (err) {
    res.status(500).send('Voting failed');
  }
});

module.exports = router;
