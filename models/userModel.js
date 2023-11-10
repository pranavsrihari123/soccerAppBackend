const pool = require('../config/database');
const bcrypt = require('bcrypt');

const userModel = {
  signup: async (username, password, firstName, lastName, email, phoneNumber, dateOfBirth, skillLevel) => {
    try {
      // Store the user data in the database
      const insertProfileQuery = `
        INSERT INTO profiles (username, password, first_name, last_name, email, phone_number, date_of_birth, skill_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      await pool.query(insertProfileQuery, [
        username,
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth,
        skillLevel,
      ]);
    } catch (error) {
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      // Verify the user's credentials
      const query = 'SELECT password FROM profiles WHERE username = $1';
      const result = await pool.query(query, [username]);

      if (result.rows.length === 0) {
        // User with the given username not found
        return false;
      }
      const storedHashedPassword = result.rows[0].password;

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

      return isPasswordValid;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userModel;
