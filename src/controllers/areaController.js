const areaService = require('../services/areaService');

const areaController = {
    async listarTodos(req, res) {
        try {
            const areas = await areaService.listarAreas();
            res.json({success: true, count: areas.length, data: areas});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async obtenerPorId(req, res) {
        try {
            const id = parseInt(req.params.id);
            const area = await areaService.obtenerArea(id);
            res.json({success: true, data: area});
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    async crear(req, res) {
        try {
            const area = await areaService.crearArea(req.body);
            res.status(201).json({success: true, data: area});
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    async eliminar(req, res) {
        try {
            await areaService.eliminarArea(parseInt(req.params.id));
            res.json({success: true, message: 'Área eliminada'});
        }
        catch(error){
            res.status(404).json({ success: false, error: error.message });
        }
    }
}

module.exports = areaController