// sequelize-init.js
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  define: dbConfig.define,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

const models = {
  User: require('./models/userModel'),
  Team: require('./models/teamModel'),
  UserTeam: require('./models/userTeamModel'),
  //TeamChat: require('./models/teamChatModel'),
};

// Associate the models
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});