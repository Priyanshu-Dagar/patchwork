const express = require('express');
const router = express.Router();
const ProjectTemplate = require('../models/ProjectTemplate');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { requireLogin } = require('../middleware/auth');

// List Templates
router.get('/templates', requireLogin, async (req, res) => {
  try {
    const templates = await ProjectTemplate.find().populate('requiredSkills');
    res.render('templates', { title: 'Project Templates - Patchwork', templates });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// "Start Project" now means "Join Queue" for matching
router.post('/create', requireLogin, async (req, res) => {
  const { templateId } = req.body;
  try {
    const template = await ProjectTemplate.findById(templateId);
    if (!template) return res.status(404).send('Template not found');

    // Update user's selected template and clear any active project
    await User.findByIdAndUpdate(req.session.user.id, { 
        selectedTemplate: template._id,
        activeProject: null 
    });
    
    req.session.user.selectedTemplate = template._id;
    req.session.user.activeProject = null;

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error joining queue');
  }
});

// Complete Project
router.post('/complete/:id', requireLogin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members');
    if (!project) return res.status(404).send('Project not found');
    
    // Simple check: only members can complete
    if (!project.members.some(m => m._id.equals(req.session.user.id))) {
      return res.status(403).send('Access denied');
    }

    project.status = 'completed';
    project.endDate = new Date();
    await project.save();

    // Distribute rewards (e.g., 20 credits per member)
    const reward = 20;
    for (let member of project.members) {
      member.timeCredits += reward;
      member.completedProjects.push(project._id);
      member.activeProject = null;
      await member.save();
    }

    res.redirect('/dashboard?completed=true');
  } catch (err) {
    res.status(500).send('Error completing project');
  }
});
