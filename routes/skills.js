const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get Skill Heatmap Data
router.get('/heatmap', async (req, res) => {
  try {
    const skills = await Skill.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'skillsToTeach',
          as: 'teachers'
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          count: { $size: '$teachers' }
        }
      }
    ]);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
