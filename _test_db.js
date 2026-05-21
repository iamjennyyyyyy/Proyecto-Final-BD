const { Pool } = require('pg');
const pool = new Pool({host:'localhost',user:'postgres',password:'jenn126*',database:'SPA',port:1234});

async function test() {
  try {
    const r = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='areas'");
    console.log('Columnas en areas:', r.rows.map(c => c.column_name).join(', '));
    
    const r2 = await pool.query('SELECT * FROM areas LIMIT 5');
    console.log('Datos:', JSON.stringify(r2.rows, null, 2));
  } catch(e) {
    console.log('Error:', e.message);
  } finally {
    await pool.end();
  }
}
test();
