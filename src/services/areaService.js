const areaRepository = require('../repositories/areaRepository');
const empleadoRepository = require('../repositories/empleadoRepository');
const Area = require('../models/Area');

const areaService = {
    async listarAreas() {
        return await areaRepository.listarTodos();
    },

    async obtenerAreaPorId(id) {
        const area = await areaRepository.buscarPorId(id);
        if (!area) throw new Error('Área no encontrada');
        return area;
    },

    async obtenerEmpleadosPorArea(id) {
        const area = await areaRepository.buscarPorId(id);
        if (!area) throw new Error('Área no encontrada');
        return await areaRepository.buscarEmpleadosPorArea(id);
    },

    async obtenerAreasPorEmpleado(idEmpleado) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        if (!empleado) throw new Error('Empleado no encontrado');
        return await areaRepository.buscarAreasDeUnEmpleado(idEmpleado);
    },

    async asignarEmpleadoAUnArea(idArea, idEmpleado) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        const area = await areaRepository.buscarPorId(idArea);
        if (!empleado) throw new Error('Empleado no encontrado');
        if (!area) throw new Error('Área no encontrada');
        const existeRelacion = await areaRepository.existeRelacion(idEmpleado, idArea);
        if (existeRelacion) throw new Error('Este empleado ya se encuentra asignado a esta área');
        return await areaRepository.asignarEmpleadoAUnArea(idEmpleado, idArea);
    },

    async desasignarEmpleadoDeUnArea(idEmpleado, idArea) {
        const existeRelacion = await areaRepository.existeRelacion(idEmpleado, idArea);
        if (!existeRelacion) throw new Error('Este empleado no se encuentra asignado a esta área');
        return await areaRepository.desasignarEmpleadoDeUnArea(idEmpleado, idArea);
    },

    async crearArea(datos) {
        const area = new Area(datos);
        area.validar();
        if (await areaRepository.buscarPorNombre(area.nombre)) throw new Error('Ya existe un área con ese nombre');
        return await areaRepository.crear(datos);
    },

    async actualizarArea(id, datos) {
        const existente = await areaRepository.buscarPorId(id);
        if (!existente) throw new Error('Área no encontrada');
        if (datos.nombre && datos.nombre !== existente.nombre && await areaRepository.buscarPorNombre(datos.nombre)) {
            throw new Error('Ya existe un área con ese nombre');
        }
        Area.validarActualizacion(datos);
        return await areaRepository.actualizar(id, datos);
    },

    async eliminarArea(id) {
        const area = await areaRepository.buscarPorId(id);
        if (!area) throw new Error('Área no encontrada');
        try {
            await areaRepository.eliminar(id);
        } catch (e) {
            if (e.code === '23503') throw new Error('No se puede eliminar: el área tiene categorías o empleados asociados');
            throw e;
        }
    },
        async obtenerTodosEmpleadosPorArea(id) {
        const area = await areaRepository.buscarPorId(id);
        if (!area) throw new Error('Área no encontrada');
        return await areaRepository.obtenerTodosEmpleadosPorArea(id);
    },
};

module.exports = areaService;