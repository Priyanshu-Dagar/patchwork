const Skill = require('../models/Skill');

exports.getSkillHeatmap = async (req, res, next) => {
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
  } catch (err) { next(err); }
};
