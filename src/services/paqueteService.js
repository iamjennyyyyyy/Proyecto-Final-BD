const paqueteRepository = require('../repositories/paqueteRepository');
import Paquete from '../models/Paquete';

const paqueteService = {

    async listarPaquetes(){
        return await paqueteRepository.listarTodos();
    },

    async obtenerPaquetesPorId(id){
        const paquete = await paqueteRepository.buscarPorId(id);
        if(!paquete) throw new Error('Paquete no encontrado');
        return paquete;
    },

    async crearPaquete(datos){
        const paquete = new Paquete(datos);
        paquete.validar();
        if(await paqueteRepository.buscarPorNombre(paquete.nombre)) throw new Error('Ya existe un paquete con ese nombre');
        return await paqueteRepository.crear(datos);
    },

    async actualizarPaquete(id, datos){
        const existente = await paqueteRepository.buscarPorId(id);
        if(!existente) throw new Error('Paquete no encontrado');
        if(datos.nombre && datos.nombre !== existente.nombre && await paqueteRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un paquete con ese nombre');
        const paquete = new Paquete(datos);
        paquete.validar();
        return await paqueteRepository.actualizar(id, datos);
    },

    async eliminarPaquete(id){
        await paqueteRepository.eliminar(id);
    }
}

module.exports = paqueteService;