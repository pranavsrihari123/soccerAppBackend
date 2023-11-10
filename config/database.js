const { Pool } = require('pg');
const pool = new Pool({
  user: 'socceruser',
  host: 'localhost',
  database: 'soccerappdb',
  password: 'soccerPass',
  port: 5432,
});

module.exports = pool;
