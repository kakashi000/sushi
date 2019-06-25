const { Pool } = require('pg');
const config = require('../../config/db.json');

const pool = new Pool(config);

module.exports = {
  query: query => pool.query(query),
};
