const areaRepository = require('../repositories/areaRepository');

const areaService = {

    async listarAreas(){
        return await areaRepository.listarTodos();
    },

    async obtenerArea(id){
        const area = await areaRepository.buscarPorId(id);
        if(!area) throw new Error('Área no encontrada');
        return area;
    },

    async crearArea(datos){
        if(datos.nombre === undefined || datos.nombre.trim() === '' || datos.nombre.length < 3 || datos.nombre.length > 50)
            throw new Error('El nombre del área es obligatorio y debe contener entre 3 y 50 caracteres');
        if(await areaRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un área con ese nombre');
        return await areaRepository.guardar(datos);
    },

    async modificarArea(id, datos){
        if(datos.nombre === undefined || datos.nombre.trim() === '' || datos.nombre.length < 3 || datos.nombre.length > 50)
            throw new Error('El nombre del área es obligatorio y debe contener entre 3 y 50 caracteres');
        if(await areaRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un área con ese nombre');
        return await areaRepository.modificarNombre(id, datos);
    },

    async eliminarArea(id){
        await areaRepository.buscarPorId(id);
        await areaRepository.eliminar(id);
    }
}

module.exports = areaService;