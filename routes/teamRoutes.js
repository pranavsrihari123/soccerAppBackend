const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

// Define routes
router.get('/teams', teamController.getTeams);

module.exports = router;
