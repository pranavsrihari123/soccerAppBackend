const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Verify the user's credentials
      const isAuthenticated = await userModel.login(username, password);

      if (isAuthenticated) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrongly. Please try again.' });
    }
  },
};

module.exports = authController;
