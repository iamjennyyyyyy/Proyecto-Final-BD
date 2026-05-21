const pool = require('../config/database');

class ClienteRepository {
  async listarTodos() {
    const result = await pool.query('SELECT * FROM clientes ORDER BY idcliente');
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM clientes WHERE idcliente = $1', [id]);
    return result.rows[0];
  }

  async guardar({ nombre }) {
    const result = await pool.query(
      'INSERT INTO clientes (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  }

  async eliminar(id) {
    await pool.query('DELETE FROM clientes WHERE idcliente = $1', [id]);
  }
}

module.exports = new ClienteRepository();
