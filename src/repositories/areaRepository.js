const pool = require('../config/database');

class AreaRepository {
    async listarTodos() {
        const result = await pool.query('SELECT * FROM areas');
        return result.rows;
    }

    async buscarPorId(id){
        const result = await pool.query('SELECT * FROM areas WHERE idarea = $1', [id]);
        return result.rows[0];
    }

    async buscarPorNombre(nombre){
        const result = await pool.query('SELECT * FROM areas WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    async guardar(datos){
        const result = await pool.query('INSERT INTO areas (nombre, cantidadpersonalfijo) VALUES ($1, 0) RETURNING *', [datos.nombre]);
        return result.rows[0];
    }

    async modificarNombre(id, datos){
        const result = await pool.query('UPDATE areas SET nombre = $1 WHERE idarea = $2 RETURNING *', [datos.nombre, id]);
        return result.rows[0];
    }

    async eliminar(id){
        await pool.query('DELETE FROM areas WHERE idarea = $1', [id]);
    }
}

module.exports = new AreaRepository();