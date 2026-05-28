const pool = require('../config/database');

class ClienteRepository {
    async listarTodos() {
        const result = await pool.query(
            `SELECT idcliente, nombre, ci, telefono, email
            FROM clientes
            ORDER BY idcliente`);
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await pool.query(
            `SELECT idcliente, nombre, ci, telefono, email
            FROM clientes
            WHERE idcliente = $1`, [id]);
        return result.rows[0];
    }

    async crear(datos) {

        const valores = [];
        const campos = [];
    
        if (datos.nombre !== undefined) {
            campos.push(`nombre`);
            valores.push(datos.nombre);
        }

        if (datos.dni !== undefined) {
            campos.push(`dni = $${contador}`);
            valores.push(datos.dni);
        }

        if (datos.email !== undefined) {
            campos.push(`email = $${contador}`);
            valores.push(datos.email);
        }

        if (datos.telefono !== undefined) {
            campos.push(`telefono = $${contador}`);
            valores.push(datos.telefono);
        }
        
        if (campos.length === 0) {
            throw new Error('No hay datos para crear el cliente');
        }
        
        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO clientes (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
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

        if (datos.dni !== undefined) {
            sets.push(`dni = $${contador}`);
            valores.push(datos.dni);
            contador++;
        }

        if (datos.email !== undefined) {
            sets.push(`email = $${contador}`);
            valores.push(datos.email);
            contador++;
        }

        if (datos.telefono !== undefined) {
            sets.push(`telefono = $${contador}`);
            valores.push(datos.telefono);
            contador++;
        }
            
        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        valores.push(id);
        const query = `UPDATE clientes SET ${sets.join(', ')} WHERE idcliente = $${contador} RETURNING *`;
        
        const result = await pool.query(query, valores);
        return result.rows[0];
    }
        
    async buscarPorNombre(nombre) {
        const result = await pool.query(
            `SELECT idcliente, nombre, ci, telefono, email
            FROM clientes
            WHERE nombre = $1`, [nombre]);
        return result.rows[0];
    }

    async eliminar(id) {
        await pool.query('DELETE FROM clientes WHERE idcliente = $1', [id]);
        return result.rows[0];
    }
}

module.exports = new ClienteRepository();
