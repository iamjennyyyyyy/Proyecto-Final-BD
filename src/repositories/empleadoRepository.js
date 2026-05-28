const pool = require('../config/database');

class EmpleadoRepository{
    async listarTodos() {
        const result = await pool.query(
            `SELECT e.idempleado, e.nombre, e.dni, e.especialidad, e.esfijo,
            e.horastrabajo, e.direccion, e.telefono, e.iddistrito,
            d.nombre AS distrito_nombre,
            a.nombre AS area_nombre
            FROM empleados e
            LEFT JOIN distritos d ON d.iddistrito = e.iddistrito
            LEFT JOIN empleadosporarea epa ON epa.idempleado = e.idempleado
            LEFT JOIN areas a ON a.idarea = epa.idarea`);
        return result.rows;
    }

    async buscarPorId(id){
        const result = await pool.query(
            `SELECT e.idempleado, e.nombre, e.dni, e.especialidad, e.esfijo,
            e.horastrabajo, e.direccion, e.telefono, e.iddistrito,
            d.nombre AS distrito_nombre,
            a.nombre AS area_nombre
            FROM empleados e
            LEFT JOIN distritos d ON d.iddistrito = e.iddistrito
            LEFT JOIN empleadosporarea epa ON epa.idempleado = e.idempleado
            LEFT JOIN areas a ON a.idarea = epa.idarea
            WHERE e.idempleado = $1`, [id]);
        return result.rows[0];
    }

    async buscarPorNombre(nombre) {
        const result = await pool.query(
            `SELECT e.idempleado, e.nombre, e.dni, e.especialidad, e.esfijo,
            e.horastrabajo, e.direccion, e.telefono, e.iddistrito,
            d.nombre AS distrito_nombre,
            a.nombre AS area_nombre
            FROM empleados e
            LEFT JOIN distritos d ON d.iddistrito = e.iddistrito
            LEFT JOIN empleadosporarea epa ON epa.idempleado = e.idempleado
            LEFT JOIN areas a ON a.idarea = epa.idarea
            WHERE e.nombre = $1`, [nombre]);
        return result.rows[0];
    }

    async buscarPorDNI(dni) {
        const result = await pool.query(
            `SELECT e.idempleado, e.nombre, e.dni, e.especialidad, e.esfijo,
            e.horastrabajo, e.direccion, e.telefono, e.iddistrito,
            d.nombre AS distrito_nombre,
            a.nombre AS area_nombre
            FROM empleados e
            LEFT JOIN distritos d ON d.iddistrito = e.iddistrito
            LEFT JOIN empleadosporarea epa ON epa.idempleado = e.idempleado
            LEFT JOIN areas a ON a.idarea = epa.idarea
            WHERE e.dni = $1`, [dni]);
        return result.rows[0];
    }

    async crear(datos) {
        const valores = [];
        const campos = [];
        
        if (datos.nombre !== undefined) {
            campos.push(`nombre`);
            valores.push(datos.nombre);
        }
        
        if (datos.especialidad !== undefined) {
            campos.push(`especialidad`);
            valores.push(datos.especialidad);
        }
        
        if (datos.horastrabajo !== undefined) {
            campos.push(`horastrabajo`);
            valores.push(datos.horastrabajo);
        }
        
        if (datos.direccion !== undefined) {
            campos.push(`direccion`);
            valores.push(datos.direccion);
        }
        
        if (datos.dni !== undefined) {
            campos.push(`dni`);
            valores.push(datos.dni);
        }
        
        if (datos.telefono !== undefined) {
            campos.push(`telefono`);
            valores.push(datos.telefono);
        }
        
        if (datos.iddistrito !== undefined) {
            campos.push(`iddistrito`);
            valores.push(datos.iddistrito);
        }
        
        if (datos.esfijo !== undefined) {
            campos.push(`esfijo`);
            valores.push(datos.esfijo);
        }
        
        if (campos.length === 0) {
            throw new Error('No hay datos para crear el empleado');
        }
        
        const placeholders = valores.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO empleados (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
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
        
        if (datos.especialidad !== undefined) {
            sets.push(`especialidad = $${contador}`);
            valores.push(datos.especialidad);
            contador++;
        }
        
        if (datos.horastrabajo !== undefined) {
            sets.push(`horastrabajo = $${contador}`);
            valores.push(datos.horastrabajo);
            contador++;
        }
        
        if (datos.direccion !== undefined) {
            sets.push(`direccion = $${contador}`);
            valores.push(datos.direccion);
            contador++;
        }
        
        if (datos.dni !== undefined) {
            sets.push(`dni = $${contador}`);
            valores.push(datos.dni);
            contador++;
        }
        
        if (datos.telefono !== undefined) {
            sets.push(`telefono = $${contador}`);
            valores.push(datos.telefono);
            contador++;
        }
        
        if (datos.iddistrito !== undefined) {
            sets.push(`iddistrito = $${contador}`);
            valores.push(datos.iddistrito);
            contador++;
        }
        
        if (datos.esfijo !== undefined) {
            sets.push(`esfijo = $${contador}`);
            valores.push(datos.esfijo);
            contador++;
        }
        
        if (sets.length === 0) {
            throw new Error('No hay datos para actualizar');
        }
        
        valores.push(id);
        const query = `UPDATE empleados SET ${sets.join(', ')} WHERE idempleado = $${contador} RETURNING *`;

        const result = await pool.query(query, valores);
        return result.rows[0];
    }

    async eliminar(id){
        const result = await pool.query(`DELETE FROM empleados WHERE idempleado = $1 RETURNING *`, [id]);
        return result.rows[0];
    }
}

module.exports = new EmpleadoRepository();