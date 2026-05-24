const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postNicky',
  database: 'SPA',
  port: 1234
});

module.exports = pool;