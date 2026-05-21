const pool = require('./database');

async function test() {
  const res = await pool.query('SELECT NOW()');
  console.log('Conectado a:', res.rows[0].now);
}
test();