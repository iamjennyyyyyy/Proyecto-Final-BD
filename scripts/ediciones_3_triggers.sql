create or replace function actualizar_personal_fijo()
language plpgsql
returns trigger as $$
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then
    update areas
    set cantidadpersonalfijo = (
      select count(*)
      from empleadosporarea ea
      inner join empleados e on ea.idempleado = e.idempleado
      where ea.idarea = new.idarea and e.esfijo = true
    )
    where idarea = new.idarea;
  end if;

  if tg_op = 'UPDATE' or tg_op = 'DELETE' then
    update areas
    set cantidadpersonalfijo = (
      select count(*)
      from empleadosporarea ea
      inner join empleados e on ea.idempleado = e.idempleado
      where ea.idarea = old.idarea and e.esfijo = true
    )
    where idarea = old.idarea;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger trg_actualizar_personal_fijo
after insert or update or delete on empleadosporarea
for each row execute function actualizar_personal_fijo();


create or replace function actualizar_cantidad_materiales()
language plpgsql
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update materiales
    set cantidad = cantidad - new.cantidadusada
    where idmaterial = new.idmaterial;
  end if;

  return new;
end;
$$;

create trigger trg_actualizar_cantidad_materiales
after insert on materialesporcita
for each row execute function actualizar_cantidad_materiales();


create or replace function verificar_cantidad_suficiente()
language plpgsql
returns trigger as $$
declare
  cantidad_actual integer;
begin
  select cantidad
  into cantidad_actual
  from materiales
  where idmaterial = new.idmaterial;

  if new.cantidadusada > cantidad_actual then
    raise exception 'La cantidad actual del material es insuficiente';
  end if;

  return new;
end;
$$;

create trigger trg_verificar_cantidad_suficiente
before insert on materialesporcita
for each row execute function verificar_cantidad_suficiente();


create or replace function verificar_estado_cita()
language plpgsql
returns trigger as $$
begin
  if not exists (
    select 1
    from citas c
    where c.idcita = new.idcita
      and c.estado = 'realizada'
  ) then
    raise exception 'El material usado en una cita solo puede usarse si el estado de la cita pasó a realizada';
  end if;

  return new;
end;
$$;

create trigger trg_verificar_estado_cita
before insert on materialesporcita
for each row execute function verificar_estado_cita();


create or replace function validar_nombre_completo_empleado()
language plpgsql
returns trigger as $$
begin
  if length(new.nombre) - length(replace(new.nombre, ' ', '')) < 1 then
    raise exception 'El nombre debe ser completo';
  end if;

  return new;
end;
$$;

create trigger trg_validar_nombre_completo_empleado
before insert or update on empleados
for each row execute function validar_nombre_completo_empleado();


create or replace function validar_nombre_completo_cliente()
language plpgsql
returns trigger as $$
begin
  if length(new.nombre) - length(replace(new.nombre, ' ', '')) < 1 then
    raise exception 'El nombre debe ser completo';
  end if;

  return new;
end;
$$;

create trigger trg_validar_nombre_completo_cliente
before insert or update on clientes
for each row execute function validar_nombre_completo_cliente();


create or replace function validar_dni_empleado()
language plpgsql
returns trigger as $$
declare
  anho_real       int;
  anho_minimo     int;
  anho_maximo     int;
  anho_nacimiento int;
  mes             int;
  dia             int;
  siglo           char(1);
begin
  if length(new.dni) <> 11 then
    raise exception 'El dni debe tener exactamente 11 dígitos';
  end if;

  if new.dni ~ '[^0-9]' then
    raise exception 'El dni no puede contener letras ni símbolos';
  end if;

  anho_real := extract(year from current_date);
  anho_minimo := anho_real - 120;
  anho_maximo := anho_real - 1;

  siglo := substring(new.dni from 7 for 1);
  anho_nacimiento := cast(substring(new.dni from 1 for 2) as int);

  if siglo between '0' and '5' then
    anho_nacimiento := anho_nacimiento + 1900;
  elsif siglo between '6' and '8' then
    anho_nacimiento := anho_nacimiento + 2000;
  else
    raise exception 'El dígito de siglo en el dni es inválido';
  end if;

  if anho_nacimiento < anho_minimo or anho_nacimiento > anho_maximo then
    raise exception 'El año de nacimiento en el dni no es válido';
  end if;

  mes := cast(substring(new.dni from 3 for 2) as int);
  dia := cast(substring(new.dni from 5 for 2) as int);

  if mes < 1 or mes > 12 then
    raise exception 'El mes en el dni no es válido';
  end if;

  if dia < 1 or dia > 31 then
    raise exception 'El día en el dni no es válido';
  end if;

  if (mes in (4,6,9,11) and dia > 30) or
    (mes = 2 and ((anho_nacimiento % 4 = 0 and dia > 29) or (anho_nacimiento % 4 <> 0 and dia > 28))) then
    raise exception 'La fecha en el dni no es válida';
  end if;

  return new;
end;
$$;

create trigger trg_validar_dni_empleado
before insert or update on empleados
for each row execute function validar_dni_empleado();


create or replace function validar_dni_cliente()
language plpgsql
returns trigger as $$
declare
  anho_real       int;
  anho_minimo     int;
  anho_maximo     int;
  anho_nacimiento int;
  mes             int;
  dia             int;
  siglo           char(1);
begin
  if length(new.ci) <> 11 then
    raise exception 'El ci debe tener exactamente 11 dígitos';
  end if;

  if new.ci ~ '[^0-9]' then
    raise exception 'El ci no puede contener letras ni símbolos';
  end if;

  anho_real := extract(year from current_date);
  anho_minimo := anho_real - 120;
  anho_maximo := anho_real - 1;

  siglo := substring(new.ci from 7 for 1);
  anho_nacimiento := cast(substring(new.ci from 1 for 2) as int);

  if siglo between '0' and '5' then
    anho_nacimiento := anho_nacimiento + 1900;
  elsif siglo between '6' and '8' then
    anho_nacimiento := anho_nacimiento + 2000;
  else
    raise exception 'El dígito de siglo en el ci es inválido';
  end if;

  if anho_nacimiento < anho_minimo or anho_nacimiento > anho_maximo then
    raise exception 'El año de nacimiento en el ci no es válido';
  end if;

  mes := cast(substring(new.ci from 3 for 2) as int);
  dia := cast(substring(new.ci from 5 for 2) as int);

  if mes < 1 or mes > 12 then
    raise exception 'El mes en el ci no es válido';
  end if;

  if dia < 1 or dia > 31 then
    raise exception 'El día en el ci no es válido';
  end if;

  if (mes in (4,6,9,11) and dia > 30) or
    (mes = 2 and ((anho_nacimiento % 4 = 0 and dia > 29) or (anho_nacimiento % 4 <> 0 and dia > 28))) then
    raise exception 'La fecha en el ci no es válida';
  end if;

  return new;
end;
$$;

create trigger trg_validar_ci_cliente
before insert or update on clientes
for each row execute function validar_ci_cliente();


create or replace function verificar_disponibilidad_empleado()
language plpgsql
returns trigger as $$
declare
  nueva_duracion integer;
begin
  select duracion into nueva_duracion
  from tratamientos
  where idtratamiento = new.idtratamiento;

  if exists(
    select 1
    from citas c
    inner join tratamientos t on t.idtratamiento = c.idtratamiento
    where c.idempleado = new.idempleado
      and c.fecha = new.fecha
      and c.idcita <> coalesce(new.idcita, -1)
      and new.hora < (c.hora + (t.duracion || ' minutes')::interval)
      and (new.hora + (nueva_duracion || ' minutes')::interval) > c.hora
  ) then
    raise exception 'El empleado asignado ya tiene otra cita en ese horario';
  end if;

  return new;
end;
$$;

create trigger trg_verificar_disponibilidad_empleado
before insert or update on citas
for each row execute function verificar_disponibilidad_empleado();


create or replace function verificar_precio_cita()
language plpgsql
returns trigger as $$
begin
  if (new.idpaquetevendido is null and new.precio = 0)
    or (new.idpaquetevendido is not null and new.precio != 0) then
    raise exception 'El precio de la cita no cumple las reglas';
  end if;

  return new;
end;
$$;

create trigger trg_verificar_precio_cita
before insert or update on citas
for each row execute function verificar_precio_cita();


create or replace function registrar_precio_cita()
language plpgsql
returns trigger as $$
declare
  precio_tratamiento numeric;
begin
  if new.idpaquetevendido is null then
    select precio into precio_tratamiento
    from tratamientos
    where idtratamiento = new.idtratamiento;

    new.precio := precio_tratamiento;
  else
    new.precio := 0;
  end if;

  return new;
end;
$$;

create trigger trg_registrar_precio_cita
before insert or update on citas
for each row execute function registrar_precio_cita();


create or replace function verificar_fecha_y_hora_no_pasada()
language plpgsql
returns trigger as $$
begin
  if tg_op = 'INSERT'
    or (new.fecha, new.hora) is distinct from (old.fecha, old.hora) then

    if new.fecha < current_date
      or (new.fecha = current_date and new.hora < localtime) then
      raise exception 'La hora de la cita no puede ser pasada';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_verificar_fecha_y_hora_no_pasada
before insert or update on citas
for each row execute function verificar_fecha_y_hora_no_pasada();


create or replace function registrar_precio_paquete_vendido()
language plpgsql
returns trigger as $$
declare
  precio_paquete numeric;
begin
  select precio into precio_paquete
  from paquetes
  where idpaquete = new.idpaquete;

  if new.precio is null or new.precio != precio_paquete then
    new.precio := precio_paquete;
  end if;

  return new;
end;
$$;

create trigger trg_registrar_precio_paquete_vendido
before insert or update on paquetevendido
for each row execute function registrar_precio_paquete_vendido();


create or replace function verificar_fechas_paquete()
language plpgsql
returns trigger as $$
begin
  if tg_op = 'INSERT' and new.fechacompra != current_date then
    raise exception 'La fecha de compra debe ser actual';
  end if;

  if new.fechainicio < new.fechacompra then
    raise exception 'La fecha de inicio no debe ser anterior a la fecha de compra';
  end if;

  if new.fechafin < new.fechainicio then
    raise exception 'La fecha de fin no debe ser anterior a la fecha de inicio';
  end if;

  if new.fechafin > (new.fechacompra + 30) then
    raise exception 'La fecha de fin no puede superar los 30 días después de la compra';
  end if;

  return new;
end;
$$;

create trigger trg_verificar_fechas_paquete
before insert or update on paquetevendido
for each row execute function verificar_fechas_paquete();
