const pool = require('../config/database');

class contenidoPaquete{

    async tratamientosPorPaquete(idPaquete){
        const result = await pool.query(
            `SELECT t.idtratamiento,
            t.nombre,
            c.nombre,
            t.precio,
            t.duracion,
            t.descripcion
            FROM tratamientos t
            INNER JOIN contenidopaquete cp ON cp.idtratamiento = t.idtratamiento
            INNER JOIN categorias c ON c.idcategoria = t.idcategoria
            WHERE cont.idpaquete = $1
            ORDER BY t.nombre`, [idPaquete]
        );
        return result.rows;
    }

    async paquetesConTratamiento(idTratamiento){
        const result = await pool.query(
            `SELECT p.idpaquete,
            p.nombre,
            p.precio,
            p.duraciontotal
            FROM paquetes p
            INNER JOIN contenidopaquete cp cont ON cp.idpaquete = p.idpaquete
            WHERE cont.idtratamiento = $1
            ORDER BY p.nombre`, [idTratamiento]
        );
        return result.rows;
    }

    async asignarTratamientoAlPaquete(idTratamiento, idPaquete){
        const result = await pool.query(
            `INSERT INTO contenidopaquete (idtratamiento, idpaquete)
            VALUES ($1, $2) RETURNING *`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }

    async desasignarTratamientoDelPaquete(idTratamiento, idPaquete){
        const result = await pool.query(
            `DELETE FROM contenidopaquete
            WHERE idtratamiento = $1 AND idpaquete = $2 RETURNING *`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }

    async existeRelacion(idTratamiento, idPaquete){
        const result = await pool.query(
            `SELECT * FROM contenidopaquete
            WHERE idtratamiento = $1 AND idpaquete = $2`, [idTratamiento, idPaquete]
        );
        return result.rows[0];
    }
}

module.exports = new contenidoPaquete();

