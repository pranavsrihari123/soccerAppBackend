// userRoutes.js
const express = require('express');
const router = express.Router();
//const sequelize = require('../sequelize_init'); // Import the sequelize instance

const userController = require('../controllers/userController'); // Pass the sequelize instance
const authController = require('../controllers/authController'); // Pass the sequelize instance

router.post('/signup', userController.createUser);
router.post('/getTeams', userController.getUserTeams);
router.post('/getFriends', userController.getUserFriends);
router.post('/login', authController.loginUser);

module.exports = router;
