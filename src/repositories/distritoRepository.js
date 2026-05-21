const pool = require('../config/database');

class DistritoRepository {
  async listarTodos() {
    const result = await pool.query('SELECT * FROM distritos ORDER BY iddistrito');
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM distritos WHERE iddistrito = $1', [id]);
    return result.rows[0];
  }

  async guardar({ nombreDistrito }) {
    const result = await pool.query(
      'INSERT INTO distritos (nombredistrito) VALUES ($1) RETURNING *',
      [nombreDistrito]
    );
    return result.rows[0];
  }

  async eliminar(id) {
    await pool.query('DELETE FROM distritos WHERE iddistrito = $1', [id]);
  }
}

module.exports = new DistritoRepository();
