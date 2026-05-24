const paqueteVendidoRepository = require('../repositories/paqueteVendidoRepository');
import PaqueteVendido from '../models/PaqueteVendido';

const paqueteVendidoService = {

    async listarPaquetesV(){
        return await paqueteVendidoRepository.listarTodos();
    },

    async obtenerPaquetesVPorId(id){
        const paquete = await paqueteVendidoRepository.buscarPorId(id);
        if(!paquete) throw new Error('Paquete no encontrado');
        return paquete;
    },

    async crearPaquete(datos){
        const paquete = new PaqueteVendido(datos);
        paquete.validar();
        return await paqueteVendidoRepository.crear(datos);
    },

    async actualizarPaqueteV(id, datos){
        const existente = await paqueteVendidoRepository.buscarPorId(id);
        if(!existente) throw new Error('Paquete no encontrado');
        const paquete = new PaqueteVendido(datos);
        paquete.validar();
        return await paqueteVendidoRepository.actualizar(id, datos);
    },

    async eliminarPaqueteV(id){
        await paqueteVendidoRepository.eliminar(id);
    }
}

module.exports = paqueteVendidoService;