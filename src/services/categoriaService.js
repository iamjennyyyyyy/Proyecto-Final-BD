const categoriaRepository = require('../repositories/categoriaRepository');
const areaRepository = require('../repositories/areaRepository');
const Categoria = require('../models/Categoria');

const categoriaService = {

    async listarCategorias() {
        return await categoriaRepository.listarTodos();
    },

    async obtenerCategoriaPorId(id) {
        const categoria = await categoriaRepository.buscarPorId(id);
        if (!categoria) throw new Error('Categoría no encontrada');
        return categoria;
    },

    async obtenerCategoriasPorArea(idArea) {
        const area = await areaRepository.buscarPorId(idArea);
        if (!area) throw new Error('Área no encontrada');
        return await categoriaRepository.buscarPorArea(idArea);
    },

    async crearCategoria(datos) {
        const area = await areaRepository.buscarPorId(datos.idarea);
        if (!area) throw new Error('El área de la categoría no existe');
        const categoria = new Categoria(datos);
        categoria.validar();
        if (await categoriaRepository.buscarPorNombre(categoria.nombre)) throw new Error('Ya existe una categoría con ese nombre');
        return await categoriaRepository.crear(datos);
    },

    async actualizarCategoria(id, datos) {
        const existente = await categoriaRepository.buscarPorId(id);
        if (!existente) throw new Error('Categoría no encontrada');
        if (datos.nombre && datos.nombre !== existente.nombre && await categoriaRepository.buscarPorNombre(datos.nombre)) {
            throw new Error('Ya existe una categoría con ese nombre');
        }
        Categoria.validarActualizacion(datos);
        return await categoriaRepository.actualizar(id, datos);
    },

    async eliminarCategoria(id) {
        const categoria = await categoriaRepository.buscarPorId(id);
        if (!categoria) throw new Error('Categoría no encontrada');
        await categoriaRepository.eliminar(id);
    }
};

module.exports = categoriaService;