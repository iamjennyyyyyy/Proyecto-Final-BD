const pool = require('../config/database');

class empleadosPorArea{

    async empleadosPorArea(idArea){
        const result = await pool.query(
            `SELECT nombre, dni, especialidad, esfijo, horastrabajo, direccion, telefono, area_nombre
            WHERE epa.idarea = $1
            ORDER BY e.nombre`, [idArea]
        );
        return result.rows;
    }

    async areasDeUnEmpleado(idEmpleado){
        const result = await pool.query(
            `SELECT a.nombre
            FROM areas a
            INNER JOIN empleadosPorArea epa ON epa.idarea = a.idarea
            WHERE epa.idempleado = $1
            ORDER BY a.nombre`, [idEmpleado]
        );
        return result.rows;
    }

    async asignarEmpleadoAUnArea(idEmpleado, idArea){
        const result = await pool.query(
            `INSERT INTO empleadosporarea (idempleado, idarea)
            VALUES ($1, $2) RETURNING *`, [idEmpleado, idArea]
        );
        return result.rows[0];
    }

    async desasignarEmpleadoDeUnArea(idEmpleado, idArea){
        const result = await pool.query(
            `DELETE FROM empleadosporarea
            WHERE idempleado = $1 AND idarea = $2 RETURNING *`, [idEmpleado, idArea]
        );
        return result.rows[0];
    }

    async existeRelacion(idEmpleado, idArea){
        const result = await pool.query(
            `SELECT *
            FROM empleadosporarea
            WHERE idempleado = $1 AND idarea = $2`, [idEmpleado, idArea]
        );
        return result.rows[0];
    }
}

module.exports = new empleadosPorArea();

