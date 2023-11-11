const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const faker = require('faker'); // Import Faker for generating random data

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    user_role: { type: DataTypes.ENUM('player', 'host'), allowNull: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    date_of_birth: { type: DataTypes.DATEONLY }, // New field for date of birth
    skill_level: { type: DataTypes.STRING },
    rating: { type: DataTypes.NUMERIC(6, 2) },
    team_id: { type: DataTypes.INTEGER, references: { model: 'teams', key: 'team_id' } },
    gender: { type: DataTypes.STRING(10) },
  });

  const userModel = {
    signup: async (username, password, email, userRole, firstName, lastName, dateOfBirth, skillLevel, rating, teamId, gender) => {
      try {
        // Store the user data in the database
        await User.create({
          username,
          password,
          email,
          user_role: userRole,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth, // Changed line to include date of birth
          skill_level: skillLevel,
          rating: rating,
          team_id: teamId,
          gender: gender,
        });
      } catch (error) {
        throw error;
      }
    },

    login: async (username, password) => {
      try {
        // Verify the user's credentials
        const user = await User.findOne({ where: { username } });

        if (!user) {
          // User with the given username not found
          return false;
        }

        const storedHashedPassword = user.password;

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

        return isPasswordValid;
      } catch (error) {
        throw error;
      }
    },

    // Additional methods can be added here for managing user-related operations
  };

  return {
    User,
    userModel,
  };
};
