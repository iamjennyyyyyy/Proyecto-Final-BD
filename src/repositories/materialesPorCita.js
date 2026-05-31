const pool = require('../config/database');

class materialesPorCitaRepository{

    async buscarMaterialesPorCita(idCita){
        const result = await pool.query(
            `SELECT m.idmaterial,
            m.nombre as nombrematerial,
            mc.cantidadmaterialutilizado
            FROM materiales m
            INNER JOIN materialesporcita mc ON mc.idmaterial = m.idmaterial
            WHERE mc.idcita = $1
            ORDER BY m.nombre`, [idCita]
        );
        return result.rows;
    }

    async buscarCitasPorMaterial(idMaterial){
        const result = await pool.query(
            `SELECT c.idcita,
            c.fecha,
            c.hora,
            mc.cantidadmaterialutilizado
            FROM citas c
            INNER JOIN materialesporcita mc ON mc.idcita = c.idcita
            WHERE mc.idmaterial = $1
            ORDER BY c.fecha DESC`, [idMaterial]
        );
        return result.rows;
    }

    async asignarMaterialACita(idCita, idMaterial, cantidadmaterialutilizado){
        const result = await pool.query(
            `INSERT INTO materialesporcita (idcita, idmaterial, cantidadmaterialutilizado)
            VALUES ($1, $2, $3) RETURNING *`, [idCita, idMaterial, cantidadmaterialutilizado]
        );
        return result.rows[0];
    }

    async desasignarMaterialDeCita(idMaterial, idCita){
        const result = await pool.query(
            `DELETE FROM materialesporcita
            WHERE idmaterial = $1 AND idcita = $2 RETURNING *`, [idMaterial, idCita]
        );
        return result.rows[0];
    }

    async actualizarCantidadMaterial(idMaterial, idCita, cantidadmaterialutilizado){
        const result = await pool.query(
            `UPDATE materialesporcita
            SET cantidadmaterialutilizado = $1
            WHERE idmaterial = $2 AND idcita = $3 RETURNING *`, [cantidadmaterialutilizado, idMaterial, idCita]
        );
        return result.rows[0];
    }

    async existeRelacion(idMaterial, idCita){
        const result = await pool.query(
            `SELECT *
            FROM materialesporcita
            WHERE idcita = $1 AND idmaterial = $2`, [idCita, idMaterial]
        );
        return result.rows[0];
    }
}

module.exports = new materialesPorCitaRepository();