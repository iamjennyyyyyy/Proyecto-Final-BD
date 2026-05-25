const categoriaRepository = require('../repositories/categoriaRepository');
const areaRepository = require('../repositories/areaRepository');
const Categoria = require('../models/Categoria');

const categoriaService = {

    async listarCategorias(){
        return await categoriaRepository.listarTodos();
    },

    async obtenerCategoriaPorId(id){
        const categoria = await categoriaRepository.obtenerPorId(id);
        if(!categoria) throw new Error('Categoría no encontrada');
        return categoria;
    },

    async crearCategoria(datos){
        const area = await areaRepository.obtenerCategoriaPorId(datos.idarea);
        if(!area) throw new Error('El área de la categoría no existe');
        const categoria = new Categoria(datos);
        categoria.validar();
        if(await categoriaRepository.buscarPorNombre(categoria.nombre)) throw new Error('Ya existe una categoría con ese nombre');
        await categoriaRepository.crear(datos);
    },

    async actualizarCategoria(id, datos){
        const categoria = new Categoria(datos);
        categoria.validar();
        if(!this.obtenerCategoriaPorId(id)) throw new Error('Categoría no encontrada');
        if(await categoriaRepository.buscarPorNombre(datos.nombre)) throw new Error('Ya existe una categoría con ese nombre');
        return await categoriaRepository.actualizar(id, datos);
    },

    async eliminarCategoria(id){
        await categoriaRepository.obtenerPorId(id);
        await categoriaRepository.eliminar(id);
    }
}

module.exports = categoriaService;