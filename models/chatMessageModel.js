// models/ChatMessage.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_init');

const ChatMessage = sequelize.define('ChatMessage', {
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = ChatMessage;
