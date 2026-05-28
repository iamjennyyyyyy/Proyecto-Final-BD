const pool = require('../config/database');

class PaqueteVendidoRepository {
  async listarTodos() {
    const result = await pool.query(`
      SELECT pv.idpaquetevendido, pv.idpaquete, pv.idcliente,
      p.nombre AS paquete_nombre, p.duraciontotal, p.precio,
      c.nombre AS cliente_nombre,
      pv.fechacompra, pv.fechainicio, pv.fechafin
      FROM paquetevendido pv
      LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
      LEFT JOIN clientes c ON pv.idcliente = c.idcliente
      ORDER BY pv.idpaquetevendido`);
    return result.rows;
  }

  async buscarPorId(id) {
    const result = await pool.query(`
      SELECT pv.idpaquetevendido, pv.idpaquete, pv.idcliente,
      p.nombre AS paquete_nombre, p.duraciontotal, p.precio,
      c.nombre AS cliente_nombre,
      pv.fechacompra, pv.fechainicio, pv.fechafin
      FROM paquetevendido pv
      LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
      LEFT JOIN clientes c ON pv.idcliente = c.idcliente
      WHERE pv.idpaquetevendido = $1`, [id]);
    return result.rows[0];
  }

  async crear(datos) {
    const valores = [];
    const campos = [];
    
    if (datos.idpaquete !== undefined) {
      campos.push(`idpaquete`);
      valores.push(datos.idpaquete);
    }
    
    if (datos.idcliente !== undefined) {
      campos.push(`idcliente`);
      valores.push(datos.idcliente);
    }

    if (datos.precio !== undefined) {
      campos.push(`precio`);
      valores.push(datos.precio);
    }
    
    if (datos.fechacompra !== undefined) {
      campos.push(`fechacompra`);
      valores.push(datos.fechacompra);
    }
    
    if (datos.fechainicio !== undefined) {
      campos.push(`fechainicio`);
      valores.push(datos.fechainicio);
    }
    
    if (datos.fechafin !== undefined) {
      campos.push(`fechafin`);
      valores.push(datos.fechafin);
    }
    
    if (campos.length === 0) {
      throw new Error('No hay datos para crear la venta del paquete');
    }
    
    const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO paquetevendido (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    const result = await pool.query(query, valores);
    return result.rows[0];
  }

  async actualizar(id, datos) {
    const valores = [];
    const sets = [];
    let contador = 1;
    
    if (datos.idpaquete !== undefined) {
      sets.push(`idpaquete = $${contador}`);
      valores.push(datos.idpaquete);
      contador++;
    }
    
    if (datos.idcliente !== undefined) {
      sets.push(`idcliente = $${contador}`);
      valores.push(datos.idcliente);
      contador++;
    }
    
    if (datos.fechacompra !== undefined) {
      sets.push(`fechacompra = $${contador}`);
      valores.push(datos.fechacompra);
      contador++;
    }

    if (datos.precio !== undefined) {
      sets.push(`precio = $${contador}`);
      valores.push(datos.precio);
      contador++;
    }
    
    if (datos.fechainicio !== undefined) {
      sets.push(`fechainicio = $${contador}`);
      valores.push(datos.fechainicio);
      contador++;
    }
    
    if (datos.fechafin !== undefined) {
      sets.push(`fechafin = $${contador}`);
      valores.push(datos.fechafin);
      contador++;
    }
    
    if (sets.length === 0) {
      throw new Error('No hay datos para actualizar');
    }
    
    valores.push(id);
    const query = `UPDATE paquetevendido SET ${sets.join(', ')} WHERE idpaquetevendido = $${contador} RETURNING *`;
    
    const result = await pool.query(query, valores);
    return result.rows[0];
  }

  async eliminar(id) {
    const result = await pool.query('DELETE FROM paquetevendido WHERE idpaquetevendido = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new PaqueteVendidoRepository();
