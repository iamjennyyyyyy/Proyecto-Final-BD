const pool = require('../config/database');

class ReporteRepository {
    
    async generarIngresosPorMes(fechaMes) {
        const result = await pool.query(
            `SELECT * FROM generar_ingresos_por_mes($1)`,
            [fechaMes]
        );
        return result.rows[0];
    }
    
    async obtenerTop3Tratamientos() {
        const result = await pool.query(
            `SELECT * FROM vw_top_3_tratamientos_mas_solicitados`
        );
        return result.rows;
    }

    async obtenerEmpleadosPorCliente(idCLiente) {
        const result = await pool.query(
            `SELECT * FROM buscar_empleados_por_cliente($1)`, [idCLiente]
        );
        return result.rows;
    }

    async buscarServiciosPorClientePorIntervalo(idCLiente, fecha){
        const result = await pool.query(
            `SELECT * from buscarServiciosPorClientePorIntervalo($1, $2)`, [idCLiente, fecha]
        )
        return result.rows;
    }
}

module.exports = new ReporteRepository();