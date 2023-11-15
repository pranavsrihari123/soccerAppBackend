// chatRoutes.js
const express = require('express');
const router = express.Router();
const teamChatController = require('../controllers/teamChatController');


router.post('/teamChat', teamChatController);

  // Export the router
return router;


