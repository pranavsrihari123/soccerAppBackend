// Import the required modules
const { DataTypes } = require('sequelize');
const sequelize  = require('../sequelize_init'); // Assuming you have a database connection in a separate file
const bcrypt = require('bcrypt');
//const UserTeam = require('./userTeamModel');

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
  gender: {
    type: DataTypes.STRING(10),
    validate: {
      isIn: [['male', 'female']],
    },
  },
});

// Define associations later using the associate method
User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'user_teams', // Junction table name
      foreignKey: 'user_id',
    });
    //User.hasMany(models.TeamChat, { foreignKey: 'sender_id' });
    // Define the many-to-many association
    User.belongsToMany(models.User, {
      as: 'Friend',
      through: 'friends', // The intermediate table name (adjust based on your actual table name)
      foreignKey: 'user_id_1', // Foreign key in the 'friends' table that points to the user
      otherKey: 'user_id_2',
    });
};

// Hook to hash the user's password before saving to the database
User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

// Synchronize the model with the database
User.sync();

// Export the User model
module.exports = User;
