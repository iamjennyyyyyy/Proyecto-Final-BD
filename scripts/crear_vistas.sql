create view vw_citas as
	 select t.nombre as tratamiento_nombre,
            cl.nombre as cliente_nombre,
            c.fecha,
            c.hora,
            e.nombre as empleado_nombre,
            c.observaciones,
            c.precio,
            c.estado
     from citas c
     left join tratamientos t on t.idtratamiento = c.idtratamiento
     left join empleados e on e.idempleado = c.idempleado
     left join clientes cl on cl.idcliente = c.idcliente
   	 left join paquetevendido pv on pv.idpaquetevendido = c.idpaquetevendido
	 left join paquetes p on pv.idpaquete = p.idpaquete;

create view vw_empleados as
	 select e.nombre, 
	 		e.dni, 
	 		e.especialidad, 
	 		e.esfijo,
            e.horastrabajo, 
            e.direccion, 
            e.telefono,
            d.nombre as distrito_nombre,
            string_agg(a.nombre, ', ' order by a.nombre) as areas
     from empleados e
     left join distritos d on d.iddistrito = e.iddistrito
     left join empleadosporarea epa on epa.idempleado = e.idempleado
     left join areas a on a.idarea = epa.idarea;

create view vw_paquete_vendido_con_tratamientos as
	select 
	    p.nombre as paquete_nombre,
	    p.duraciontotal,
	    p.precio,
	    c.nombre as cliente_nombre,
	    string_agg(t.nombre, ', ' order by t.nombre) as tratamientos,
	    pv.fechacompra as fecha_compra,
	    pv.fechainicio as fecha_inicio,
	    pv.fechafin as fecha_fin
	from paquetevendido pv
	left join paquetes p on pv.idpaquete = p.idpaquete
	left join clientes c on pv.idcliente = c.idcliente
	left join contenidopaquete cp on cp.idpaquete = p.idpaquete
	left join tratamientos t on cp.idtratamiento = t.idtratamiento
	group by p.nombre, p.duraciontotal, p.precio, c.nombre, pv.fechacompra, pv.fechainicio, pv.fechafin, pv.idpaquetevendido
	order by pv.idpaquetevendido;

create view vw_paquete_con_tratamientos as
	select 
	    p.nombre as paquete_nombre,
	    p.duraciontotal as duracion_total,
	    p.precio,
	    string_agg(t.nombre, ', ' order by t.nombre) as tratamientos
	from paquetes p
	left join contenidopaquete cp on cp.idpaquete = p.idpaquete
	left join tratamientos t on cp.idtratamiento = t.idtratamiento
	group by p.nombre, p.duraciontotal, p.precio, p.idpaquete
	order by p.idpaquete;

create view vw_tratamientos as
	select t.nombre, 
		   t.precio, 
		   t.duracion, 
		   t.descripcion,
           c.nombre as categoria_nombre
    from tratamientos t
    left join categorias c on c.idcategoria = t.idcategoria
    order by idtratamiento;