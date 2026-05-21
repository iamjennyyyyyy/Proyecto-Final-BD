const clienteRepository = require('../repositories/clienteRepository');
import Cliente from '../models/Cliente';

class ClienteService {
    async listarClientes() {
        return await clienteRepository.listarTodos();
    }

    async obtenerClientePorId(id) {
        const cliente = await clienteRepository.buscarPorId(id);
        if (!cliente) throw new Error('Cliente no encontrado');
        return cliente;
    }

    async crearCliente(datos) {
        const cliente = new Cliente(datos);
        cliente.validar();
        return await clienteRepository.crear(datos);
    }

    async actualizarCliente(id, datos) {
        const cliente = new Cliente(datos);
        cliente.validar();
        if(!this.obtenerClientePorId(id)) throw new Error('Cliente no encontrado');
        return await clienteRepository.crear(id, datos);
    }

    async eliminarCliente(id) {
        await clienteRepository.eliminar(id);
    }
}

module.exports = new ClienteService();
