const pool = require('../config/database');

class TratamientoRepository {
    async listarTodos() {
        const result = await pool.query(
            `SELECT t.idtratamiento, t.nombre, t.precio, t.duracion, t.descripcion,
            c.nombre AS categoria_nombre
            FROM tratamientos t
            LEFT JOIN categorias c ON c.idcategoria = t.idcategoria
            ORDER BY idtratamiento`);
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await pool.query(
            `SELECT t.idtratamiento, t.nombre, t.precio, t.duracion, t.descripcion,
            c.nombre AS categoria_nombre
            FROM tratamientos t
            LEFT JOIN categorias c ON c.idcategoria = t.idcategoria
            WHERE idtratamiento = $1`, [id]);
        return result.rows[0];
    }

    async crear(datos) {
        const valores = [];
        const campos = [];
        
        if (datos.nombre !== undefined) {
            campos.push(`nombre`);
            valores.push(datos.nombre);
        }
        
        if (datos.precio !== undefined) {
            campos.push(`precio`);
            valores.push(datos.precio);
        }
        
        if (datos.descripcion !== undefined) {
            campos.push(`descripcion`);
            valores.push(datos.descripcion);
        }
        
        if (datos.duracion !== undefined) {
            campos.push(`duracion`);
            valores.push(datos.duracion);
        }
        
        if (datos.idcategoria !== undefined) {
            campos.push(`idcategoria`);
            valores.push(datos.idcategoria);
        }
        
        if (campos.length === 0) {
            throw new Error('No hay datos para crear el tratamiento');
        }
        
        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO tratamientos (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
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
        
        if (datos.precio !== undefined) {
            sets.push(`precio = $${contador}`);
            valores.push(datos.precio);
            contador++;
        }
        
        if (datos.descripcion !== undefined) {
            sets.push(`descripcion = $${contador}`);
            valores.push(datos.descripcion);
            contador++;
        }
        
        if (datos.duracion !== undefined) {
            sets.push(`duracion = $${contador}`);
            valores.push(datos.duracion);
            contador++;
        }
        
        if (datos.idcategoria !== undefined) {
            sets.push(`idcategoria = $${contador}`);
            valores.push(datos.idcategoria);
            contador++;
        }
        
        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        valores.push(id);
        const query = `UPDATE tratamientos SET ${sets.join(', ')} WHERE idtratamiento = $${contador} RETURNING *`;
        
        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async buscarPorNombre(nombre) {
        const result = await pool.query(
            `SELECT t.idtratamiento, t.nombre, t.precio, t.duracion, t.descripcion,
            c.nombre AS categoria_nombre
            FROM tratamientos t
            LEFT JOIN categorias c ON c.idcategoria = t.idcategoria
            WHERE nombre = $1`, [nombre]);
        return result.rows[0];
    }

    async eliminar(id) {
        const result = await pool.query('DELETE FROM tratamientos WHERE idtratamiento = $1', [id]);
        return result.rows[0];
    }
}

module.exports = new TratamientoRepository();
