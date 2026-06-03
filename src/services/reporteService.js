const reporteRepository = require('../repositories/reporteRepository');

const reporteService = {

    async generarIngresosPorMes(fechaMes) {
        if (!fechaMes) {
            throw new Error('La fecha es obligatoria');
        }
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fechaMes)) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        return await reporteRepository.generarIngresosPorMes(fechaMes);
    },

    async obtenerTop3Tratamientos() {
        return await reporteRepository.obtenerTop3Tratamientos();
    },

    async obtenerEmpleadosPorCliente(idCliente) {
        if (!idCliente) {
            throw new Error('El ID del cliente es obligatorio');
        }
        const id = parseInt(idCliente);
        if (isNaN(id)) {
            throw new Error('El ID del cliente debe ser un número válido');
        }
        return await reporteRepository.obtenerEmpleadosPorCliente(id);
    },

    async buscarServiciosPorClientePorIntervalo(idCliente, fecha) {
        if (!idCliente) {
            throw new Error('El ID del cliente es obligatorio');
        }
        if (!fecha) {
            throw new Error('La fecha es obligatoria');
        }
        const id = parseInt(idCliente);
        if (isNaN(id)) {
            throw new Error('El ID del cliente debe ser un número válido');
        }
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fecha)) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        return await reporteRepository.buscarServiciosPorClientePorIntervalo(id, fecha);
    }
};

module.exports = reporteService;