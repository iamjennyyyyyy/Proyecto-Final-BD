const distritoService = require('../services/distritoService');

const distritoController = {
    async listarTodos(req, res) {
        try {
        const distritos = await distritoService.listarDistritos();
        res.json({ success: true, count: distritos.length, data: distritos });
        } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        }
    },

    async obtenerPorId(req, res) {
        try {
        const idDistrito = parseInt(req.params.idDistrito);
        const distrito = await distritoService.obtenerDistritoPorId(idDistrito);
        res.json({ success: true, data: distrito });
        } catch (error) {
        res.status(404).json({ success: false, error: error.message });
        }
    },

    async crear(req, res) {
        try {
        const distrito = await distritoService.crearDistrito(req.body);
        res.status(201).json({ success: true, data: distrito });
        } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        }
    },

    async actualizar(req,res){
        try{
            const idDistrito = parseInt(req.params.idDistrito);
            const distrito = await distritoService.actualizarDistrito(idDistrito, req.body);
            res.json({success: true, data: distrito});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async eliminar(req, res) {
        try {
        await distritoService.eliminarDistrito(parseInt(req.params.idDistrito));
        res.json({ success: true, message: 'Distrito eliminado' });
        } catch (error) {
        res.status(404).json({ success: false, error: error.message });
        }
    }
};

module.exports = distritoController;
