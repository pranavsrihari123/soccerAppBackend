const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const sequelize  = require('./sequelize_init'); // Import Sequelize initialization

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server);

// Use body parser middleware
app.use(bodyParser.json());


const establishTeamChat = require('./controllers/teamChatController')(io);
const establishPrivateChat = require('./controllers/privateChatController')(io);
// Require userRoutes module and pass Sequelize instance when requiring the module
const userRoutes = require('./routes/userRoutes');
//const chatRoutes = require('./routes/chatRoutes');
const teamRoutes = require('./routes/teamRoutes');

// Define routes for different parts of the application
app.use('/user', userRoutes);
//app.use('/chat', chatRoutes);
app.use('/team', teamRoutes);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export app, port, and sequelize together
module.exports = {
  app,
  server, 
  io,
  port,
  sequelize,
};
