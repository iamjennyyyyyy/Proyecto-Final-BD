const distritoRepository = require('../repositories/distritoRepository');
const empleadoRepository = require('../repositories/empleadoRepository');
const Distrito = require('../models/Distrito');

const distritoService = {

    async listarDistritos() {
        return await distritoRepository.listarTodos();
    },

    async obtenerDistritoPorId(id) {
        const distrito = await distritoRepository.buscarPorId(id);
        if (!distrito) throw new Error('Distrito no encontrado');
        return distrito;
    },

    async crearDistrito(datos) {
        const distrito = new Distrito(datos);
        distrito.validar();
        if (await distritoRepository.buscarPorNombre(distrito.nombre)) throw new Error('Ya existe un distrito con ese nombre');
        return await distritoRepository.crear(datos);
    },

    async actualizarDistrito(id, datos) {
        const existente = await distritoRepository.buscarPorId(id);
        if (!existente) throw new Error('Distrito no encontrado');
        if (datos.nombre && datos.nombre !== existente.nombre && await distritoRepository.buscarPorNombre(datos.nombre)) {
            throw new Error('Ya existe un distrito con ese nombre');
        }
        Distrito.validarActualizacion(datos);
        return await distritoRepository.actualizar(id, datos);
    },

    async eliminarDistrito(id, migrarA) {
        const distrito = await distritoRepository.buscarPorId(id);
        if (!distrito) throw new Error('Distrito no encontrado');
        if (migrarA) {
            const destino = await distritoRepository.buscarPorId(migrarA);
            if (!destino) throw new Error('Distrito de destino no encontrado');
            await distritoRepository.reasignarEmpleados(id, migrarA);
        }
        try {
            await distritoRepository.eliminar(id);
        } catch (e) {
            if (e.code === '23503') throw new Error('No se puede eliminar: el distrito tiene empleados asignados');
            throw e;
        }
    }
};

module.exports = distritoService;