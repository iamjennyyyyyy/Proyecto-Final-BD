const areaRepository = require('../repositories/areaRepository');
import Area from '../models/Area';
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
        const area = new Area(datos);
        area.validar();
        if(!this.obtenerAreaPorId(id)) throw new Error('Área no encontrada');
        if(await areaRepository.buscarPorNombre(area.nombre)) throw new Error('Ya existe un área con ese nombre');
        return await areaRepository.actualizar(id, datos);
    },

    async eliminarArea(id){
        await areaRepository.eliminar(id);
    }
}

module.exports = areaService;