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
        return await empleadoRepository.crear(datos);
    }

    async actualizarEmpleado(id, datos) {
        const empleado = new Empleado(datos);
        empleado.validar();
        const existe = await this.obtenerEmpleadoPorId(id);
        if(!existe) throw new Error('Empleado no encontrado');
        return await empleadoRepository.actualizar(id, datos);
    }

    async eliminarEmpleado(id) {
        await empleadoRepository.eliminar(id);
    }
}

module.exports = new EmpleadoService();
