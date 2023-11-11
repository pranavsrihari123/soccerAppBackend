const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

// Controller function to create a new user
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

// Export the controller function
module.exports = {
  createUser,
};
