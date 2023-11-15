// models/TeamChat.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize  = require('../sequelize_init'); // Assuming you have a database connection in a separate file

// Define the TeamChat model
const TeamChat = sequelize.define(
  'TeamChat',
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    team_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'teams', // Assuming your teams table is named 'teams'
        key: 'team_id',
      },
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Assuming your users table is named 'users'
        key: 'user_id',
      },
    },
    message_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'team_chats', // Assuming your table name is 'team_chats'
    timestamps: false, // Disable Sequelize's default timestamp fields
  }
);

module.exports = TeamChat;