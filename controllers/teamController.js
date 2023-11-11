const { Teams } = require('../models/teamModel');

// Get all teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Teams.findAll();
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
