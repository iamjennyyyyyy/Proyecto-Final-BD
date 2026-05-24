const tratamientoService = require('../services/tratamientoService');

const tratamientoController = {
    async listarTodos(req, res) {
        try {
        const tratamientos = await tratamientoService.listarTratamientos();
        res.json({ success: true, count: tratamientos.length, data: tratamientos });
        } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        }
    },

    async obtenerPorId(req, res) {
        try {
        const id = parseInt(req.params.id);
        const tratamiento = await tratamientoService.obtenerTratamientoPorId(id);
        res.json({ success: true, data: tratamiento });
        } catch (error) {
        res.status(404).json({ success: false, error: error.message });
        }
    },

    async crear(req, res) {
        try {
        const tratamiento = await tratamientoService.crearTratamiento(req.body);
        res.status(201).json({ success: true, data: tratamiento });
        } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        }
    },

    async actualizar(req,res){
            try{
                const id = parseInt(req.params.id);
                const tratamiento = await tratamientoService.actualizarTratamiento(id, req.body);
                res.json({success: true, data: tratamiento});
            }
            catch(error){
                res.status(500).json({success: false, error: error.message});
            }
        },

    async eliminar(req, res) {
        try {
        await tratamientoService.eliminarTratamiento(parseInt(req.params.id));
        res.json({ success: true, message: 'Tratamiento eliminado' });
        } catch (error) {
        res.status(404).json({ success: false, error: error.message });
        }
    }
};

module.exports = tratamientoController;
