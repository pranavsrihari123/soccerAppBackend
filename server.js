const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Import Sequelize from the initialization file
const sequelize = require('./sequelize_init');
//console.log('server sequelize:', sequelize);

// Use body parser middleware
app.use(bodyParser.json());

// Require userRoutes module and pass Sequelize instance when requiring the module
const userRoutes = require('./routes/userRoutes');
//console.log('server sequelize:', sequelize); // Log Sequelize instance for debugging purposes
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');

// Define routes for different parts of the application
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/api', teamRoutes);


// Export app, port, and sequelize together
module.exports = {
  app,
  port,
  sequelize,
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
