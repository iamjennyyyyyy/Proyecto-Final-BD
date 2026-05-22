const pool = require('../config/database');

class PaqueteRepository {
  async listarTodos() {
    const result = await pool.query('SELECT * FROM paquetes ORDER BY idpaquete');
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM paquetes WHERE idpaquete = $1', [id]);
    return result.rows[0];
  }

  async crear(datos) {
    const campos = [];
    const valores = [];
    if (datos.nombre !== undefined) { campos.push('nombre'); valores.push(datos.nombre); }
    if (datos.precio !== undefined) { campos.push('precio'); valores.push(datos.precio); }
    if (datos.duraciontotal !== undefined) { campos.push('duraciontotal'); valores.push(datos.duraciontotal); }
    if (datos.descuento !== undefined) { campos.push('descuento'); valores.push(datos.descuento); }
    const ph = valores.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(`INSERT INTO paquetes (${campos.join(', ')}) VALUES (${ph}) RETURNING *`, valores);
    return result.rows[0];
  }

  async actualizar(id, datos) {
    const sets = [];
    const valores = [];
    let i = 1;
    if (datos.nombre !== undefined) { sets.push(`nombre = $${i++}`); valores.push(datos.nombre); }
    if (datos.precio !== undefined) { sets.push(`precio = $${i++}`); valores.push(datos.precio); }
    if (datos.duraciontotal !== undefined) { sets.push(`duraciontotal = $${i++}`); valores.push(datos.duraciontotal); }
    if (datos.descuento !== undefined) { sets.push(`descuento = $${i++}`); valores.push(datos.descuento); }
    valores.push(id);
    const result = await pool.query(`UPDATE paquetes SET ${sets.join(', ')} WHERE idpaquete = $${i} RETURNING *`, valores);
    return result.rows[0];
  }

  async eliminar(id) {
    await pool.query('DELETE FROM paquetes WHERE idpaquete = $1', [id]);
  }
}

module.exports = new PaqueteRepository();
