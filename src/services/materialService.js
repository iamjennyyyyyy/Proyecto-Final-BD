const materialService = require('../repositories/materialRepository');

const materialService = {

    async listarMateriales(){
        return await materialRepository.listarTodos();
    },

    async obtenerMaterial(id){
        const material = await materialRepository.buscarPorId(id);
        if(!material) throw new Error('Material no encontrado');
        return area;
    },

    async crearMaterial(datos){
        if(datos.nombre === undefined || datos.nombre.trim() === '' || datos.nombre.length < 3 || datos.nombre.length > 50)
            throw new Error('El nombre del material es obligatorio y debe contener entre 3 y 50 caracteres');
        if(await materialRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un material con ese nombre');
        return await materialRepository.crear(datos);
    },

    async modificarMaterial(id, datos){
        if(datos.nombre === undefined || datos.nombre.trim() === '' || datos.nombre.length < 3 || datos.nombre.length > 50)
            throw new Error('El nombre del material es obligatorio y debe contener entre 3 y 50 caracteres');
        if(await materialRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un material con ese nombre');
        if(datos.cantidad !== undefined && (isNaN(datos.cantidad) || datos.cantidad < 0))
            throw new Error('La cantidad del material debe ser un número no negativo');
        return await materialRepository.actualizar(id, datos);
    },

    async aumentarCantidad(id, cantidad){

            if(isNaN(cantidad))
                throw new Error('La cantidad a aumentar debe ser un número');
            if(cantidad <= 0)
                throw new Error('La cantidad a aumentar no puede ser negativa');
            const material = await materialRepository.buscarPorId(id);
            if(!material)
                throw new Error('Material no encontrado');
            const nuevaCantidad = material.cantidad + cantidad;
            return await materialRepository.aumentarCantidad(id, nuevaCantidad);
    },

    async eliminarMaterial(id){
        await materialRepository.buscarPorId(id);
        await materialRepository.eliminar(id);
    }
}

module.exports = materialService;