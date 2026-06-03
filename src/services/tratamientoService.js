const tratamientoRepository = require('../repositories/tratamientoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');
const materialRepository = require('../repositories/materialRepository');
const materialesPorTratamientoRepository = require('../repositories/materialesPorTratamiento');
const empleadoRepository = require('../repositories/empleadoRepository');
const { MaterialTratamiento } = require('../models/Relaciones');
const Tratamiento = require('../models/Tratamiento');

const tratamientoService = {

    async listarTratamientos() {
        return await tratamientoRepository.listarTodos();
    },

    async obtenerTratamientoPorId(id) {
        const tratamiento = await tratamientoRepository.buscarPorId(id);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        return tratamiento;
    },

    async obtenerMaterialesPorTratamiento(idTratamiento) {
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        return await materialesPorTratamientoRepository.buscarMaterialesPorTratamiento(idTratamiento);
    },

    async obtenerTratamientosPorMaterial(idMaterial) {
        const material = await materialRepository.buscarPorId(idMaterial);
        if (!material) throw new Error('Material no encontrado');
        return await materialesPorTratamientoRepository.buscarTratamientosPorMaterial(idMaterial);
    },

    async asignarMaterialATratamiento(idTratamiento, idMaterial, cantidad) {
        const relacion = new MaterialTratamiento({ idtratamiento: idTratamiento, idmaterial: idMaterial, cantidad });
        relacion.validar();
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        const material = await materialRepository.buscarPorId(idMaterial);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        if (!material) throw new Error('Material no encontrado');
        const existeRelacion = await materialesPorTratamientoRepository.existeRelacion(idMaterial, idTratamiento);
        if (existeRelacion) throw new Error('Este material ya está asignado a este tratamiento');
        return await materialesPorTratamientoRepository.asignarMaterialATratamiento(idTratamiento, idMaterial, cantidad);
    },

    async desasignarMaterialDeTratamiento(idTratamiento, idMaterial) {
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        const material = await materialRepository.buscarPorId(idMaterial);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        if (!material) throw new Error('Material no encontrado');
        const existeRelacion = await materialesPorTratamientoRepository.existeRelacion(idMaterial, idTratamiento);
        if (!existeRelacion) throw new Error('El material no se encuentra asignado a este tratamiento');
        return await materialesPorTratamientoRepository.desasignarMaterialAUnTratamiento(idMaterial, idTratamiento);
    },

    async actualizarCantidadMaterial(idTratamiento, idMaterial, cantidad) {
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        const material = await materialRepository.buscarPorId(idMaterial);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        if (!material) throw new Error('Material no encontrado');
        const existeRelacion = await materialesPorTratamientoRepository.existeRelacion(idMaterial, idTratamiento);
        if (!existeRelacion) throw new Error('El material no se encuentra asignado a este tratamiento');
        return await materialesPorTratamientoRepository.actualizarCantidadMaterial(idMaterial, idTratamiento, cantidad);
    },

    async obtenerEmpleadosFijosPorTratamiento(idTratamiento) {
      const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
      if (!tratamiento) throw new Error('Tratamiento no encontrado');
      return await tratamientoRepository.buscarEmpleadosPorTratamiento(idTratamiento);
  },

    async obtenerTratamientosPorEmpleadoFijo(idEmpleado) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        if (!empleado) throw new Error('Empleado no encontrado');
        return await tratamientoRepository.buscarTratamientosPorEmpleadoAsignado(idEmpleado);
    },

    async asignarEmpleadoFijoATratamiento(idEmpleado, idTratamiento) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        if (!empleado) throw new Error('Empleado no encontrado');
        if(!empleado.esfijo) throw new Error('Solo empleados fijos pueden ser asignados a tratamientos');
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        const existeRelacion = await tratamientoRepository.existeRelacion(idEmpleado, idTratamiento);
        if (existeRelacion) throw new Error('Este empleado ya está asignado a este tratamiento');
        return await tratamientoRepository.asignarEmpleadoAUnTratamiento(idEmpleado, idTratamiento);
    },

    async desasignarEmpleadoFijoDeTratamiento(idEmpleado, idTratamiento) {
        const empleado = await empleadoRepository.buscarPorId(idEmpleado);
        const tratamiento = await tratamientoRepository.buscarPorId(idTratamiento);
        if (!empleado) throw new Error('Empleado no encontrado');
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        const existeRelacion = await tratamientoRepository.existeRelacion(idEmpleado, idTratamiento);
        if (!existeRelacion) throw new Error('Este empleado no está asignado a este tratamiento');
        return await tratamientoRepository.desasignarEmpleadoDeUnTratamiento(idEmpleado, idTratamiento);
    },

    async crearTratamiento(datos) {
        const categoria = await categoriaRepository.buscarPorId(datos.idcategoria);
        if (!categoria) throw new Error('La categoría no existe');
        const tratamiento = new Tratamiento(datos);
        tratamiento.validar();
        if (await tratamientoRepository.buscarPorNombre(tratamiento.nombre)) throw new Error('Ya existe un tratamiento con ese nombre');
        return await tratamientoRepository.crear(datos);
    },

    async actualizarTratamiento(id, datos) {
        const existente = await tratamientoRepository.buscarPorId(id);
        if (!existente) throw new Error('Tratamiento no encontrado');
        if (datos.nombre && datos.nombre !== existente.nombre && await tratamientoRepository.buscarPorNombre(datos.nombre)) {
            throw new Error('Ya existe un tratamiento con ese nombre');
        }
        Tratamiento.validarActualizacion(datos);
        return await tratamientoRepository.actualizar(id, datos);
    },

    async eliminarTratamiento(id) {
        const tratamiento = await tratamientoRepository.buscarPorId(id);
        if (!tratamiento) throw new Error('Tratamiento no encontrado');
        try {
            await tratamientoRepository.eliminar(id);
        } catch (e) {
            if (e.code === '23503') throw new Error('No se puede eliminar: el tratamiento tiene citas, paquetes o materiales asociados');
            throw e;
        }
    }
};

module.exports = tratamientoService;