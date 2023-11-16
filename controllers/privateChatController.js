// controllers/privateChatController.js
const PrivateChat = require('../models/privateChatModel');
const User = require('../models/userModel');

const privateChatController = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a private chat room
    socket.on('joinPrivateChat', async (data) => {
      console.log('private chat joined');
      const { senderId, receiverId } = data;
      console.log(senderId);

      try {
        // Join the private chat room
        const roomName = getPrivateChatRoomName(senderId, receiverId);
        socket.join(roomName);
        console.log(`User ${senderId} joined PrivateChat room with ${receiverId}`);

        // Fetch existing messages for the private chat and send them to the user
        const existingMessages = await PrivateChat.findAll({
          where: {
            [Sequelize.Op.or]: [
              { sender_id: senderId, receiver_id: receiverId },
              { sender_id: receiverId, receiver_id: senderId },
            ],
          },
          order: [['sent_at', 'ASC']], // Adjust the order as needed
        });

        // Send existing messages to the connecting user
        if (existingMessages.length > 0) {
          socket.emit('existingPrivateChatMessages', formatPrivateMessage(existingMessages));
        }
      } catch (error) {
        console.error('Error joining private chat:', error);
      }
    });

    // Handle sending a private chat message
    socket.on('sendPrivateChatMessage', async ({ senderId, receiverId, messageText }) => {
      try {
        // Create a new PrivateChat message
        const newMessage = await PrivateChat.create({
          sender_id: senderId,
          receiver_id: receiverId,
          message_text: messageText,
        });

        // Fetch sender information from the User model
        const sender = await User.findByPk(senderId);

        // Broadcast the new message to the private chat room
        const roomName = getPrivateChatRoomName(senderId, receiverId);
        io.to(roomName).emit('receivePrivateChatMessage', formatPrivateMessage(newMessage, sender));

        console.log(`User ${senderId} sent a message to ${receiverId}`);
      } catch (error) {
        console.error('Error sending private chat message:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

// Helper function to format a PrivateChat message for client consumption
const formatPrivateMessage = (message, sender) => ({
  _id: message.message_id.toString(),
  text: message.message_text,
  createdAt: new Date(message.sent_at),
  user: {
    _id: message.sender_id.toString(),
    name: `${sender.first_name} ${sender.last_name}`, // Include the full name of the sender
  },
});

// Helper function to get a unique room name for private chat
const getPrivateChatRoomName = (userId1, userId2) => {
  return `private_chat_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
};

module.exports = privateChatController;