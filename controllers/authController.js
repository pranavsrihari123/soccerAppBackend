// Import necessary modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  User  = require('../models/userModel');

// Function to handle user login
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Both username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user.user_id }, 'your-secret-key', { expiresIn: '1h' });

    // Return the token and user data
    res.status(200).json({ token, user: { username: user.username, user_id: user.user_id } });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Export the controller function
module.exports = {
  loginUser,
};
