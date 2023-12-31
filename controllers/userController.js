// userController.js
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// Function to create a new user
async function createUser(req, res) {
  try {
    console.log('Request Body:', req.body);

    // Generate a random user_id using uuid
    const user_id = uuidv4();

    // Extract user data from the request body
    const {
      username,
      password,
      email,
      user_role,
      first_name,
      last_name,
      date_of_birth,
      skill_level,
      rating,
      team_id,
      gender,
    } = req.body;

    // Check if required fields are present
    if (!username || !password || !email || !user_role || !first_name || !last_name) {
      // Log each value individually
      console.log('Missing required fields. Request Body:');
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Email:', email);
      console.log('User Role:', user_role);
      console.log('First Name:', first_name);
      console.log('Last Name:', last_name);

      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Create a new user in the database with the generated user_id
    const newUser = await User.create({
      user_id,
      username,
      password,
      email,
      user_role,
      first_name,
      last_name,
      date_of_birth,
      skill_level,
      rating,
      team_id,
      gender,
    });

    // Send a success response
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating user:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

// Function to get teams for a user by UUID
async function getUserTeams(req, res) {
    try {
      const userUUID = req.body.userId;
      console.log(userUUID);
  
      // Find user and include associated teams
      console.log("start000000");
      const user = await User.findByPk(userUUID, {
        include: [{ model: Team, through: 'user_teams' }],
      });

      console.log(user);
      console.log("end00000");
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      console.log("start");
      // Extract teams from the user object
      const teamList = user.teams.map((team) => {
        return {
          team_id: team.team_id,
          team_name: team.team_name,
          // ... other team attributes
        };
      });
      console.log("end");
  
      res.json(teamList);
    } catch (error) {
      console.error('Error getting user teams:', error.message);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
}

// Function to get friends for a user by UUID
async function getUserFriends(req, res) {
  try {
    const userId = req.body.userId;

    // Find user and include associated friends
    console.log("finding friends");
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Friend', through: 'friends' }],
    });
    console.log("found");

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract friends from the user object
    console.log("filling list");
    const friendsList = user.Friend.map((friendAssociation) => {
      const friend = friendAssociation.toJSON();
      return {
        user_id: friend.user_id,
        username: friend.username,
        first_name: friend.first_name,
        last_name: friend.last_name,
        // ... other friend attributes
      };
    });

    res.json(friendsList);
  } catch (error) {
    console.error('Error getting user friends:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

// Export the controller functions
module.exports = {
  createUser,
  getUserTeams,
  getUserFriends,
};
