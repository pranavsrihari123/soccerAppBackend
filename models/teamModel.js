// Import Sequelize library and database connection
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_init'); // Replace with your actual database connection file
//const UserTeam = require('./userTeamModel');

// Define the 'teams' model
const Team = sequelize.define('team', {
  team_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  team_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  team_rating: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0,
  },
  number_of_players: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  max_number_of_players: {
    type: DataTypes.INTEGER,
  },
  type_of_sport: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['basketball', 'soccer', 'football']],
    },
  },
  intensity: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['casual', 'competitive']],
    },
  },
  gender: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['men', 'women', 'co-ed']],
    },
  },
});

// Define associations later using the associate method
Team.associate = (models) => {
  Team.belongsToMany(models.User, {
    through: 'user_teams', // Junction table name
    foreignKey: 'team_id',
  });
  //Team.hasMany(models.TeamChat, { foreignKey: 'team_id' });
};


// Define indexes
//Team.addIndex('idx_teams_team_name', ['team_name']);

// Export the 'teams' model
module.exports = Team;
