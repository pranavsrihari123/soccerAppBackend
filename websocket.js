// websocket.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Expose the Express.js app and server for further configuration (if needed)
module.exports = {
  app,
  server,
};
