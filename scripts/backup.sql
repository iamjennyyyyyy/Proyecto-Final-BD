--
-- PostgreSQL database dump
--

\restrict vt6p99pCtRUzCsdpuPNPfydSroRuhFdFm6yLlBKB98ZtdxHh7smKVHYalgL0bB5

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-06-02 14:21:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 19046)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 267 (class 1255 OID 19437)
-- Name: actualizar_cantidad_materiales(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_cantidad_materiales() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if tg_op = 'INSERT' then
    update materiales
    set cantidad = cantidad - new.cantidadusada
    where idmaterial = new.idmaterial;
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.actualizar_cantidad_materiales() OWNER TO postgres;

--
-- TOC entry 265 (class 1255 OID 19433)
-- Name: actualizar_personal_fijo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_personal_fijo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
   
    if tg_op = 'INSERT' then
        update areas
        set cantidadpersonalfijo = (
            select count(*)
            from empleadosporarea ea
            join empleados e on ea.idempleado = e.idempleado
            where ea.idarea = new.idarea and e.esfijo = true
        )
        where idarea = new.idarea;
        
        return new; 
    end if;

    if tg_op = 'DELETE' then
        update areas
        set cantidadpersonalfijo = (
            select count(*)
            from empleadosporarea ea
            join empleados e on ea.idempleado = e.idempleado
            where ea.idarea = old.idarea and e.esfijo = true
        )
        where idarea = old.idarea;
        
        return old;  
    end if;

    if tg_op = 'UPDATE' then
        if new.idarea != old.idarea then
            
            update areas
            set cantidadpersonalfijo = (
                select count(*)
                from empleadosporarea ea
                join empleados e on ea.idempleado = e.idempleado
                where ea.idarea = new.idarea and e.esfijo = true
            )
            where idarea = new.idarea;
            
            update areas
            set cantidadpersonalfijo = (
                select count(*)
                from empleadosporarea ea
                join empleados e on ea.idempleado = e.idempleado
                where ea.idarea = old.idarea and e.esfijo = true
            )
            where idarea = old.idarea;
        else
           
            update areas
            set cantidadpersonalfijo = (
                select count(*)
                from empleadosporarea ea
                join empleados e on ea.idempleado = e.idempleado
                where ea.idarea = new.idarea and e.esfijo = true
            )
            where idarea = new.idarea;
        end if;
        
        return new;  
    end if;
    
    return new;
end;
$$;


ALTER FUNCTION public.actualizar_personal_fijo() OWNER TO postgres;

--
-- TOC entry 273 (class 1255 OID 19455)
-- Name: registrar_precio_cita(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registrar_precio_cita() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.registrar_precio_cita() OWNER TO postgres;

--
-- TOC entry 275 (class 1255 OID 19459)
-- Name: registrar_precio_paquete_vendido(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registrar_precio_paquete_vendido() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.registrar_precio_paquete_vendido() OWNER TO postgres;

--
-- TOC entry 270 (class 1255 OID 19449)
-- Name: validar_dni_cliente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_dni_cliente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.validar_dni_cliente() OWNER TO postgres;

--
-- TOC entry 269 (class 1255 OID 19447)
-- Name: validar_dni_empleado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_dni_empleado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.validar_dni_empleado() OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 19445)
-- Name: validar_nombre_completo_cliente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_nombre_completo_cliente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if length(new.nombre) - length(replace(new.nombre, ' ', '')) < 1 then
    raise exception 'El nombre debe ser completo';
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.validar_nombre_completo_cliente() OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 19443)
-- Name: validar_nombre_completo_empleado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_nombre_completo_empleado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if length(new.nombre) - length(replace(new.nombre, ' ', '')) < 1 then
    raise exception 'El nombre debe ser completo';
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.validar_nombre_completo_empleado() OWNER TO postgres;

--
-- TOC entry 268 (class 1255 OID 19439)
-- Name: verificar_cantidad_suficiente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_cantidad_suficiente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare 
cantidad_actual integer;
cantidad_necesaria integer;
material RECORD;
begin 
	for material in 
	 select mpt.idmaterial, mpt.idtratamiento , m.nombre , m.cantidad as stock_actual, mpt.cantidad as cantidad_por_tratamiento
	 from MaterialesPorTratamiento mpt
	 join materiales m on mpt.idmaterial = m.idmaterial
	 where mpt.idtratamiento = new.idtratamiento
	 
	 loop 
		cantidad_actual := material.stock_actual;
		cantidad_necesaria :=material.cantidad_por_tratamiento;
	 	
		if cantidad_actual < cantidad_necesaria then 
		 RAISE EXCEPTION 'No hay suficiente stock del material "%". Disponible: %, Necesario: %',
            material.nombre, cantidad_actual, cantidad_necesaria;
		end if;
	 end loop;
	 
 RETURN NEW;
END;
$$;


ALTER FUNCTION public.verificar_cantidad_suficiente() OWNER TO postgres;

--
-- TOC entry 271 (class 1255 OID 19451)
-- Name: verificar_disponibilidad_empleado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_disponibilidad_empleado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.verificar_disponibilidad_empleado() OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 19435)
-- Name: verificar_empleado_fijo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_empleado_fijo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare 
esfijo boolean ; 
 begin
 	select e.esFijo into esfijo
 	from empleados e
 	where idEmpleado = new.idEmpleadoFijo;
 	
 	if esfijo != true then
 	 RAISE EXCEPTION 'El empleado asignado al tratamiento debe ser fijo';
 	end if;
 	
 	return new;
 end;
$$;


ALTER FUNCTION public.verificar_empleado_fijo() OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 19441)
-- Name: verificar_estado_cita(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_estado_cita() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.verificar_estado_cita() OWNER TO postgres;

--
-- TOC entry 274 (class 1255 OID 19457)
-- Name: verificar_fecha_y_hora_no_pasada(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_fecha_y_hora_no_pasada() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.verificar_fecha_y_hora_no_pasada() OWNER TO postgres;

--
-- TOC entry 276 (class 1255 OID 19461)
-- Name: verificar_fechas_paquete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_fechas_paquete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.verificar_fechas_paquete() OWNER TO postgres;

--
-- TOC entry 272 (class 1255 OID 19453)
-- Name: verificar_precio_cita(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_precio_cita() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (new.idpaquetevendido is null and new.precio = 0)
    or (new.idpaquetevendido is not null and new.precio != 0) then
    raise exception 'El precio de la cita no cumple las reglas';
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.verificar_precio_cita() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 19048)
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    idarea integer NOT NULL,
    nombre character varying(200) CONSTRAINT areas_nombrearea_not_null NOT NULL,
    cantidadpersonalfijo integer DEFAULT 0 NOT NULL,
    CONSTRAINT chk_areas_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3)),
    CONSTRAINT chk_cantidad_personal CHECK ((cantidadpersonalfijo >= 0))
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19047)
-- Name: areas_idarea_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.areas_idarea_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.areas_idarea_seq OWNER TO postgres;

--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 219
-- Name: areas_idarea_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.areas_idarea_seq OWNED BY public.areas.idarea;


--
-- TOC entry 222 (class 1259 OID 19058)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    idcategoria integer NOT NULL,
    nombre character varying(200) CONSTRAINT categorias_nombrecategoria_not_null NOT NULL,
    idarea integer,
    CONSTRAINT chk_categorias_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3))
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19057)
-- Name: categorias_idcategoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_idcategoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_idcategoria_seq OWNER TO postgres;

--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_idcategoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_idcategoria_seq OWNED BY public.categorias.idcategoria;


--
-- TOC entry 242 (class 1259 OID 19243)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    idcita integer NOT NULL,
    idcliente integer,
    idtratamiento integer,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    observaciones text,
    idpaquetevendido integer,
    idempleado integer,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    precio numeric(10,2) NOT NULL,
    CONSTRAINT chk_fecha_no_pasada CHECK ((fecha >= CURRENT_DATE)),
    CONSTRAINT chk_observaciones_validas CHECK (((observaciones IS NULL) OR (length(observaciones) < 500))),
    CONSTRAINT chk_precio_valido_cita CHECK ((precio >= (0)::numeric)),
    CONSTRAINT citas_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'realizada'::character varying, 'cancelada'::character varying])::text[])))
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 19242)
-- Name: citas_idcita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_idcita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_idcita_seq OWNER TO postgres;

--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 241
-- Name: citas_idcita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_idcita_seq OWNED BY public.citas.idcita;


--
-- TOC entry 230 (class 1259 OID 19123)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    idcliente integer NOT NULL,
    nombre character varying(100) CONSTRAINT clientes_nombrecliente_not_null NOT NULL,
    ci character varying(15) NOT NULL,
    telefono character varying(15),
    email character varying(100),
    CONSTRAINT chk_ci_valido CHECK (((ci)::text ~ '^[0-9]{11}$'::text)),
    CONSTRAINT chk_clientes_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3)),
    CONSTRAINT chk_email_valido CHECK (((email)::text ~~ '%@%'::text)),
    CONSTRAINT chk_telefono_valido_cliente CHECK (((telefono)::text ~ '^\+?[0-9]{7,15}$'::text))
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19122)
-- Name: clientes_idcliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_idcliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_idcliente_seq OWNER TO postgres;

--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 229
-- Name: clientes_idcliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_idcliente_seq OWNED BY public.clientes.idcliente;


--
-- TOC entry 235 (class 1259 OID 19152)
-- Name: contenidopaquete; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contenidopaquete (
    idpaquete integer NOT NULL,
    idtratamiento integer NOT NULL
);


ALTER TABLE public.contenidopaquete OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19092)
-- Name: distritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.distritos (
    iddistrito integer NOT NULL,
    nombre character varying(100),
    CONSTRAINT chk_distritos_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3))
);


ALTER TABLE public.distritos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19091)
-- Name: distritos_iddistrito_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.distritos_iddistrito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.distritos_iddistrito_seq OWNER TO postgres;

--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 225
-- Name: distritos_iddistrito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.distritos_iddistrito_seq OWNED BY public.distritos.iddistrito;


--
-- TOC entry 228 (class 1259 OID 19102)
-- Name: empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleados (
    idempleado integer NOT NULL,
    nombre character varying(100) CONSTRAINT empleados_nombreempleado_not_null NOT NULL,
    especialidad character varying(100) NOT NULL,
    horastrabajo integer NOT NULL,
    direccion text NOT NULL,
    dni character varying(11) NOT NULL,
    telefono character varying(10) NOT NULL,
    iddistrito integer,
    esfijo boolean,
    CONSTRAINT chk_direccion_valida CHECK (((direccion IS NOT NULL) AND (length(TRIM(BOTH FROM direccion)) > 0))),
    CONSTRAINT chk_empleados_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3)),
    CONSTRAINT chk_especialidad_valida CHECK (((especialidad IS NOT NULL) AND (length(TRIM(BOTH FROM especialidad)) > 0))),
    CONSTRAINT chk_horas_trab_validas CHECK ((horastrabajo > 0)),
    CONSTRAINT chk_telefono_valido_empleado CHECK (((telefono)::text ~ '^\+?[0-9]{7,15}$'::text))
);


ALTER TABLE public.empleados OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19101)
-- Name: empleados_idempleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empleados_idempleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empleados_idempleado_seq OWNER TO postgres;

--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 227
-- Name: empleados_idempleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empleados_idempleado_seq OWNED BY public.empleados.idempleado;


--
-- TOC entry 240 (class 1259 OID 19225)
-- Name: empleadosfijosportratamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleadosfijosportratamiento (
    idempleadofijo integer NOT NULL,
    idtratamiento integer NOT NULL
);


ALTER TABLE public.empleadosfijosportratamiento OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 19187)
-- Name: empleadosporarea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleadosporarea (
    idempleado integer NOT NULL,
    idarea integer NOT NULL
);


ALTER TABLE public.empleadosporarea OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 19144)
-- Name: materiales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materiales (
    idmaterial integer NOT NULL,
    nombre character varying(100) CONSTRAINT materiales_nombrematerial_not_null NOT NULL,
    cantidad integer,
    CONSTRAINT chk_cantidad_positiva CHECK ((cantidad >= 0)),
    CONSTRAINT chk_materiales_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3))
);


ALTER TABLE public.materiales OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19143)
-- Name: materiales_idmaterial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materiales_idmaterial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materiales_idmaterial_seq OWNER TO postgres;

--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 233
-- Name: materiales_idmaterial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materiales_idmaterial_seq OWNED BY public.materiales.idmaterial;


--
-- TOC entry 243 (class 1259 OID 19276)
-- Name: materialesporcita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materialesporcita (
    idcita integer NOT NULL,
    idmaterial integer NOT NULL,
    cantidadmaterialutilizado integer NOT NULL,
    CONSTRAINT chk_cantidad_matporcita CHECK ((cantidadmaterialutilizado >= 0))
);


ALTER TABLE public.materialesporcita OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 19169)
-- Name: materialesportratamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materialesportratamiento (
    idtratamiento integer NOT NULL,
    idmaterial integer NOT NULL,
    cantidad integer DEFAULT 1,
    CONSTRAINT chk_cantidad_matportrat CHECK ((cantidad > 0))
);


ALTER TABLE public.materialesportratamiento OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 19132)
-- Name: paquetes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paquetes (
    idpaquete integer NOT NULL,
    nombre character varying(100) CONSTRAINT paquetes_nombrepaquete_not_null NOT NULL,
    precio numeric(10,2) NOT NULL,
    duraciontotal integer,
    CONSTRAINT chk_paquetes_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3)),
    CONSTRAINT chk_precio_valido_paquete CHECK ((precio > (0)::numeric))
);


ALTER TABLE public.paquetes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19131)
-- Name: paquetes_idpaquete_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paquetes_idpaquete_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paquetes_idpaquete_seq OWNER TO postgres;

--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 231
-- Name: paquetes_idpaquete_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paquetes_idpaquete_seq OWNED BY public.paquetes.idpaquete;


--
-- TOC entry 239 (class 1259 OID 19205)
-- Name: paquetevendido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paquetevendido (
    idpaquetevendido integer NOT NULL,
    idpaquete integer,
    idcliente integer,
    fechacompra date DEFAULT CURRENT_DATE NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    precio numeric(10,2) NOT NULL,
    CONSTRAINT chk_fechacompra_no_futura CHECK ((fechacompra <= CURRENT_DATE)),
    CONSTRAINT chk_fechas_validas CHECK ((fechainicio <= fechafin)),
    CONSTRAINT chk_precio_valido_paquetevend CHECK ((precio > (0)::numeric))
);


ALTER TABLE public.paquetevendido OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 19204)
-- Name: paquetevendido_idpaquetevendido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paquetevendido_idpaquetevendido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paquetevendido_idpaquetevendido_seq OWNER TO postgres;

--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 238
-- Name: paquetevendido_idpaquetevendido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paquetevendido_idpaquetevendido_seq OWNED BY public.paquetevendido.idpaquetevendido;


--
-- TOC entry 224 (class 1259 OID 19072)
-- Name: tratamientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tratamientos (
    idtratamiento integer NOT NULL,
    nombre character varying(100) CONSTRAINT tratamientos_nombretratamiento_not_null NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion text,
    duracion integer NOT NULL,
    idcategoria integer,
    CONSTRAINT chk_duracion_valida CHECK ((duracion > 0)),
    CONSTRAINT chk_precio_valido_trat CHECK ((precio > (0)::numeric)),
    CONSTRAINT chk_tratamientos_nombre CHECK ((length(TRIM(BOTH FROM nombre)) > 3))
);


ALTER TABLE public.tratamientos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19071)
-- Name: tratamientos_idtratamiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tratamientos_idtratamiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tratamientos_idtratamiento_seq OWNER TO postgres;

--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 223
-- Name: tratamientos_idtratamiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tratamientos_idtratamiento_seq OWNED BY public.tratamientos.idtratamiento;


--
-- TOC entry 250 (class 1259 OID 19505)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    idusuario integer NOT NULL,
    username character varying(50) NOT NULL,
    rol character varying(20) DEFAULT 'dependiente'::character varying,
    contrasena character varying(255) NOT NULL,
    salt character varying(32) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['dependiente'::character varying, 'administrador'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 19504)
-- Name: usuarios_idusuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_idusuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_idusuario_seq OWNER TO postgres;

--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 249
-- Name: usuarios_idusuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_idusuario_seq OWNED BY public.usuarios.idusuario;


--
-- TOC entry 244 (class 1259 OID 19473)
-- Name: vw_citas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_citas AS
 SELECT t.nombre AS tratamiento_nombre,
    cl.nombre AS cliente_nombre,
    c.fecha,
    c.hora,
    e.nombre AS empleado_nombre,
    c.observaciones,
    c.precio,
    c.estado
   FROM (((((public.citas c
     LEFT JOIN public.tratamientos t ON ((t.idtratamiento = c.idtratamiento)))
     LEFT JOIN public.empleados e ON ((e.idempleado = c.idempleado)))
     LEFT JOIN public.clientes cl ON ((cl.idcliente = c.idcliente)))
     LEFT JOIN public.paquetevendido pv ON ((pv.idpaquetevendido = c.idpaquetevendido)))
     LEFT JOIN public.paquetes p ON ((pv.idpaquete = p.idpaquete)));


ALTER VIEW public.vw_citas OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19478)
-- Name: vw_empleados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_empleados AS
 SELECT e.nombre,
    e.dni,
    e.especialidad,
    e.esfijo,
    e.horastrabajo,
    e.direccion,
    e.telefono,
    d.nombre AS distrito_nombre,
    a.nombre AS area_nombre
   FROM (((public.empleados e
     LEFT JOIN public.distritos d ON ((d.iddistrito = e.iddistrito)))
     LEFT JOIN public.empleadosporarea epa ON ((epa.idempleado = e.idempleado)))
     LEFT JOIN public.areas a ON ((a.idarea = epa.idarea)));


ALTER VIEW public.vw_empleados OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19488)
-- Name: vw_paquete_con_tratamientos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_paquete_con_tratamientos AS
 SELECT p.nombre AS paquete_nombre,
    p.duraciontotal AS duracion_total,
    p.precio,
    string_agg((t.nombre)::text, ', '::text ORDER BY (t.nombre)::text) AS tratamientos
   FROM ((public.paquetes p
     LEFT JOIN public.contenidopaquete cp ON ((cp.idpaquete = p.idpaquete)))
     LEFT JOIN public.tratamientos t ON ((cp.idtratamiento = t.idtratamiento)))
  GROUP BY p.nombre, p.duraciontotal, p.precio, p.idpaquete
  ORDER BY p.idpaquete;


ALTER VIEW public.vw_paquete_con_tratamientos OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 19483)
-- Name: vw_paquete_vendido_con_tratamientos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_paquete_vendido_con_tratamientos AS
 SELECT p.nombre AS paquete_nombre,
    p.duraciontotal,
    p.precio,
    c.nombre AS cliente_nombre,
    string_agg((t.nombre)::text, ', '::text ORDER BY (t.nombre)::text) AS tratamientos,
    pv.fechacompra AS fecha_compra,
    pv.fechainicio AS fecha_inicio,
    pv.fechafin AS fecha_fin
   FROM ((((public.paquetevendido pv
     LEFT JOIN public.paquetes p ON ((pv.idpaquete = p.idpaquete)))
     LEFT JOIN public.clientes c ON ((pv.idcliente = c.idcliente)))
     LEFT JOIN public.contenidopaquete cp ON ((cp.idpaquete = p.idpaquete)))
     LEFT JOIN public.tratamientos t ON ((cp.idtratamiento = t.idtratamiento)))
  GROUP BY p.nombre, p.duraciontotal, p.precio, c.nombre, pv.fechacompra, pv.fechainicio, pv.fechafin, pv.idpaquetevendido
  ORDER BY pv.idpaquetevendido;


ALTER VIEW public.vw_paquete_vendido_con_tratamientos OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 19493)
-- Name: vw_tratamientos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_tratamientos AS
 SELECT t.nombre,
    t.precio,
    t.duracion,
    t.descripcion,
    c.nombre AS categoria_nombre
   FROM (public.tratamientos t
     LEFT JOIN public.categorias c ON ((c.idcategoria = t.idcategoria)))
  ORDER BY t.idtratamiento;


ALTER VIEW public.vw_tratamientos OWNER TO postgres;

--
-- TOC entry 4961 (class 2604 OID 19051)
-- Name: areas idarea; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas ALTER COLUMN idarea SET DEFAULT nextval('public.areas_idarea_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 19061)
-- Name: categorias idcategoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN idcategoria SET DEFAULT nextval('public.categorias_idcategoria_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 19246)
-- Name: citas idcita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN idcita SET DEFAULT nextval('public.citas_idcita_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 19126)
-- Name: clientes idcliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN idcliente SET DEFAULT nextval('public.clientes_idcliente_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 19095)
-- Name: distritos iddistrito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distritos ALTER COLUMN iddistrito SET DEFAULT nextval('public.distritos_iddistrito_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 19105)
-- Name: empleados idempleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados ALTER COLUMN idempleado SET DEFAULT nextval('public.empleados_idempleado_seq'::regclass);


--
-- TOC entry 4969 (class 2604 OID 19147)
-- Name: materiales idmaterial; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales ALTER COLUMN idmaterial SET DEFAULT nextval('public.materiales_idmaterial_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 19135)
-- Name: paquetes idpaquete; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes ALTER COLUMN idpaquete SET DEFAULT nextval('public.paquetes_idpaquete_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 19208)
-- Name: paquetevendido idpaquetevendido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetevendido ALTER COLUMN idpaquetevendido SET DEFAULT nextval('public.paquetevendido_idpaquetevendido_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 19075)
-- Name: tratamientos idtratamiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos ALTER COLUMN idtratamiento SET DEFAULT nextval('public.tratamientos_idtratamiento_seq'::regclass);


--
-- TOC entry 4975 (class 2604 OID 19508)
-- Name: usuarios idusuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN idusuario SET DEFAULT nextval('public.usuarios_idusuario_seq'::regclass);


--
-- TOC entry 5009 (class 2606 OID 19056)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (idarea);


--
-- TOC entry 5013 (class 2606 OID 19065)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (idcategoria);


--
-- TOC entry 5031 (class 2606 OID 19405)
-- Name: clientes ci_unique_cliente; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT ci_unique_cliente UNIQUE (ci);


--
-- TOC entry 5059 (class 2606 OID 19255)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (idcita);


--
-- TOC entry 5033 (class 2606 OID 19368)
-- Name: clientes clientes_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_ci_key UNIQUE (ci);


--
-- TOC entry 5035 (class 2606 OID 19370)
-- Name: clientes clientes_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_email_key UNIQUE (email);


--
-- TOC entry 5037 (class 2606 OID 19130)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (idcliente);


--
-- TOC entry 5049 (class 2606 OID 19158)
-- Name: contenidopaquete contenidopaquete_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_pkey PRIMARY KEY (idpaquete, idtratamiento);


--
-- TOC entry 5023 (class 2606 OID 19100)
-- Name: distritos distritos_nombredistrito_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distritos
    ADD CONSTRAINT distritos_nombredistrito_key UNIQUE (nombre);


--
-- TOC entry 5025 (class 2606 OID 19098)
-- Name: distritos distritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distritos
    ADD CONSTRAINT distritos_pkey PRIMARY KEY (iddistrito);


--
-- TOC entry 5029 (class 2606 OID 19116)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (idempleado);


--
-- TOC entry 5057 (class 2606 OID 19231)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_pkey PRIMARY KEY (idempleadofijo, idtratamiento);


--
-- TOC entry 5053 (class 2606 OID 19193)
-- Name: empleadosporarea empleadosporarea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_pkey PRIMARY KEY (idempleado, idarea);


--
-- TOC entry 5045 (class 2606 OID 19151)
-- Name: materiales materiales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_pkey PRIMARY KEY (idmaterial);


--
-- TOC entry 5061 (class 2606 OID 19283)
-- Name: materialesporcita materialesporcita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_pkey PRIMARY KEY (idcita, idmaterial);


--
-- TOC entry 5051 (class 2606 OID 19176)
-- Name: materialesportratamiento materialesportratamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_pkey PRIMARY KEY (idtratamiento, idmaterial);


--
-- TOC entry 5011 (class 2606 OID 19374)
-- Name: areas nombre_unique_area; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT nombre_unique_area UNIQUE (nombre);


--
-- TOC entry 5015 (class 2606 OID 19379)
-- Name: categorias nombre_unique_categoria; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT nombre_unique_categoria UNIQUE (nombre);


--
-- TOC entry 5027 (class 2606 OID 19382)
-- Name: distritos nombre_unique_distrito; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distritos
    ADD CONSTRAINT nombre_unique_distrito UNIQUE (nombre);


--
-- TOC entry 5047 (class 2606 OID 19385)
-- Name: materiales nombre_unique_material; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT nombre_unique_material UNIQUE (nombre);


--
-- TOC entry 5039 (class 2606 OID 19389)
-- Name: paquetes nombre_unique_paquete; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT nombre_unique_paquete UNIQUE (nombre);


--
-- TOC entry 5017 (class 2606 OID 19393)
-- Name: tratamientos nombre_unique_tratamiento; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT nombre_unique_tratamiento UNIQUE (nombre);


--
-- TOC entry 5041 (class 2606 OID 19142)
-- Name: paquetes paquetes_nombrepaquete_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_nombrepaquete_key UNIQUE (nombre);


--
-- TOC entry 5043 (class 2606 OID 19140)
-- Name: paquetes paquetes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_pkey PRIMARY KEY (idpaquete);


--
-- TOC entry 5055 (class 2606 OID 19214)
-- Name: paquetevendido paquetevendido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_pkey PRIMARY KEY (idpaquetevendido);


--
-- TOC entry 5019 (class 2606 OID 19085)
-- Name: tratamientos tratamientos_nombretratamiento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_nombretratamiento_key UNIQUE (nombre);


--
-- TOC entry 5021 (class 2606 OID 19083)
-- Name: tratamientos tratamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_pkey PRIMARY KEY (idtratamiento);


--
-- TOC entry 5063 (class 2606 OID 19517)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (idusuario);


--
-- TOC entry 5065 (class 2606 OID 19519)
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- TOC entry 5098 (class 2620 OID 19438)
-- Name: materialesporcita trg_actualizar_cantidad_materiales; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_cantidad_materiales AFTER INSERT ON public.materialesporcita FOR EACH ROW EXECUTE FUNCTION public.actualizar_cantidad_materiales();


--
-- TOC entry 5089 (class 2620 OID 19434)
-- Name: empleadosporarea trg_actualizar_personal_fijo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_actualizar_personal_fijo AFTER INSERT OR DELETE OR UPDATE ON public.empleadosporarea FOR EACH ROW EXECUTE FUNCTION public.actualizar_personal_fijo();


--
-- TOC entry 5093 (class 2620 OID 19456)
-- Name: citas trg_registrar_precio_cita; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_registrar_precio_cita BEFORE INSERT OR UPDATE ON public.citas FOR EACH ROW EXECUTE FUNCTION public.registrar_precio_cita();


--
-- TOC entry 5090 (class 2620 OID 19460)
-- Name: paquetevendido trg_registrar_precio_paquete_vendido; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_registrar_precio_paquete_vendido BEFORE INSERT OR UPDATE ON public.paquetevendido FOR EACH ROW EXECUTE FUNCTION public.registrar_precio_paquete_vendido();


--
-- TOC entry 5087 (class 2620 OID 19450)
-- Name: clientes trg_validar_dni_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_dni_cliente BEFORE INSERT OR UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.validar_dni_cliente();


--
-- TOC entry 5085 (class 2620 OID 19448)
-- Name: empleados trg_validar_dni_empleado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_dni_empleado BEFORE INSERT OR UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.validar_dni_empleado();


--
-- TOC entry 5088 (class 2620 OID 19446)
-- Name: clientes trg_validar_nombre_completo_cliente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_nombre_completo_cliente BEFORE INSERT OR UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.validar_nombre_completo_cliente();


--
-- TOC entry 5086 (class 2620 OID 19444)
-- Name: empleados trg_validar_nombre_completo_empleado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_nombre_completo_empleado BEFORE INSERT OR UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.validar_nombre_completo_empleado();


--
-- TOC entry 5094 (class 2620 OID 19440)
-- Name: citas trg_verificar_cantidad_suficiente; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_cantidad_suficiente BEFORE INSERT ON public.citas FOR EACH ROW EXECUTE FUNCTION public.verificar_cantidad_suficiente();


--
-- TOC entry 5095 (class 2620 OID 19452)
-- Name: citas trg_verificar_disponibilidad_empleado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_disponibilidad_empleado BEFORE INSERT OR UPDATE ON public.citas FOR EACH ROW EXECUTE FUNCTION public.verificar_disponibilidad_empleado();


--
-- TOC entry 5092 (class 2620 OID 19436)
-- Name: empleadosfijosportratamiento trg_verificar_empleado_fijo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_empleado_fijo BEFORE INSERT ON public.empleadosfijosportratamiento FOR EACH ROW EXECUTE FUNCTION public.verificar_empleado_fijo();


--
-- TOC entry 5099 (class 2620 OID 19442)
-- Name: materialesporcita trg_verificar_estado_cita; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_estado_cita BEFORE INSERT ON public.materialesporcita FOR EACH ROW EXECUTE FUNCTION public.verificar_estado_cita();


--
-- TOC entry 5096 (class 2620 OID 19458)
-- Name: citas trg_verificar_fecha_y_hora_no_pasada; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_fecha_y_hora_no_pasada BEFORE INSERT OR UPDATE ON public.citas FOR EACH ROW EXECUTE FUNCTION public.verificar_fecha_y_hora_no_pasada();


--
-- TOC entry 5091 (class 2620 OID 19462)
-- Name: paquetevendido trg_verificar_fechas_paquete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_fechas_paquete BEFORE INSERT OR UPDATE ON public.paquetevendido FOR EACH ROW EXECUTE FUNCTION public.verificar_fechas_paquete();


--
-- TOC entry 5097 (class 2620 OID 19454)
-- Name: citas trg_verificar_precio_cita; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_precio_cita BEFORE INSERT OR UPDATE ON public.citas FOR EACH ROW EXECUTE FUNCTION public.verificar_precio_cita();


--
-- TOC entry 5066 (class 2606 OID 19066)
-- Name: categorias categorias_idarea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_idarea_fkey FOREIGN KEY (idarea) REFERENCES public.areas(idarea);


--
-- TOC entry 5079 (class 2606 OID 19256)
-- Name: citas citas_idcliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idcliente_fkey FOREIGN KEY (idcliente) REFERENCES public.clientes(idcliente);


--
-- TOC entry 5080 (class 2606 OID 19271)
-- Name: citas citas_idempleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idempleado_fkey FOREIGN KEY (idempleado) REFERENCES public.empleados(idempleado);


--
-- TOC entry 5081 (class 2606 OID 19266)
-- Name: citas citas_idpaquetevendido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idpaquetevendido_fkey FOREIGN KEY (idpaquetevendido) REFERENCES public.paquetevendido(idpaquetevendido);


--
-- TOC entry 5082 (class 2606 OID 19261)
-- Name: citas citas_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 5069 (class 2606 OID 19159)
-- Name: contenidopaquete contenidopaquete_idpaquete_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_idpaquete_fkey FOREIGN KEY (idpaquete) REFERENCES public.paquetes(idpaquete);


--
-- TOC entry 5070 (class 2606 OID 19164)
-- Name: contenidopaquete contenidopaquete_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 5068 (class 2606 OID 19117)
-- Name: empleados empleados_iddistrito_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_iddistrito_fkey FOREIGN KEY (iddistrito) REFERENCES public.distritos(iddistrito);


--
-- TOC entry 5077 (class 2606 OID 19232)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_idempleadofijo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_idempleadofijo_fkey FOREIGN KEY (idempleadofijo) REFERENCES public.empleados(idempleado);


--
-- TOC entry 5078 (class 2606 OID 19237)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 5073 (class 2606 OID 19199)
-- Name: empleadosporarea empleadosporarea_idarea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_idarea_fkey FOREIGN KEY (idarea) REFERENCES public.areas(idarea);


--
-- TOC entry 5074 (class 2606 OID 19194)
-- Name: empleadosporarea empleadosporarea_idempleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_idempleado_fkey FOREIGN KEY (idempleado) REFERENCES public.empleados(idempleado);


--
-- TOC entry 5083 (class 2606 OID 19284)
-- Name: materialesporcita materialesporcita_idcita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_idcita_fkey FOREIGN KEY (idcita) REFERENCES public.citas(idcita);


--
-- TOC entry 5084 (class 2606 OID 19289)
-- Name: materialesporcita materialesporcita_idmaterial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_idmaterial_fkey FOREIGN KEY (idmaterial) REFERENCES public.materiales(idmaterial);


--
-- TOC entry 5071 (class 2606 OID 19182)
-- Name: materialesportratamiento materialesportratamiento_idmaterial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_idmaterial_fkey FOREIGN KEY (idmaterial) REFERENCES public.materiales(idmaterial);


--
-- TOC entry 5072 (class 2606 OID 19177)
-- Name: materialesportratamiento materialesportratamiento_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 5075 (class 2606 OID 19220)
-- Name: paquetevendido paquetevendido_idcliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_idcliente_fkey FOREIGN KEY (idcliente) REFERENCES public.clientes(idcliente);


--
-- TOC entry 5076 (class 2606 OID 19215)
-- Name: paquetevendido paquetevendido_idpaquete_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_idpaquete_fkey FOREIGN KEY (idpaquete) REFERENCES public.paquetes(idpaquete);


--
-- TOC entry 5067 (class 2606 OID 19086)
-- Name: tratamientos tratamientos_idcategoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_idcategoria_fkey FOREIGN KEY (idcategoria) REFERENCES public.categorias(idcategoria);


--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-02 14:21:06

--
-- PostgreSQL database dump complete
--

\unrestrict vt6p99pCtRUzCsdpuPNPfydSroRuhFdFm6yLlBKB98ZtdxHh7smKVHYalgL0bB5

