const materialService = require('../repositories/materialRepository');
import Material from '../models/Material';

const materialService = {

    async listarMateriales(){
        return await materialRepository.listarTodos();
    },

    async obtenerMaterialPorId(id){
        const material = await materialRepository.buscarPorId(id);
        if(!material) throw new Error('Material no encontrado');
        return area;
    },

    async crearMaterial(datos){
        const material = new Material(datos);
        material.validar();
        const mat = await materialRepository.buscarPorNombre(material.nombre);
        if(mat) throw new Error('Ya existe un material con ese nombre');
        return await materialRepository.crear(datos);
    },

    async actualizarMaterial(id, datos){
        const existente = await materialRepository.buscarPorId(id);
        if(!existente) throw new Error('Material no encontrado');
        if(datos.nombre && datos.nombre !== existente.nombre && await materialRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un empleado con ese nombre');
        const material = new Material(datos);
        material.validar();
        return await materialRepository.actualizar(id, datos);
    },

    async eliminarMaterial(id){
        await materialRepository.eliminar(id);
    }
}

module.exports = materialService;