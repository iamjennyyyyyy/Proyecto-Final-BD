const pool = require('../config/database');

class PaqueteVendidoRepository {
  async listarTodos() {
    const result = await pool.query(`
      SELECT pv.*, p.nombre AS paquete_nombre, c.nombre AS cliente_nombre
      FROM paquetevendido pv
      LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
      LEFT JOIN clientes c ON pv.idcliente = c.idcliente
      ORDER BY pv.idpaquetevendido
    `);
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query(`
      SELECT pv.*, p.nombre AS paquete_nombre, c.nombre AS cliente_nombre
      FROM paquetevendido pv
      LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
      LEFT JOIN clientes c ON pv.idcliente = c.idcliente
      WHERE pv.idpaquetevendido = $1
    `, [id]);
    return result.rows[0];
  }

  async crear(datos) {
    const { idpaquete, idcliente, fechacompra, fechainicio, fechafin } = datos;
    const result = await pool.query(
      'INSERT INTO paquetevendido (idpaquete, idcliente, fechacompra, fechainicio, fechafin) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [idpaquete, idcliente, fechacompra, fechainicio, fechafin]
    );
    return result.rows[0];
  }

  async actualizar(id, datos) {
    const sets = [];
    const valores = [];
    let i = 1;
    if (datos.idpaquete !== undefined) { sets.push(`idpaquete = $${i++}`); valores.push(datos.idpaquete); }
    if (datos.idcliente !== undefined) { sets.push(`idcliente = $${i++}`); valores.push(datos.idcliente); }
    if (datos.fechacompra !== undefined) { sets.push(`fechacompra = $${i++}`); valores.push(datos.fechacompra); }
    if (datos.fechainicio !== undefined) { sets.push(`fechainicio = $${i++}`); valores.push(datos.fechainicio); }
    if (datos.fechafin !== undefined) { sets.push(`fechafin = $${i++}`); valores.push(datos.fechafin); }
    valores.push(id);
    const result = await pool.query(`UPDATE paquetevendido SET ${sets.join(', ')} WHERE idpaquetevendido = $${i} RETURNING *`, valores);
    return result.rows[0];
  }

  async eliminar(id) {
    await pool.query('DELETE FROM paquetevendido WHERE idpaquetevendido = $1', [id]);
  }
}

module.exports = new PaqueteVendidoRepository();
