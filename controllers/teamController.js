const Team = require('../models/teamModel');
const { Sequelize, Op } = require('sequelize');

// Controller function to get teams with max_number_of_players > number_of_players
const getTeamsWithAvailableSlots = async (req, res) => {
    try {
      // Fetch teams from the database where max_number_of_players > number_of_players
      const teams = await Team.findAll({
        where: {
          max_number_of_players: {
            [Sequelize.Op.gt]: Sequelize.col('number_of_players'),
          },
        },
      });
  
      // Send the list of teams as a JSON response
      return res.json({ teams });
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Handle errors and send an appropriate response
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
  // Export the controller function for use in your routes
module.exports = {
  getTeamsWithAvailableSlots,
};
