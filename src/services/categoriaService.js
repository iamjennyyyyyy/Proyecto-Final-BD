const categoriaRepository = require('../repositories/categoriaRepository');
const areaRepository = require('../repositories/areaRepository');

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
            const area = await areaRepository.buscarPorId(datos.idarea);
            if(!area) throw new Error('El área especificada no existe');
            return await categoriaRepository.crear(datos);
        },

        async actualizarCategoria(id, datos){
            const cat = await categoriaRepository.buscarPorId(id);
            if(!cat) throw new Error('Categoría no encontrada');
            return await categoriaRepository.actualizar(id, datos);
        },

        async eliminarCategoria(id){
            const cat = await categoriaRepository.buscarPorId(id);
            if(!cat) throw new Error('Categoría no encontrada');
            await categoriaRepository.eliminar(id);
        }
}

module.exports = categoriaService;