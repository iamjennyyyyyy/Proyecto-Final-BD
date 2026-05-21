create table areas(
  idArea Serial primary key,
  nombre varchar(200) not null,
  cantidadPersonalFijo integer not null
);

create table categorias(
  idcategoria Serial primary key,
  nombre Varchar(200) not null,
  idArea integer references areas(idArea)
);

create table tratamientos(
  idtratamiento SERIAL primary key,
  nombre VARCHAR(100) not null unique,
  precio numeric(10,2) not null,
  descripcion text,
  duracion integer not null,
  idCategoria integer references categorias(idcategoria)
);

create table Distritos(
idDistrito Serial primary key,
nombre VARCHAR(100) unique

);

create table empleados(
 idEmpleado Serial primary key,
 nombre VARCHAR(100) not null,
 especialidad VARCHAR(100) not null,
 horasTrabajo integer not null,
 direccion text not null,
 DNI VARCHAR(11) not null,
 telefono VARCHAR(10) not null,
 idDistrito integer references Distritos(idDistrito),
 esFijo boolean 
);

create table clientes(
  idcliente Serial primary key,
  nombre VARCHAR(100) not null 
);

create table paquetes(
  idpaquete SERIAL primary key,
  nombre VARCHAR(100) not null unique,
  precio numeric(10,2) not null 
);

create table materiales(
  idmaterial Serial primary key,
  nombre Varchar(100) not null
);

create table contenidopaquete(
  idpaquete integer references paquetes(idpaquete),
  idtratamiento integer references tratamientos(idtratamiento),
  primary key(idpaquete, idtratamiento)
);

create table MaterialesPorTratamiento(
  idtratamiento integer references tratamientos(idtratamiento),
  idmaterial integer references materiales(idmaterial),
  cantidad integer default 1,
  primary key(idtratamiento, idmaterial)
);

create table empleadosPorArea(
 idEmpleado integer references empleados(idEmpleado),
 idArea integer references areas(idArea),
 primary key(idEmpleado, idArea)

);

create table paquetevendido(
  idpaquetevendido Serial primary key,
  idpaquete integer references paquetes(idpaquete),
  idcliente integer references clientes(idcliente),
  fechacompra date not null,
  fechainicio date not null,
  fechafin date not null
);

create table EmpleadosFijosPorTratamiento(
 idEmpleadoFijo integer references empleados(idEmpleado),
 idTratamiento integer references tratamientos(idTratamiento),
 primary key (idEmpleadoFijo, idTratamiento)
);

create table citas(
  idcita SERIAL primary key,
  idcliente integer references clientes(idcliente),
  idtratamiento integer references tratamientos(idtratamiento),
  fecha date not null,
  hora time not null,
  observaciones text,
  idpaquetevendido integer references paquetevendido(idpaquetevendido),
  idEmpleado Integer references empleados(idEmpleado),
  estado VARCHAR(20) default 'pendiente' check (estado in ('pendiente', 'realizada', 'cancelada'))
);

create table MaterialesPorCita(
  idCita Integer references citas(idcita),
  idMaterial Integer references Materiales(idMaterial),
  cantidadMaterialUtilizado Integer not null ,
  primary key (idCita, idMaterial)
);