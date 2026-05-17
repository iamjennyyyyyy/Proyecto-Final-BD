class EmpleadoArea {
    constructor(datos = {}) {
        this.idEmpleado = datos.idEmpleado || null;
        this.idArea = datos.idArea || null;
    }

    validar() {
        if (!this.idEmpleado) {
            throw new Error('El empleado es obligatorio');
        }
        if (!this.idArea) {
            throw new Error('El área es obligatoria');
        }
        return true;
    }
}

class EmpleadoTratamiento {
    constructor(datos = {}) {
        this.idEmpleado = datos.idEmpleado || null;
        this.idTratamiento = datos.idTratamiento || null;
    }

    validar() {
        if (!this.idEmpleado) {
            throw new Error('El empleado es obligatorio');
        }
        if (!this.idTratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        return true;
    }
}

class MaterialTratamiento {
    constructor(datos = {}) {
        this.idMaterial = datos.idMaterial || null;
        this.idTratamiento = datos.idTratamiento || null;
        this.cantidad = datos.cantidad || 1;
    }

    validar() {
        if (!this.idMaterial) {
            throw new Error('El material es obligatorio');
        }
        if (!this.idTratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        if (this.cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        return true;
    }
}

class MaterialCita {
    constructor(datos = {}) {
        this.idCita = datos.idCita || null;
        this.idMaterial = datos.idMaterial || null;
        this.cantidadUtilizada = datos.cantidadUtilizada || 0;
    }

    validar() {
        if (!this.idCita) {
            throw new Error('La cita es obligatoria');
        }
        if (!this.idMaterial) {
            throw new Error('El material es obligatorio');
        }
        if (this.cantidadUtilizada <= 0) {
            throw new Error('La cantidad utilizada debe ser mayor a 0');
        }
        return true;
    }
}

class ContenidoPaquete {
    constructor(datos = {}) {
        this.idPaquete = datos.idPaquete || null;
        this.idTratamiento = datos.idTratamiento || null;
    }

    validar() {
        if (!this.idPaquete) {
            throw new Error('El paquete es obligatorio');
        }
        if (!this.idTratamiento) {
            throw new Error('El tratamiento es obligatorio');
        }
        return true;
    }
}

module.exports = {
    EmpleadoArea,
    EmpleadoTratamiento,
    MaterialTratamiento,
    MaterialCita,
    ContenidoPaquete
};