const pool = require('../config/database');

class TratamientoRepository {
  async listarTodos() {
    const result = await pool.query('SELECT * FROM tratamientos ORDER BY idtratamiento');
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM tratamientos WHERE idtratamiento = $1', [id]);
    return result.rows[0];
  }

  async guardar({ nombre, precio, duracion, descripcion, idCategoria }) {
    const result = await pool.query(
      'INSERT INTO tratamientos (nombre, precio, duracion, descripcion, idcategoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, precio, duracion, descripcion || null, idCategoria]
    );
    return result.rows[0];
  }

  async eliminar(id) {
    await pool.query('DELETE FROM tratamientos WHERE idtratamiento = $1', [id]);
  }
}

module.exports = new TratamientoRepository();
