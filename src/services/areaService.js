const areaRepository = require('../repositories/areaRepository');
const Area = require('../models/Area');
const areaService = {

    async listarAreas(){
        return await areaRepository.listarTodos();
    },

    async obtenerAreaPorId(id){
        const area = await areaRepository.buscarPorId(id);
        if(!area) throw new Error('Área no encontrada');
        return area;
    },

    async crearArea(datos){
        const area = new Area(datos);
        area.validar();
        if(await areaRepository.buscarPorNombre(area.nombre))
            throw new Error('Ya existe un área con ese nombre');
        return await areaRepository.crear(datos);
    },

    async actualizarArea(id, datos){
        const existente = await areaRepository.buscarPorId(id);
        if(!existente) throw new Error('Área no encontrada');
        if(datos.nombre && datos.nombre !== existente.nombre && await areaRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un área con ese nombre');
        const area = new Area(datos);
        area.validar();
        return await areaRepository.actualizar(id, datos);
    },

    async eliminarArea(id){
        await areaRepository.eliminar(id);
    }
}

module.exports = areaService;