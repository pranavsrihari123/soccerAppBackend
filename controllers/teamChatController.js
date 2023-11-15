const Team = require('../models/teamModel');
const TeamChat = require('../models/teamChatModel');
const User = require('../models/userModel');

const teamChatController = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a team chat room
    socket.on('joinTeamChat', async (data) => {
      console.log('team chat joined');
      const { teamId, userId } = data;
      console.log(userId);
      
      try {
        // Retrieve team information
        const team = await Team.findByPk(teamId);
        if (!team) {
          console.error('Team not found');
          return;
        }

        // Join the team chat room
        socket.join(teamId);
        console.log(`User ${userId} joined TeamChat room for Team ${teamId}`);

        // Fetch existing messages for the team and send them to the user
        const existingMessages = await TeamChat.findAll({
          where: { team_id: teamId },
          order: [['sent_at', 'DESC']], // Adjust the order as needed
        });

        // Send existing messages to the connecting user
        if (existingMessages.length > 0) {
          // Send existing messages to the connecting user
          socket.emit('existingTeamChatMessages', existingMessages.map(formatMessage));
        }
      } catch (error) {
        console.error('Error joining team chat:', error);
      }
    });

    // Handle sending a team chat message
    socket.on('sendTeamChatMessage', async ({ teamId, senderId, messageText }) => {
      try {
        // Create a new TeamChat message
        const newMessage = await TeamChat.create({
          team_id: teamId,
          sender_id: senderId,
          message_text: messageText,
        });

        // Fetch sender information from the User model
        const sender = await User.findByPk(senderId);

        // Broadcast the new message to all users in the team chat room
        io.to(teamId).emit('receiveTeamChatMessage', formatMessage(newMessage, sender));

        console.log(`User ${senderId} sent a message to Team ${teamId}`);
      } catch (error) {
        console.error('Error sending team chat message:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

// Helper function to format a TeamChat message for client consumption
const formatMessage = (message, sender) => ({
  _id: message.message_id.toString(),
  text: message.message_text,
  createdAt: new Date(message.sent_at),
  user: {
    _id: message.sender_id.toString(),
    name: `${sender.first_name} ${sender.last_name}`, // Include the full name of the sender
  },
});

module.exports = teamChatController;
