const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { requireLogin } = require('../middleware/auth');
const { validateProjectCreation } = require('../middleware/validation');

router.get('/templates', requireLogin, projectController.listTemplates);
router.post('/create', requireLogin, validateProjectCreation, projectController.joinMatchingQueue);
router.post('/complete/:id', requireLogin, projectController.completeProject);

module.exports = router;
