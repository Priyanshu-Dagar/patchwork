const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const ProjectTemplate = require('./models/ProjectTemplate');
const config = require('./config.json');

const skills = [
  { name: 'JavaScript', category: 'Development' },
  { name: 'UI Design', category: 'Design' },
  { name: 'Copywriting', category: 'Writing' },
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'Business Strategy', category: 'Business' },
  { name: 'Python', category: 'Development' },
  { name: 'Graphic Design', category: 'Design' }
];

const templates = [
  {
    title: 'E-commerce Prototype',
    description: 'Build a functional prototype for a local boutique.',
    estimatedHours: 20,
    defaultTasks: [
      { title: 'User Research', order: 0 },
      { title: 'UI Mockups', order: 1 },
      { title: 'Frontend Setup', order: 2 },
      { title: 'Product Integration', order: 3 }
    ]
  },
  {
    title: 'Brand Identity Package',
    description: 'Create a logo, color palette, and social media templates for a startup.',
    estimatedHours: 15,
    defaultTasks: [
      { title: 'Moodboard', order: 0 },
      { title: 'Logo Sketches', order: 1 },
      { title: 'Typography Selection', order: 2 },
      { title: 'Brand Guidelines', order: 3 }
    ]
  }
];

mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('Seeding database...');
    
    // Clear existing
    await Skill.deleteMany({});
    await ProjectTemplate.deleteMany({});

    // Add Skills
    const createdSkills = await Skill.insertMany(skills);
    console.log(`${createdSkills.length} skills added.`);

    // Add Templates (assign to a dummy admin if needed, or just skip createdBy for now)
    // For this prototype, we'll just skip the strict ref check or add a placeholder
    const templateData = templates.map(t => ({
        ...t,
        requiredSkills: [createdSkills[0]._id, createdSkills[1]._id],
        createdBy: new mongoose.Types.ObjectId() // Placeholder
    }));
    await ProjectTemplate.insertMany(templateData);
    console.log(`${templateData.length} templates added.`);

    console.log('Seeding complete!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
