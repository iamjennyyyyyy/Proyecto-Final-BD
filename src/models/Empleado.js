class Empleado{

    constructor(idEmpleado, nombre, especialidad, horasTrabajo, direccion, CI, telefono, distrito, esFijo){
        this.idEmpleado = idEmpleado;
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.horasTrabajo = horasTrabajo;
        this.direccion = direccion;
        this.CI = CI;
        this.telefono = telefono;
        this.distrito = distrito;
        this.esFijo = esFijo;
    }

    validar(){

        if(this.nombre == null || this.nombre.trim() === ''){
            throw new Error('El nombre del área es obligatorio');
        }

        if(this.especialidad == null || this.especialidad.trim() === ''){
            throw new Error('La especialidad del empleado es obligatoria');
        }

        if(this.horasTrabajo <= 0){
            throw new Error('Las horas de trabajo deben ser mayores a 0');
        }

        if(direccion == null || direccion.trim() === ''){
            throw new Error('La dirección del empleado es obligatoria');
        }

        if(CI == null || CI.trim() === '' || CI.length != 11){
            throw new Error('El CI del empleado es obligatorio');
        }

        if(telefono == null || telefono.trim() === ''){
            throw new Error('El teléfono del empleado es obligatorio');
        }

        if(distrito == null || distrito.trim() === ''){
            throw new Error('El distrito del empleado es obligatorio');
        }

        if(esFijo == null){
            throw new Error('Debe especificar si el empleado es fijo o no');
        }
        return true;
    }
}