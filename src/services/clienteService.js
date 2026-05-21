const clienteRepository = require('../repositories/clienteRepository');
const Cliente = require('../models/Cliente');

class ClienteService {
  async listarClientes() {
    return await clienteRepository.listarTodos();
  }

  async obtenerCliente(id) {
    const cliente = await clienteRepository.buscarPorId(id);
    if (!cliente) throw new Error('Cliente no encontrado');
    return cliente;
  }

  async crearCliente(datos) {
    const cliente = new Cliente(datos);
    cliente.validar();
    return await clienteRepository.guardar(datos);
  }

  async eliminarCliente(id) {
    await this.obtenerCliente(id);
    await clienteRepository.eliminar(id);
  }
}

module.exports = new ClienteService();
