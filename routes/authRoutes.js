// userRoutes.js
const express = require('express');
const router = express.Router();
//const sequelize = require('../sequelize_init'); // Import the sequelize instance

const userController = require('../controllers/authController'); // Pass the sequelize instance

router.post('/login', userController.logineUser);

module.exports = router;
