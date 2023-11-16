const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

// Define routes
router.get('/teamList', teamController.getTeamsWithAvailableSlots);

module.exports = router;
