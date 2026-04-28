const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const { requireLogin } = require('../middleware/auth');

// Profile Page (Skill Selection)
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('skillsToTeach skillsToLearn');
    const allSkills = await Skill.find();
    res.render('profile', { title: 'My Profile - Patchwork', user, allSkills });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Skills
router.post('/profile/skills', requireLogin, async (req, res) => {
  const { teachIds, learnIds } = req.body;
  try {
    // Basic conflict check
    const intersect = (Array.isArray(teachIds) ? teachIds : [teachIds])
        .filter(id => (Array.isArray(learnIds) ? learnIds : [learnIds]).includes(id));
    
    if (intersect.length > 0 && intersect[0] !== undefined) {
      return res.status(400).send('A skill cannot be both taught and learned.');
    }

    await User.findByIdAndUpdate(req.session.user.id, {
      skillsToTeach: teachIds || [],
      skillsToLearn: learnIds || []
    });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error updating skills');
  }
});

module.exports = router;
