const paqueteService = require('../services/paqueteService');

const paqueteController = {
	async listarTodos(req, res) {
		try {
			const paquetes = await paqueteService.listarPaquetes();
			res.json({ success: true, count: paquetes.length, data: paquetes });
		} catch (error) {
			res.status(500).json({ success: false, error: error.message });
		}
	},

	async obtenerPorId(req, res) {
		try {
			const id = parseInt(req.params.id);
			const paquete = await paqueteService.obtenerPaquetePorId(id);
			res.json({ success: true, data: paquete });
		} catch (error) {
			res.status(404).json({ success: false, error: error.message });
		}
	},

	async crear(req, res) {
		try {
			const paquete = await paqueteService.crearPaquete(req.body);
			res.status(201).json({ success: true, data: paquete });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	},

	async actualizar(req,res){
		try{
			const id = parseInt(req.params.id);
			const paquete = await paqueteService.actualizarPaquete(id, req.body);
			res.json({success: true, data: paquete});
		}
		catch(error){
			res.status(500).json({success: false, error: error.message});
		}
	},

	async eliminar(req, res) {
		try {
			await paqueteService.eliminarPaquete(parseInt(req.params.id));
			res.json({ success: true, message: 'Paquete eliminado' });
		} catch (error) {
			res.status(404).json({ success: false, error: error.message });
		}
	}
};

module.exports = paqueteController;
