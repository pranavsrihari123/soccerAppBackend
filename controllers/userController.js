const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const userController = {
  signup: async (req, res) => {
    const { username, password, firstName, lastName, email, phoneNumber, dateOfBirth, skillLevel } = req.body;

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store the user data in the database
      userModel.signup(username, hashedPassword, firstName, lastName, email, phoneNumber, dateOfBirth, skillLevel);

      res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  },
};

module.exports = userController;
