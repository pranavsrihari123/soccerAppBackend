// models/privateChatModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize_init');

const PrivateChat = sequelize.define(
  'PrivateChat',
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Assuming your users table is named 'users'
        key: 'user_id',
      },
    },
    receiver_id: {
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
    tableName: 'private_chats', // Adjust table name as needed
    timestamps: false,
  }
);

module.exports = PrivateChat;
