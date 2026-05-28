const pool = require('../config/database');

class contenidoPaquete{

    async tratamientosPorPaquete(idPaquete){
        const result = await pool.query(
            `SELECT t.nombre AS "Nombre",
            c.nombre AS "Categoria",
            t.precio AS "Precio",
            t.duracion AS "Duracion",
            t.descripcion AS "Descripcion"
            FROM tratamientos t
            INNER JOIN contenidoPaquete cp ON cp.idtratamiento = t.idtratamiento
            INNER JOIN categorias c ON c.idcategoria = t.idcategoria
            WHERE cont.idpaquete = $1
            ORDER BY t.nombre`, [idPaquete]
        );
        return result.rows;
    }

    async paquetesConTratamiento(idTratamiento){
        const result = await pool.query(
            `SELECT p.nombre AS "Nombre",
            p.precio AS "Precio",
            p.duraciontotal AS "Duracion Total"
            FROM paquetes p
            INNER JOIN contenidopaquete cp cont ON cp.idpaquete = p.idpaquete
            WHERE cont.idtratamiento = $1
            ORDER BY p.nombre`, [idTratamiento]
        );
        return result.rows;
    }

    async asignarTratamientoAlPaquete(idTratamiento, idPaquete){
        const result = await pool.query(
            `INSERT INTO contenidoPaquete (idtratamiento, idpaquete)
            VALUES ($1, $2) RETURNING *`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }

    async desasignarTratamientoDelPaquete(idTratamiento, idPaquete){
        const result = await pool.query(
            `DELETE FROM contenidoPaquete
            WHERE idtratamiento = $1 AND idpaquete = $2 RETURNING *`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }

    async existeRelacion(idTratamiento, idPaquete){
        const result = await pool.query(
            `SELECT *
            FROM contenidoPaquete
            WHERE idtratamiento = $1 AND idpaquete = $2`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }
}

module.exports = new contenidoPaquete();

