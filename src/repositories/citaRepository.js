const pool = require('../config/database');

class CitaRepository {
    async listarTodos() {
        const result = await pool.query(
            `SELECT * from vw_citas`);
        return result.rows;
    }

    async buscarPorId(id) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE idcita = $1`, [id]);
        return result.rows[0];
    }

    async buscarPorTratamiento(idTratamiento) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE idtratamiento = $1`, [idTratamiento]);
        return result.rows;
    }

    async buscarPorPaquete(idPaqueteVendido) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE idpaquetevendido = $1`, [idPaqueteVendido]);
        return result.rows;
    }

    async buscarPorEstado(estado) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE LOWER(estado) = LOWER($1)`, [estado]);
        return result.rows;
    }

    async buscarPorCliente(idCliente) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE idcliente = $1`, [idCliente]);
        return result.rows;
    }

    async buscarPorEmpleado(idEmpleado) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE idempleado = $1`, [idEmpleado]);
        return result.rows;
    }

    async buscarPorFecha(fecha) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE fecha = $1`, [fecha]);
        return result.rows;
    }

    async buscarPorIntervaloFechas(fecha1, fecha2) {
        const result = await pool.query(
            `SELECT * from vw_citas
            WHERE fecha BETWEEN $1 AND $2`, [fecha1, fecha2]);
        return result.rows;
    }

    async buscarPorIntervaloPrecio(precioMin, precioMax) {
        const result = await pool.query(
            `SELECT * FROM vw_citas
            WHERE precio BETWEEN $1 AND $2`, [precioMin, precioMax]);
        return result.rows;
    }

    async buscarEmpleadosPorCliente(idCliente) {
        const result = await pool.query(
            `SELECT e.nombre
            from citas c
            join empleados e on c.idempleado = e.idempleado
            WHERE c.idCliente =$1 and estado = 'realizada'`, [idCliente]);
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

        if (datos.precio !== undefined) {
            campos.push('precio');
            valores.push(datos.precio);
        }

        if (campos.length === 0) {
            throw new Error('No hay datos para crear la cita');
        }

        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO citas (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async actualizar(id, datos) {
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

        if (datos.precio !== undefined) {
            sets.push(`precio = $${contador}`);
            valores.push(datos.precio);
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
        const result = await pool.query('DELETE FROM citas WHERE idcita = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new CitaRepository();
