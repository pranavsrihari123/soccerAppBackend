// server.js
const { Sequelize } = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Import database configuration
const dbConfig = require('./config/database.js');
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  define: dbConfig.define,
});

// Use body parser middleware
app.use(bodyParser.json());

// Set up routes
const userRoutes = require('./routes/userRoutes')(sequelize);
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/api', teamRoutes);

// ... other routes and server setup

// Export the sequelize instance
module.exports = {
  app,
  sequelize,
  port,
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
