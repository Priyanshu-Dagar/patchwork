const express = require('express');
const router = express.Router();
const ProjectTemplate = require('../models/ProjectTemplate');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const { requireLogin } = require('../middleware/auth');
const projectController = require('../controllers/projectController');
const { validateProjectCreation } = require('../middleware/validation');

router.get('/templates', requireLogin, projectController.listTemplates);
router.post('/create', requireLogin, validateProjectCreation, projectController.joinMatchingQueue);

// Complete Project (Logic moved here for certificate hook)
router.post('/complete/:id', requireLogin, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('members');
    if (!project) return res.status(404).send('Project not found');
    
    if (!project.members.some(m => m._id.equals(req.session.user.id))) {
      return res.status(403).send('Access denied');
    }

    project.status = 'completed';
    project.endDate = new Date();
    await project.save();

    const reward = 20;
    for (let member of project.members) {
      member.timeCredits += reward;
      member.completedProjects.push(project._id);
      member.activeProject = null;
      await member.save();

      // Save Certificate HTML as per documentation
      const cert = new Certificate({
          userId: member._id,
          projectId: project._id,
          htmlContent: `<h1>Certificate of Completion</h1><p>${member.username} successfully completed ${project.title}</p>`
      });
      await cert.save();
    }

    res.redirect('/dashboard?completed=true');
  } catch (err) { next(err); }
});

module.exports = router;
