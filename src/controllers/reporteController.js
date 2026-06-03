const reporteService = require('../services/reporteService');

const reporteController = {

    async generarIngresosPorMes(req, res) {
        try {
            const { fecha } = req.query;
            const resultado = await reporteService.generarIngresosPorMes(fecha);
            res.json({ success: true, data: resultado });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    async obtenerTop3Tratamientos(req, res) {
        try {
            const top3 = await reporteService.obtenerTop3Tratamientos();
            res.json({ success: true, count: top3.length, data: top3 });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async obtenerEmpleadosPorCliente(req, res) {
        try {
            const idCliente = parseInt(req.params.idCliente);
            const empleados = await reporteService.obtenerEmpleadosPorCliente(idCliente);
            res.json({ success: true, count: empleados.length, data: empleados });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    async buscarServiciosPorClientePorIntervalo(req, res) {
        try {
            const idCliente = parseInt(req.params.idCliente);
            const { fecha } = req.query;
            const servicios = await reporteService.buscarServiciosPorClientePorIntervalo(idCliente, fecha);
            res.json({ success: true, count: servicios.length, data: servicios });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
};

module.exports = reporteController;