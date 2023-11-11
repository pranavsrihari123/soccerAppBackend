const { DataTypes } = require('sequelize');

module.exports.Teams = (sequelize) => {
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
      type: DataTypes.NUMERIC(6, 2),
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
      allowNull: false,
      validate: {
        isIn: [['basketball', 'soccer', 'football']],
      },
    },
    intensity: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['casual', 'competitive']],
      },
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['men', 'women', 'co-ed']],
      },
    },
  });

  return Team;
};
