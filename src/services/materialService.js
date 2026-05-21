const materialRepository = require('../repositories/materialRepository');

const materialService = {
    async listarMateriales(){
        return await materialRepository.listarTodos();
    },

    async obtenerMaterial(id){
        const material = await materialRepository.buscarPorId(id);
        if(!material) throw new Error('Material no encontrado');
        return material;
    },

    async crearMaterial(datos){
        if(!datos.nombre || datos.nombre.trim().length < 3)
            throw new Error('El nombre del material debe tener al menos 3 caracteres');
        return await materialRepository.crear(datos);
    },

    async actualizarMaterial(id, datos){
        const mat = await materialRepository.buscarPorId(id);
        if(!mat) throw new Error('Material no encontrado');
        return await materialRepository.actualizar(id, datos);
    },

    async eliminarMaterial(id){
        await materialRepository.buscarPorId(id);
        await materialRepository.eliminar(id);
    }
};

module.exports = materialService;
