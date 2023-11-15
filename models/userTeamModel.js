const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_init'); // Import your Sequelize instance from wherever it's defined
//const Team = require('./teamModel');
//const User = require('./userModel');

const UserTeam = sequelize.define('user_team', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  team_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
});


// Define associations later using the associate method
UserTeam.associate = models => {
    UserTeam.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    UserTeam.belongsTo(models.Team, { foreignKey: 'team_id', onDelete: 'CASCADE' });
};

module.exports = UserTeam;
