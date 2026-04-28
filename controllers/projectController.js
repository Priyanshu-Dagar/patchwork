const ProjectTemplate = require('../models/ProjectTemplate');
const Project = require('../models/Project');
const User = require('../models/User');

exports.listTemplates = async (req, res, next) => {
  try {
    const templates = await ProjectTemplate.find().populate('requiredSkills');
    res.render('templates', { title: 'Project Templates - Patchwork', templates });
  } catch (err) { next(err); }
};

exports.joinMatchingQueue = async (req, res, next) => {
  const { templateId } = req.body;
  try {
    const template = await ProjectTemplate.findById(templateId);
    if (!template) return res.status(404).send('Template not found');

    await User.findByIdAndUpdate(req.session.user.id, { 
        selectedTemplate: template._id,
        activeProject: null 
    });
    
    req.session.user.selectedTemplate = template._id;
    req.session.user.activeProject = null;

    res.redirect('/dashboard');
  } catch (err) { next(err); }
};

exports.completeProject = async (req, res, next) => {
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
    }

    res.redirect('/dashboard?completed=true');
  } catch (err) { next(err); }
};
