const express = require('express');
const router = express.Router();
const { sequelize } = require('../server'); // Import the sequelize instance
const userController = require('../controllers/userController')(sequelize); // Pass the sequelize instance

router.post('/signup', userController.signup);

module.exports = router;
