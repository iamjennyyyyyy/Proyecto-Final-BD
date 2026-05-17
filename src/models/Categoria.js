class Categoria{

    constructor(idCat, nombre){
        this.idCat = idCat;
        this.nombre = nombre;
    }

    validar(){

        if(this.nombre == null || this.nombre.trim() === ''){
            throw new Error('El nombre del área es obligatorio');
        }

        return true;
    }
}