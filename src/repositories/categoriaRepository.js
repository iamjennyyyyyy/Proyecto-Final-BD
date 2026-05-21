const pool = require('../config/database');

class CategoriaRepository{

    async listarTodos(){
        const result = await pool.query('SELECT * FROM categorias');
        return result.rows;
    }

    async buscarPorId(id){
        const result = await pool.query('SELECT * FROM categorias WHERE idcategoria = $1', [id]);
        return result.rows[0];
    }

    async buscarPorNombre(nombre){
        const result = await pool.query('SELECT * FROM categorias WHERE nombre = $1', [nombre]);
        return result.rows[0];
    }

    async guardar(datos){
        const result = await pool.query('INSERT INTO categorias (nombre, idarea) VALUES ($1, $2) RETURNING *', [datos.nombre, datos.idarea]);
        return result.rows[0];
    }

    async modificarNombre(id, datos){
        const result = await pool.query('UPDATE categorias SET nombre = $1 WHERE idcategoria = $2 RETURNING *', [datos.nombre, id]);
        return result.rows[0];
    }

    async eliminar(id){
        await pool.query('DELETE FROM categorias WHERE idcategoria = $1', [id]);
    }
}

module.exports = new CategoriaRepository();