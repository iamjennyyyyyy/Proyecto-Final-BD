CREATE OR REPLACE VIEW public.vw_citas
AS SELECT c.idcita,
    c.idtratamiento,
    t.nombre AS tratamientonombre,
    cl.idcliente,
    cl.nombre AS clientenombre,
    c.fecha,
    c.hora,
    e.idempleado,
    e.nombre AS empleadonombre,
    c.observaciones,
    c.precio,
    c.idpaquetevendido,
    p.nombre AS paquetenombre,
    c.estado
   FROM citas c
     LEFT JOIN tratamientos t ON t.idtratamiento = c.idtratamiento
     LEFT JOIN empleados e ON e.idempleado = c.idempleado
     LEFT JOIN clientes cl ON cl.idcliente = c.idcliente
     LEFT JOIN paquetevendido pv ON pv.idpaquetevendido = c.idpaquetevendido
     LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete;


CREATE OR REPLACE VIEW public.vw_empleados
AS SELECT e.idempleado,
    e.nombre,
    e.dni,
    e.especialidad,
    e.esfijo,
    e.horastrabajo,
    e.direccion,
    e.telefono,
    e.iddistrito,
    d.nombre AS distritonombre,
    epa.idarea,
    a.nombre AS areanombre
   FROM empleados e
     LEFT JOIN distritos d ON d.iddistrito = e.iddistrito
     LEFT JOIN empleadosporarea epa ON epa.idempleado = e.idempleado
     LEFT JOIN areas a ON a.idarea = epa.idarea;


CREATE OR REPLACE VIEW public.vw_paquete_con_tratamientos
AS SELECT p.idpaquete,
    p.nombre AS paquetenombre,
    p.duraciontotal,
    p.precio,
    string_agg(t.nombre::text, ', '::text ORDER BY (t.nombre::text)) AS tratamientos
   FROM paquetes p
     LEFT JOIN contenidopaquete cp ON cp.idpaquete = p.idpaquete
     LEFT JOIN tratamientos t ON cp.idtratamiento = t.idtratamiento
  GROUP BY p.nombre, p.duraciontotal, p.precio, p.idpaquete
  ORDER BY p.idpaquete;

CREATE OR REPLACE VIEW public.vw_paquete_vendido_con_tratamientos
AS SELECT pv.idpaquetevendido,
    p.idpaquete,
    p.nombre AS paquetenombre,
    p.duraciontotal,
    p.precio,
    pv.idcliente,
    c.nombre AS clientenombre,
    string_agg(t.nombre::text, ', '::text ORDER BY (t.nombre::text)) AS tratamientos,
    pv.fechacompra,
    pv.fechainicio,
    pv.fechafin
   FROM paquetevendido pv
     LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
     LEFT JOIN clientes c ON pv.idcliente = c.idcliente
     LEFT JOIN contenidopaquete cp ON cp.idpaquete = p.idpaquete
     LEFT JOIN tratamientos t ON cp.idtratamiento = t.idtratamiento
  GROUP BY p.idpaquete, p.nombre, p.duraciontotal, p.precio, c.nombre, pv.fechacompra, pv.fechainicio, pv.fechafin, pv.idpaquetevendido
  ORDER BY pv.idpaquetevendido;


CREATE OR REPLACE VIEW public.vw_tratamientos
AS SELECT t.idtratamiento,
    t.nombre,
    t.precio,
    t.duracion,
    t.descripcion,
    t.idcategoria,
    c.nombre AS categorianombre
   FROM tratamientos t
     LEFT JOIN categorias c ON c.idcategoria = t.idcategoria
  ORDER BY t.idtratamiento;
  