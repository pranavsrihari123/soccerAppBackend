module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'socceruser',
    password: 'soccerPass',
    database: 'soccerappdb',
    define: {
      timestamps: false, // Disable sequelize's timestamping feature by default
    },
    logging: console.log, // Add this line for logging
  };
  