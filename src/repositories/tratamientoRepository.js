// 🔗 CONEXIÓN 2: Importo la configuración de la BD
const pool = require('../config/database');

// 🔗 CONEXIÓN 3: Importo el Model
const Tratamiento = require('../models/Tratamiento');

class TratamientoRepository {
  
  async guardar(datos) {
    // Uso el Model para crear el objeto
    const tratamiento = new Tratamiento(datos);
    
    // Uso el Model para validar
    tratamiento.validar();
    
    // Guardo en BD
    const query = 'INSERT INTO tratamientos (nombre, precio, duracion) VALUES ($1, $2, $3) RETURNING *';
    const values = [tratamiento.nombre, tratamiento.precio, tratamiento.duracion];
    
    const resultado = await pool.query(query, values);
    return resultado.rows[0];
  }
  
  async listarTodos() {
    const query = 'SELECT * FROM tratamientos ORDER BY id';
    const resultado = await pool.query(query);
    return resultado.rows;
  }
  
  async buscarPorId(id) {
    const query = 'SELECT * FROM tratamientos WHERE id = $1';
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0];
  }
  
  async eliminar(id) {
    const query = 'DELETE FROM tratamientos WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

// 🔗 CONEXIÓN 4: Exporto el repository para que otros lo usen
module.exports = new TratamientoRepository();