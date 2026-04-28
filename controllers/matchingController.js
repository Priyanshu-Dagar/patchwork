const User = require('../models/User');
const Project = require('../models/Project');

function computeComplementarity(userA, userB) {
  const teachA = userA.skillsToTeach.map(s => s.toString());
  const learnB = userB.skillsToLearn.map(s => s.toString());
  const overlap1 = teachA.filter(id => learnB.includes(id)).length;

  const teachB = userB.skillsToTeach.map(s => s.toString());
  const learnA = userA.skillsToLearn.map(s => s.toString());
  const overlap2 = teachB.filter(id => learnA.includes(id)).length;

  return overlap1 + overlap2;
}

exports.runMatching = async (templateId) => {
  // Find users who want this template and are not in a project
  // Note: We'd need a field 'selectedTemplate' on User for this specific logic
  const candidates = await User.find({ 
    activeProject: null, 
    selectedTemplate: templateId 
  }).populate('skillsToTeach skillsToLearn');

  let teams = [];
  let remaining = [...candidates];

  while (remaining.length >= 2) {
    let bestPair = null;
    let bestScore = -1;

    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        const score = computeComplementarity(remaining[i], remaining[j]);
        if (score > bestScore) {
          bestScore = score;
          bestPair = [i, j];
        }
      }
    }

    if (bestPair && bestScore > 0) {
      const userA = remaining[bestPair[0]];
      const userB = remaining[bestPair[1]];
      
      // Create Project
      const Project = require('../models/Project');
      const ProjectTemplate = require('../models/ProjectTemplate');
      const Task = require('../models/Task');
      
      const template = await ProjectTemplate.findById(templateId);
      const newProject = new Project({
        title: template.title,
        templateId: template._id,
        members: [userA._id, userB._id],
        status: 'active',
        startDate: new Date()
      });
      const project = await newProject.save();

      // Create Tasks
      const tasks = template.defaultTasks.map(t => ({
        projectId: project._id,
        title: t.title,
        description: t.description,
        order: t.order
      }));
      await Task.insertMany(tasks);

      // Update Users
      userA.activeProject = project._id;
      userA.selectedTemplate = null;
      userB.activeProject = project._id;
      userB.selectedTemplate = null;
      await userA.save();
      await userB.save();

      teams.push([userA, userB]);
      
      const highIdx = bestPair[1];
      const lowIdx = bestPair[0];
      remaining.splice(highIdx, 1);
      remaining.splice(lowIdx, 1);
    } else {
      break; 
    }
  }

  return teams;
};
