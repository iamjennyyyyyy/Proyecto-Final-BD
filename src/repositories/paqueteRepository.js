const pool = require('../config/database');

class paqueteRepository{
    async listarTodos(){
        const result = await pool.query('SELECT * FROM paquetes');
        return result.rows;
    }

    async buscarPorId(id){
        const result = await pool.query('SELECT * FROM paquetes WHERE idpaquete = $1', [id]);
        return result.rows[0];
    }

    async buscarPorNombre(nombre) {
        const result = await pool.query('SELECT * FROM paquetes WHERE LOWER(nombre) LIKE LOWER($1)', [`%${nombre}%`]);
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
        
        if (datos.duraciontotal !== undefined) {
            campos.push(`duraciontotal`);
            valores.push(datos.duraciontotal);
        }
        
        if (campos.length === 0) {
            throw new Error('No hay datos para crear el paquete');
        }
        
        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO paquetes (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
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
        
        if (datos.duraciontotal !== undefined) {
            sets.push(`duraciontotal = $${contador}`);
            valores.push(datos.duraciontotal);
            contador++;
        }

        if (datos.precio !== undefined) {
            sets.push(`precio = $${contador}`);
            valores.push(datos.precio);
            contador++;
        }
        
        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        valores.push(id);
        const query = `UPDATE paquetes SET ${sets.join(', ')} WHERE idpaquete = $${contador} RETURNING *`;
        
        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async eliminar(id){
        await pool.query('DELETE FROM paquetes WHERE idpaquete = $1', [id]);
    }
    
}
module.exports = new paqueteRepository();  // ✅ Exporta una instancia