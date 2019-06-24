const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  database: 'sushi',
});

module.exports = {
  query: query => pool.query(query),
};
