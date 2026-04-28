const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const ProjectTemplate = require('./models/ProjectTemplate');
const User = require('./models/User');
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
    
    await Skill.deleteMany({});
    await ProjectTemplate.deleteMany({});
    await User.deleteMany({});

    const createdSkills = await Skill.insertMany(skills);
    console.log(`${createdSkills.length} skills added.`);

    const admin = new User({
        username: 'admin',
        email: 'admin@patchwork.com',
        password: 'adminpassword',
        role: 'admin',
        timeCredits: 100
    });
    await admin.save();
    console.log('Admin user created (admin/adminpassword)');

    const templateData = templates.map(t => ({
        ...t,
        requiredSkills: [createdSkills[0]._id, createdSkills[1]._id],
        createdBy: admin._id
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
