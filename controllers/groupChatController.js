const { Op } = require('sequelize');
const TeamChatMessage = require('../models/groupChatModel');

// Modify the function signature to accept req and res
module.exports = (io, req, res) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join-team', (teamId) => {
      // Join a room based on teamId
      socket.join(`team-${teamId}`);
    });

    socket.on('team-chat-message', async (data) => {
      try {
        // Save the message to the database
        const teamChatMessage = await TeamChatMessage.create({
          team_id: data.teamId,
          sender_id: data.senderId,
          message_text: data.message,
        });

        // Broadcast the message to all members of the team
        io.to(`team-${data.teamId}`).emit('team-chat-message', teamChatMessage);
      } catch (error) {
        console.error('Error saving team chat message:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Handle other logic as needed for the route
  res.send('Group chat route hit');
};
