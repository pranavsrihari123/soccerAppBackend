const bcrypt = require('bcrypt');
const { User, userModel } = require('../models/userModel'); // Import the Users object from userModel

module.exports = (sequelize) => {
  // Pass the sequelize instance to userModel
  const { userModel: userModelWithSequelize } = require('../models/userModel')(sequelize);

  const userController = {
    signup: async (req, res) => {
      const { username, password, email, userRole, firstName, lastName, date_of_birth, skillLevel, rating, teamId, gender } = req.body;

      try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the user data in the database using the correct import
        await userModelWithSequelize.signup(username, hashedPassword, email, userRole, firstName, lastName, date_of_birth, skillLevel, rating, teamId, gender);

        res.status(201).json({ message: 'Account created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
      }
    },
  };

  return userController;
};
