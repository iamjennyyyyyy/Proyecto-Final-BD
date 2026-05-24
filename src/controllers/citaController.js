const citaService = require('../services/citaService');

const citaController = {

    async listarTodos(req, res) {
        try {
            const citas = await citaService.listarCitas();
            res.json({ success: true, count: citas.length, data: citas });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async obtenerPorId(req, res) {
        try {
            const id = parseInt(req.params.id);
            const cita = await citaService.obtenerCitaPorId(id);
            res.json({ success: true, data: cita });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    async listarPorCliente(req, res) {
        try {
            const idCliente = parseInt(req.params.idCliente);
            const citas = await citaService.listarCitasPorCliente(idCliente);
            res.json({ success: true, count: citas.length, data: citas });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    async listarPorEmpleado(req, res) {
        try {
            const idEmpleado = parseInt(req.params.idEmpleado);
            const citas = await citaService.listarCitasPorEmpleado(idEmpleado);
            res.json({ success: true, count: citas.length, data: citas });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    async listarPorFecha(req, res) {
        try {
            const { fecha } = req.query;
            const citas = await citaService.listarCitasPorFecha(fecha);
            res.json({ success: true, count: citas.length, data: citas });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    async crear(req, res) {
        try {
            const cita = await citaService.crearCita(req.body);
            res.status(201).json({ success: true, data: cita });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    async modificar(req, res) {
        try {
            const id = parseInt(req.params.id);
            const cita = await citaService.modificarCita(id, req.body);
            res.json({ success: true, data: cita });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    async eliminar(req, res) {
        try {
            const id = parseInt(req.params.id);
            await citaService.eliminarCita(id);
            res.json({ success: true, message: 'Cita eliminada' });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}

module.exports = citaController;