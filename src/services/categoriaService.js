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
            const area = await areaRepository.obtenerCategoriaPorId(datos.idarea);
            if(!area) throw new Error('El área de la categoría no existe');
            await categoriaRepository.crear(datos);
        },

        async modificarCategoria(id, datos){
                if(datos.nombre === undefined || datos.nombre.trim() === '' || datos.nombre.length < 3 || datos.nombre.length > 50)
                    throw new Error('El nombre de la categoría es obligatorio y debe contener entre 3 y 50 caracteres');
                if(await categoriaRepository.buscarPorNombre(datos.nombre))
                    throw new Error('Ya existe una categoría con ese nombre');
                return await categoriaRepository.actualizar(id, datos);
            },

        async eliminarCategoria(id){
            await categoriaRepository.obtenerPorId(id);
            await categoriaRepository.eliminar(id);
        }
}

module.exports = categoriaService;