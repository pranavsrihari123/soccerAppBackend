// userRoutes.js
const express = require('express');
const router = express.Router();
//const sequelize = require('../sequelize_init'); // Import the sequelize instance

const userController = require('../controllers/userController'); // Pass the sequelize instance

router.post('/signup', userController.createUser);

module.exports = router;
