const citaRepository = require('../repositories/citaRepository');
const clienteRepository = require('../repositories/clienteRepository');
const tratamientoRepository = require('../repositories/tratamientoRepository');
const empleadoRepository = require('../repositories/empleadoRepository');
const paqueteVendidoRepository = require('../repositories/paqueteVendidoRepository');

const citaService = {

    async listarCitas() {
        return await citaRepository.listarTodos();
    },

    async obtenerCitaPorId(id) {
        const cita = await citaRepository.buscarPorId(id);
        if (!cita) throw new Error('Cita no encontrada');
        return cita;
    },

    async listarCitasPorCliente(idCliente) {
        const cliente = await clienteRepository.buscarPorId(idCliente);
        if (!cliente) throw new Error('Cliente no encontrado');
        return await citaRepository.buscarPorCliente(idCliente);
    },

    async listarCitasPorEmpleado(idEmpleado) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        if (!empleado) throw new Error('Empleado no encontrado');
        return await citaRepository.buscarPorEmpleado(idEmpleado);
    },

    async listarCitasPorFecha(fecha) {
        if (!fecha) throw new Error('La fecha es obligatoria');
        return await citaRepository.buscarPorFecha(fecha);
    },

    async crearCita(datos) {
        if (!datos.idCliente) throw new Error('El cliente es obligatorio');
        if (!datos.idTratamiento) throw new Error('El tratamiento es obligatorio');
        if (!datos.fecha) throw new Error('La fecha es obligatoria');
        if (!datos.hora) throw new Error('La hora es obligatoria');

        const cliente = await clienteRepository.buscarPorId(datos.idCliente);
        if (!cliente) throw new Error('El cliente no existe');

        const tratamiento = await tratamientoRepository.buscarPorId(datos.idTratamiento);
        if (!tratamiento) throw new Error('El tratamiento no existe');

        if (datos.idEmpleado) {
            const empleado = await empleadoRepository.buscarPorId(datos.idEmpleado);
            if (!empleado) throw new Error('El empleado no existe');
        }

        if (datos.idPaqVendido) {
            const paquete = await paqueteVendidoRepository.buscarPorId(datos.idPaqVendido);
            if (!paquete) throw new Error('El paquete vendido no existe');
        }

        if (datos.estado && !['pendiente', 'realizada', 'cancelada'].includes(datos.estado)) {
            throw new Error('Estado no válido. Debe ser: pendiente, realizada o cancelada');
        }

        if (datos.observaciones && datos.observaciones.length > 500) {
            throw new Error('Las observaciones no pueden superar los 500 caracteres');
        }

        return await citaRepository.crear(datos);
    },

    async actualizarCita(id, datos) {
        const cita = await citaRepository.buscarPorId(id);
        if (!cita) throw new Error('Cita no encontrada');

        if (datos.idCliente) {
            const cliente = await clienteRepository.buscarPorId(datos.idCliente);
            if (!cliente) throw new Error('El cliente no existe');
        }

        if (datos.idTratamiento) {
            const tratamiento = await tratamientoRepository.buscarPorId(datos.idTratamiento);
            if (!tratamiento) throw new Error('El tratamiento no existe');
        }

        if (datos.idEmpleado) {
            const empleado = await empleadoRepository.buscarPorId(datos.idEmpleado);
            if (!empleado) throw new Error('El empleado no existe');
        }

        if (datos.idPaqVendido) {
            const paquete = await paqueteVendidoRepository.buscarPorId(datos.idPaqVendido);
            if (!paquete) throw new Error('El paquete vendido no existe');
        }

        if (datos.estado && !['pendiente', 'realizada', 'cancelada'].includes(datos.estado)) {
            throw new Error('Estado no válido. Debe ser: pendiente, realizada o cancelada');
        }

        if (datos.observaciones && datos.observaciones.length > 500) {
            throw new Error('Las observaciones no pueden superar los 500 caracteres');
        }

        return await citaRepository.actualizar(id, datos);
    },

    async eliminarCita(id) {
        const cita = await citaRepository.buscarPorId(id);
        if (!cita) throw new Error('Cita no encontrada');
        await citaRepository.eliminar(id);
    }
}

module.exports = citaService;