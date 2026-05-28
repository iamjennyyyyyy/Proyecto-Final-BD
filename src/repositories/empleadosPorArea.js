const pool = require('../config/database');

class empleadosPorArea{

    async empleadosPorArea(idArea){
        const result = await pool.query(
            `SELECT e.nombre AS "Nombre",
            e.dni AS "Carnet de Identidad",
            e.especialidad AS "Especialidad",
            e.esfijo AS "Es Fijo",
            e.horastrabajo AS "Horas de Trabajo",
            d.nombre AS "Distrito"
            FROM empleados e
            INNER JOIN empleadosPorArea epa ON epa.idempleado = e.idempleado
            INNER JOIN distritos d ON d.iddistrito = e.iddistrito
            WHERE epa.idarea = $1
            ORDER BY e.nombre`, [idArea]
        );
        return result.rows;
    }

    async areasDeUnEmpleado(idEmpleado){
        const result = await pool.query(
            `SELECT a.nombre AS "Nombre"
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

