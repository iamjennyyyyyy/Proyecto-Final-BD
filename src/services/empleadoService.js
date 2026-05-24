const empleadoRepository = require('../repositories/empleadoRepository');
const Empleado = require('../models/Empleado');

class EmpleadoService {
    async listarEmpleados() {
        return await empleadoRepository.listarTodos();
    }

    async obtenerEmpleadoPorId(id) {
        const empleado = await empleadoRepository.buscarPorId(id);
        if (!empleado) throw new Error('Empleado no encontrado');
        return empleado;
    }

    async crearEmpleado(datos) {
        const empleado = new Empleado(datos);
        empleado.validar();
        if(await empleadoRepository.buscarPorNombre(datos.nombre)) throw new Error('Ya existe un empleado con ese nombre');
        if(await empleadoRepository.buscarPorDNI(datos.dni)) throw new Error('Ya existe un empleado con ese DNI');
        return await empleadoRepository.crear(datos);
    }

    async actualizarEmpleado(id, datos) {
        const existente = await empleadoRepository.buscarPorId(id);
        if(!existente) throw new Error('Empleado no encontrado');
        if(datos.nombre && datos.nombre !== existente.nombre && await empleadoRepository.buscarPorNombre(datos.nombre))
            throw new Error('Ya existe un empleado con ese nombre');
        const empleado = new Empleado(datos);
        empleado.validar();
        return await empleadoRepository.actualizar(id, datos);
    }

    async eliminarEmpleado(id) {
        await empleadoRepository.eliminar(id);
    }
}

module.exports = new EmpleadoService();
