const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { requireLogin } = require('../middleware/auth');

// Get Task Board for a Project
router.get('/board/:projectId', requireLogin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('members');
    if (!project) return res.status(404).send('Project not found');
    
    // Security: Check if user is a member
    if (!project.members.some(m => m._id.equals(req.session.user.id))) {
      return res.status(403).send('Access denied');
    }

    const tasks = await Task.find({ projectId: project._id }).sort('order');
    res.render('taskboard', { title: 'Task Board - ' + project.title, project, tasks });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Task Status (AJAX)
router.patch('/:id', requireLogin, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.status = status;
    await task.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
