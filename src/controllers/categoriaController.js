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
            const idCategoria = parseInt(req.params.idCategoria);
            const categoria = await categoriaService.obtenerCategoriaPorId(idCategoria);
            res.json({success: true, data: categoria});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async obtenerCategoriasPorArea(req,res){
        try{
            const idArea = parseInt(req.params.idArea);
            const categorias = await categoriaService.obtenerCategoriasPorArea(idArea);
            res.json({success: true, count: categorias.length, data: categorias});
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
            const idCategoria = parseInt(req.params.idCategoria);
            const categoria = await categoriaService.actualizarCategoria(idCategoria, req.body);
            res.json({success: true, data: categoria});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    },

    async eliminar(req,res){
        try{
            await categoriaService.eliminarCategoria(parseInt(req.params.idCategoria));
            res.json({success: true, message: 'Categoría eliminada'});
        }
        catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    }
}

module.exports = categoriaController;