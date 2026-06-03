const clienteRepository = require('../repositories/clienteRepository');
const Cliente = require('../models/Cliente');

const clienteService = {

    async listarClientes() {
        return await clienteRepository.listarTodos();
    },

    async obtenerClientePorId(id) {
        const cliente = await clienteRepository.buscarPorId(id);
        if (!cliente) throw new Error('Cliente no encontrado');
        return cliente;
    },

    async obtenerClientePorDNI(dni) {
        const cliente = await clienteRepository.buscarPorDNI(dni);
        if (!cliente) throw new Error('Cliente no encontrado');
        return cliente;
    },

    async crearCliente(datos) {
        const cliente = new Cliente(datos);
        cliente.validar();
        if (await clienteRepository.buscarPorNombre(datos.nombre)) throw new Error('Ya existe un cliente con ese nombre');
        if (await clienteRepository.buscarPorDNI(datos.dni)) throw new Error('Ya existe un cliente con ese DNI');
        return await clienteRepository.crear(datos);
    },

    async actualizarCliente(id, datos) {
        const existente = await clienteRepository.buscarPorId(id);
        if (!existente) throw new Error('Cliente no encontrado');
        if (datos.nombre && datos.nombre !== existente.nombre && await clienteRepository.buscarPorNombre(datos.nombre)) {
            throw new Error('Ya existe un cliente con ese nombre');
        }
        if (datos.dni && datos.dni !== existente.dni && await clienteRepository.buscarPorDNI(datos.dni)) {
            throw new Error('Ya existe un cliente con ese DNI');
        }
        Cliente.validarActualizacion(datos);
        return await clienteRepository.actualizar(id, datos);
    },

    async eliminarCliente(id) {
        const cliente = await clienteRepository.buscarPorId(id);
        if (!cliente) throw new Error('Cliente no encontrado');
        await clienteRepository.eliminar(id);
    }
    
};

module.exports = clienteService;