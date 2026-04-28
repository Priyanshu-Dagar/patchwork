const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');

router.get('/heatmap', heatmapController.getSkillHeatmap);

module.exports = router;
