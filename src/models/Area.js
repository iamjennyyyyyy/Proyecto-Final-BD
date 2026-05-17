class Area{

    constructor(idArea, nombre){
        this.idArea = idArea;
        this.nombre = nombre;
    }

    validar(){

        if(this.nombre == null || this.nombre.trim() === ''){
            throw new Error('El nombre del área es obligatorio');
        }

        return true;
    }
}