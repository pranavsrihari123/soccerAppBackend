const Sequelize = require('sequelize');
const { Teams } = require('./teamModel');

const sequelize = new Sequelize({
  dialect: 'postgres',
  // Add your database connection details here
});

const db = {
  sequelize,
  Teams: Teams(sequelize),
  // Add other models here if needed
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize.sync(); // Sync the database

module.exports = db;
