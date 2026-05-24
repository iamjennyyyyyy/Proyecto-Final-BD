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

    async buscarPorNombre(nombre) {
        const result = await pool.query('SELECT * FROM areas WHERE LOWER(nombre) LIKE LOWER($1)', [`%${nombre}%`]);
        return result.rows[0];
    }

    async crear(datos) {
        const valores = [];
        const campos = [];
        let contador = 1;
        
        if (datos.nombre !== undefined) {
            campos.push(`nombre`);
            valores.push(datos.nombre);
        }
        
        if (datos.cantidadpersonalfijo !== undefined) {
            campos.push(`cantidadpersonalfijo`);
            valores.push(datos.cantidadpersonalfijo);
        }
        
        if (campos.length === 0) {
            throw new Error('No hay datos para crear el área');
        }
        
        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO areas (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
        const result = await pool.query(query, valores);
        return result.rows[0];
    }
    
    async actualizar(id, datos) {
        const valores = [];
        const sets = [];
        let contador = 1;
        
        if (datos.nombre !== undefined) {
            sets.push(`nombre = $${contador}`);
            valores.push(datos.nombre);
            contador++;
        }
        
        if (datos.cantidadpersonalfijo !== undefined) {
            sets.push(`cantidadpersonalfijo = $${contador}`);
            valores.push(datos.cantidadpersonalfijo);
            contador++;
        }
        
        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        valores.push(id);
        const query = `UPDATE areas SET ${sets.join(', ')} WHERE idarea = $${contador} RETURNING *`;
        
        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async eliminar(id){
        await pool.query('DELETE FROM areas WHERE idarea = $1', [id]);
    }
}

module.exports = new AreaRepository();