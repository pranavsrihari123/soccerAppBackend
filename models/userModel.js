// Import the required modules
const { DataTypes } = require('sequelize');
const sequelize  = require('../sequelize_init'); // Assuming you have a database connection in a separate file

// Define the User model based on the provided schema
const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.UUID, // Use UUID for a random identifier
    defaultValue: DataTypes.UUIDV4, // Generate a random UUID by default
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  user_role: {
    type: DataTypes.STRING, // Assuming user_role is a string
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATE,
  },
  skill_level: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['beginner', 'intermediate', 'advanced']],
    },
  },
  rating: {
    type: DataTypes.DECIMAL(6, 2),
  },
  team_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'teams', // Assuming there is a 'teams' table
      key: 'team_id',
    },
  },
  gender: {
    type: DataTypes.STRING(10),
    validate: {
      isIn: [['male', 'female']],
    },
  },
});

// Synchronize the model with the database
User.sync();

// Export the User model
module.exports = User;
