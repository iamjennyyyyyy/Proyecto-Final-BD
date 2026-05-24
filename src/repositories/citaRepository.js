const pool = require('../config/database');

class CitaRepository {
    async listarTodos() {
        const result = await pool.query('SELECT * FROM citas');
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await pool.query('SELECT * FROM citas WHERE idcita = $1', [id]);
        return result.rows[0];
    }

    async buscarPorCliente(idCliente) {
        const result = await pool.query('SELECT * FROM citas WHERE idcliente = $1', [idCliente]);
        return result.rows;
    }

    async buscarPorEmpleado(idEmpleado) {
        const result = await pool.query('SELECT * FROM citas WHERE idempleado = $1', [idEmpleado]);
        return result.rows;
    }

    async buscarPorFecha(fecha) {
        const result = await pool.query('SELECT * FROM citas WHERE fecha = $1', [fecha]);
        return result.rows;
    }

    async crear(datos) {
        const valores = [];
        const campos = [];

        if (datos.idCliente !== undefined) {
            campos.push('idcliente');
            valores.push(datos.idCliente);
        }

        if (datos.idTratamiento !== undefined) {
            campos.push('idtratamiento');
            valores.push(datos.idTratamiento);
        }

        if (datos.fecha !== undefined) {
            campos.push('fecha');
            valores.push(datos.fecha);
        }

        if (datos.hora !== undefined) {
            campos.push('hora');
            valores.push(datos.hora);
        }

        if (datos.observaciones !== undefined) {
            campos.push('observaciones');
            valores.push(datos.observaciones);
        }

        if (datos.idPaqVendido !== undefined) {
            campos.push('idpaquetevendido');
            valores.push(datos.idPaqVendido);
        }

        if (datos.idEmpleado !== undefined) {
            campos.push('idempleado');
            valores.push(datos.idEmpleado);
        }

        if (datos.estado !== undefined) {
            campos.push('estado');
            valores.push(datos.estado);
        }

        if (campos.length === 0) {
            throw new Error('No hay datos para crear la cita');
        }

        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO citas (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async modificar(id, datos) {
        const valores = [];
        const sets = [];
        let contador = 1;

        if (datos.idCliente !== undefined) {
            sets.push(`idcliente = $${contador}`);
            valores.push(datos.idCliente);
            contador++;
        }

        if (datos.idTratamiento !== undefined) {
            sets.push(`idtratamiento = $${contador}`);
            valores.push(datos.idTratamiento);
            contador++;
        }

        if (datos.fecha !== undefined) {
            sets.push(`fecha = $${contador}`);
            valores.push(datos.fecha);
            contador++;
        }

        if (datos.hora !== undefined) {
            sets.push(`hora = $${contador}`);
            valores.push(datos.hora);
            contador++;
        }

        if (datos.observaciones !== undefined) {
            sets.push(`observaciones = $${contador}`);
            valores.push(datos.observaciones);
            contador++;
        }

        if (datos.idPaqVendido !== undefined) {
            sets.push(`idpaquetevendido = $${contador}`);
            valores.push(datos.idPaqVendido);
            contador++;
        }

        if (datos.idEmpleado !== undefined) {
            sets.push(`idempleado = $${contador}`);
            valores.push(datos.idEmpleado);
            contador++;
        }

        if (datos.estado !== undefined) {
            sets.push(`estado = $${contador}`);
            valores.push(datos.estado);
            contador++;
        }

        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }

        valores.push(id);
        const query = `UPDATE citas SET ${sets.join(', ')} WHERE idcita = $${contador} RETURNING *`;

        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async eliminar(id) {
        await pool.query('DELETE FROM citas WHERE idcita = $1', [id]);
    }
}

module.exports = new CitaRepository();