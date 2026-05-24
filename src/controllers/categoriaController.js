const categoriaService = require('../services/categoriaService');

const categoriaController = {

    async listarTodos(req,res){
        try{
            const categorias = await categoriaService.listarCategorias();
            res.json({success: true, count: categorias.length, data: categorias});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async obtenerPorId(req,res){
        try{
            const id = parseInt(req.params.id);
            const categoria = await categoriaService.obtenerCategoriaPorId(id);
            res.json({success: true, data: categoria});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async crear(req,res){
        try{
            const categoria = await categoriaService.crearCategoria(req.body);
            res.json({success: true, data: categoria});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async actualizar(req,res){
        try{
            const id = parseInt(req.params.id);
            const categoria = await categoriaService.actualizarCategoria(id, req.body);
            res.json({success: true, data: categoria});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async eliminar(req,res){
        try{
            await categoriaService.eliminarCategoria(parseInt(req.params.id));
            res.json({success: true, message: 'Categoría eliminada'});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    }
}

module.exports = categoriaController;