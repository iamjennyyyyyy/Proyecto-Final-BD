--
-- PostgreSQL database cluster dump
--

-- Started on 2026-05-29 01:36:42

\restrict iBfo1dYZrkZbIUvgKIFiipVO8YX8j7ClRUEm6n0TVk04RvabvrxuhEMAGiGwN0d

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:QxA2+qpk/S90iSo3pY7Ucw==$RV36G5F6/zvhwWe+p13BIkOUFgSkWRrU7OGXTEWt7cg=:tuTYRrMnof5rh5gGFRv1xnpKRMEt5f7pr80ZG8xysFI=';

--
-- User Configurations
--






\unrestrict iBfo1dYZrkZbIUvgKIFiipVO8YX8j7ClRUEm6n0TVk04RvabvrxuhEMAGiGwN0d

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict IgC3e69tSMYSUTHM3h5Yuvyrf5pJfAwA5IAyBNsREBbq5cx0YevdA8ULbpJVbUT

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-29 01:36:42

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

-- Completed on 2026-05-29 01:36:42

--
-- PostgreSQL database dump complete
--

\unrestrict IgC3e69tSMYSUTHM3h5Yuvyrf5pJfAwA5IAyBNsREBbq5cx0YevdA8ULbpJVbUT

--
-- Database "SPA" dump
--

--
-- PostgreSQL database dump
--

\restrict 9b7iSHC9xmk9UA9TjO44vfXhKcMo1QpXJ8mCl8d2O1yz6MZqT6x02GoMpvFJcmA

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-29 01:36:42

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
-- TOC entry 5113 (class 1262 OID 16389)
-- Name: SPA; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "SPA" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Cuba.1252';


\unrestrict 9b7iSHC9xmk9UA9TjO44vfXhKcMo1QpXJ8mCl8d2O1yz6MZqT6x02GoMpvFJcmA
\connect "SPA"
\restrict 9b7iSHC9xmk9UA9TjO44vfXhKcMo1QpXJ8mCl8d2O1yz6MZqT6x02GoMpvFJcmA

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.areas (
    idarea integer NOT NULL,
    nombre character varying(200) CONSTRAINT areas_nombrearea_not_null NOT NULL,
    cantidadpersonalfijo integer NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: areas_idarea_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.areas_idarea_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 219
-- Name: areas_idarea_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.areas_idarea_seq OWNED BY public.areas.idarea;


--
-- TOC entry 222 (class 1259 OID 16401)
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    idcategoria integer NOT NULL,
    nombre character varying(200) CONSTRAINT categorias_nombrecategoria_not_null NOT NULL,
    idarea integer
);


--
-- TOC entry 221 (class 1259 OID 16400)
-- Name: categorias_idcategoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_idcategoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_idcategoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_idcategoria_seq OWNED BY public.categorias.idcategoria;


--
-- TOC entry 242 (class 1259 OID 16586)
-- Name: citas; Type: TABLE; Schema: public; Owner: -
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
    precio numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT citas_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'realizada'::character varying, 'cancelada'::character varying])::text[])))
);


--
-- TOC entry 241 (class 1259 OID 16585)
-- Name: citas_idcita_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.citas_idcita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 241
-- Name: citas_idcita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.citas_idcita_seq OWNED BY public.citas.idcita;


--
-- TOC entry 230 (class 1259 OID 16466)
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes (
    idcliente integer NOT NULL,
    nombre character varying(100) CONSTRAINT clientes_nombrecliente_not_null NOT NULL,
    ci character varying(15) NOT NULL,
    telefono character varying(15),
    email character varying(100)
);


--
-- TOC entry 229 (class 1259 OID 16465)
-- Name: clientes_idcliente_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clientes_idcliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 229
-- Name: clientes_idcliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clientes_idcliente_seq OWNED BY public.clientes.idcliente;


--
-- TOC entry 235 (class 1259 OID 16495)
-- Name: contenidopaquete; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contenidopaquete (
    idpaquete integer NOT NULL,
    idtratamiento integer NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16435)
-- Name: distritos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.distritos (
    iddistrito integer NOT NULL,
    nombre character varying(100)
);


--
-- TOC entry 225 (class 1259 OID 16434)
-- Name: distritos_iddistrito_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.distritos_iddistrito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 225
-- Name: distritos_iddistrito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.distritos_iddistrito_seq OWNED BY public.distritos.iddistrito;


--
-- TOC entry 228 (class 1259 OID 16445)
-- Name: empleados; Type: TABLE; Schema: public; Owner: -
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
    esfijo boolean
);


--
-- TOC entry 227 (class 1259 OID 16444)
-- Name: empleados_idempleado_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.empleados_idempleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 227
-- Name: empleados_idempleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.empleados_idempleado_seq OWNED BY public.empleados.idempleado;


--
-- TOC entry 240 (class 1259 OID 16568)
-- Name: empleadosfijosportratamiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empleadosfijosportratamiento (
    idempleadofijo integer NOT NULL,
    idtratamiento integer NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 16530)
-- Name: empleadosporarea; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empleadosporarea (
    idempleado integer NOT NULL,
    idarea integer NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 16487)
-- Name: materiales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materiales (
    idmaterial integer NOT NULL,
    nombre character varying(100) CONSTRAINT materiales_nombrematerial_not_null NOT NULL,
    cantidad integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 16486)
-- Name: materiales_idmaterial_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.materiales_idmaterial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 233
-- Name: materiales_idmaterial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.materiales_idmaterial_seq OWNED BY public.materiales.idmaterial;


--
-- TOC entry 243 (class 1259 OID 16619)
-- Name: materialesporcita; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materialesporcita (
    idcita integer NOT NULL,
    idmaterial integer NOT NULL,
    cantidadusada integer CONSTRAINT materialesporcita_cantidadmaterialutilizado_not_null NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 16512)
-- Name: materialesportratamiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materialesportratamiento (
    idtratamiento integer NOT NULL,
    idmaterial integer NOT NULL,
    cantidad integer DEFAULT 1
);


--
-- TOC entry 232 (class 1259 OID 16475)
-- Name: paquetes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paquetes (
    idpaquete integer NOT NULL,
    nombre character varying(100) CONSTRAINT paquetes_nombrepaquete_not_null NOT NULL,
    precio numeric(10,2) NOT NULL,
    duraciontotal integer DEFAULT 0 NOT NULL,
    descuento numeric(5,2) DEFAULT 0 NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 16474)
-- Name: paquetes_idpaquete_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paquetes_idpaquete_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 231
-- Name: paquetes_idpaquete_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paquetes_idpaquete_seq OWNED BY public.paquetes.idpaquete;


--
-- TOC entry 239 (class 1259 OID 16548)
-- Name: paquetevendido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paquetevendido (
    idpaquetevendido integer NOT NULL,
    idpaquete integer,
    idcliente integer,
    fechacompra date NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    precio numeric(10,2) DEFAULT 0 NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 16547)
-- Name: paquetevendido_idpaquetevendido_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paquetevendido_idpaquetevendido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 238
-- Name: paquetevendido_idpaquetevendido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paquetevendido_idpaquetevendido_seq OWNED BY public.paquetevendido.idpaquetevendido;


--
-- TOC entry 224 (class 1259 OID 16415)
-- Name: tratamientos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tratamientos (
    idtratamiento integer NOT NULL,
    nombre character varying(100) CONSTRAINT tratamientos_nombretratamiento_not_null NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion text,
    duracion integer NOT NULL,
    idcategoria integer
);


--
-- TOC entry 223 (class 1259 OID 16414)
-- Name: tratamientos_idtratamiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tratamientos_idtratamiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 223
-- Name: tratamientos_idtratamiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tratamientos_idtratamiento_seq OWNED BY public.tratamientos.idtratamiento;


--
-- TOC entry 4874 (class 2604 OID 16394)
-- Name: areas idarea; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas ALTER COLUMN idarea SET DEFAULT nextval('public.areas_idarea_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16404)
-- Name: categorias idcategoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN idcategoria SET DEFAULT nextval('public.categorias_idcategoria_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 16589)
-- Name: citas idcita; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas ALTER COLUMN idcita SET DEFAULT nextval('public.citas_idcita_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 16469)
-- Name: clientes idcliente; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes ALTER COLUMN idcliente SET DEFAULT nextval('public.clientes_idcliente_seq'::regclass);


--
-- TOC entry 4877 (class 2604 OID 16438)
-- Name: distritos iddistrito; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.distritos ALTER COLUMN iddistrito SET DEFAULT nextval('public.distritos_iddistrito_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 16448)
-- Name: empleados idempleado; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados ALTER COLUMN idempleado SET DEFAULT nextval('public.empleados_idempleado_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16490)
-- Name: materiales idmaterial; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiales ALTER COLUMN idmaterial SET DEFAULT nextval('public.materiales_idmaterial_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 16478)
-- Name: paquetes idpaquete; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetes ALTER COLUMN idpaquete SET DEFAULT nextval('public.paquetes_idpaquete_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16551)
-- Name: paquetevendido idpaquetevendido; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetevendido ALTER COLUMN idpaquetevendido SET DEFAULT nextval('public.paquetevendido_idpaquetevendido_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16418)
-- Name: tratamientos idtratamiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tratamientos ALTER COLUMN idtratamiento SET DEFAULT nextval('public.tratamientos_idtratamiento_seq'::regclass);


--
-- TOC entry 4893 (class 2606 OID 16657)
-- Name: areas areas_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_nombre_key UNIQUE (nombre);


--
-- TOC entry 4895 (class 2606 OID 16399)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (idarea);


--
-- TOC entry 4897 (class 2606 OID 16659)
-- Name: categorias categorias_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nombre_key UNIQUE (nombre);


--
-- TOC entry 4899 (class 2606 OID 16408)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (idcategoria);


--
-- TOC entry 4939 (class 2606 OID 16598)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (idcita);


--
-- TOC entry 4913 (class 2606 OID 16768)
-- Name: clientes clientes_ci_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_ci_key UNIQUE (ci);


--
-- TOC entry 4915 (class 2606 OID 16770)
-- Name: clientes clientes_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_email_key UNIQUE (email);


--
-- TOC entry 4917 (class 2606 OID 16661)
-- Name: clientes clientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_nombre_key UNIQUE (nombre);


--
-- TOC entry 4919 (class 2606 OID 16473)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (idcliente);


--
-- TOC entry 4929 (class 2606 OID 16501)
-- Name: contenidopaquete contenidopaquete_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_pkey PRIMARY KEY (idpaquete, idtratamiento);


--
-- TOC entry 4905 (class 2606 OID 16443)
-- Name: distritos distritos_nombredistrito_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.distritos
    ADD CONSTRAINT distritos_nombredistrito_key UNIQUE (nombre);


--
-- TOC entry 4907 (class 2606 OID 16441)
-- Name: distritos distritos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.distritos
    ADD CONSTRAINT distritos_pkey PRIMARY KEY (iddistrito);


--
-- TOC entry 4909 (class 2606 OID 16663)
-- Name: empleados empleados_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_nombre_key UNIQUE (nombre);


--
-- TOC entry 4911 (class 2606 OID 16459)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (idempleado);


--
-- TOC entry 4937 (class 2606 OID 16574)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_pkey PRIMARY KEY (idempleadofijo, idtratamiento);


--
-- TOC entry 4933 (class 2606 OID 16536)
-- Name: empleadosporarea empleadosporarea_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_pkey PRIMARY KEY (idempleado, idarea);


--
-- TOC entry 4925 (class 2606 OID 16665)
-- Name: materiales materiales_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_nombre_key UNIQUE (nombre);


--
-- TOC entry 4927 (class 2606 OID 16494)
-- Name: materiales materiales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_pkey PRIMARY KEY (idmaterial);


--
-- TOC entry 4941 (class 2606 OID 16626)
-- Name: materialesporcita materialesporcita_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_pkey PRIMARY KEY (idcita, idmaterial);


--
-- TOC entry 4931 (class 2606 OID 16519)
-- Name: materialesportratamiento materialesportratamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_pkey PRIMARY KEY (idtratamiento, idmaterial);


--
-- TOC entry 4921 (class 2606 OID 16485)
-- Name: paquetes paquetes_nombrepaquete_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_nombrepaquete_key UNIQUE (nombre);


--
-- TOC entry 4923 (class 2606 OID 16483)
-- Name: paquetes paquetes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_pkey PRIMARY KEY (idpaquete);


--
-- TOC entry 4935 (class 2606 OID 16557)
-- Name: paquetevendido paquetevendido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_pkey PRIMARY KEY (idpaquetevendido);


--
-- TOC entry 4901 (class 2606 OID 16428)
-- Name: tratamientos tratamientos_nombretratamiento_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_nombretratamiento_key UNIQUE (nombre);


--
-- TOC entry 4903 (class 2606 OID 16426)
-- Name: tratamientos tratamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_pkey PRIMARY KEY (idtratamiento);


--
-- TOC entry 4942 (class 2606 OID 16409)
-- Name: categorias categorias_idarea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_idarea_fkey FOREIGN KEY (idarea) REFERENCES public.areas(idarea);


--
-- TOC entry 4955 (class 2606 OID 16599)
-- Name: citas citas_idcliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idcliente_fkey FOREIGN KEY (idcliente) REFERENCES public.clientes(idcliente);


--
-- TOC entry 4956 (class 2606 OID 16614)
-- Name: citas citas_idempleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idempleado_fkey FOREIGN KEY (idempleado) REFERENCES public.empleados(idempleado);


--
-- TOC entry 4957 (class 2606 OID 16609)
-- Name: citas citas_idpaquetevendido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idpaquetevendido_fkey FOREIGN KEY (idpaquetevendido) REFERENCES public.paquetevendido(idpaquetevendido);


--
-- TOC entry 4958 (class 2606 OID 16604)
-- Name: citas citas_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 4945 (class 2606 OID 16502)
-- Name: contenidopaquete contenidopaquete_idpaquete_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_idpaquete_fkey FOREIGN KEY (idpaquete) REFERENCES public.paquetes(idpaquete);


--
-- TOC entry 4946 (class 2606 OID 16507)
-- Name: contenidopaquete contenidopaquete_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contenidopaquete
    ADD CONSTRAINT contenidopaquete_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 4944 (class 2606 OID 16460)
-- Name: empleados empleados_iddistrito_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_iddistrito_fkey FOREIGN KEY (iddistrito) REFERENCES public.distritos(iddistrito);


--
-- TOC entry 4953 (class 2606 OID 16575)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_idempleadofijo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_idempleadofijo_fkey FOREIGN KEY (idempleadofijo) REFERENCES public.empleados(idempleado);


--
-- TOC entry 4954 (class 2606 OID 16580)
-- Name: empleadosfijosportratamiento empleadosfijosportratamiento_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosfijosportratamiento
    ADD CONSTRAINT empleadosfijosportratamiento_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 4949 (class 2606 OID 16542)
-- Name: empleadosporarea empleadosporarea_idarea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_idarea_fkey FOREIGN KEY (idarea) REFERENCES public.areas(idarea);


--
-- TOC entry 4950 (class 2606 OID 16537)
-- Name: empleadosporarea empleadosporarea_idempleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleadosporarea
    ADD CONSTRAINT empleadosporarea_idempleado_fkey FOREIGN KEY (idempleado) REFERENCES public.empleados(idempleado);


--
-- TOC entry 4959 (class 2606 OID 16627)
-- Name: materialesporcita materialesporcita_idcita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_idcita_fkey FOREIGN KEY (idcita) REFERENCES public.citas(idcita);


--
-- TOC entry 4960 (class 2606 OID 16632)
-- Name: materialesporcita materialesporcita_idmaterial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesporcita
    ADD CONSTRAINT materialesporcita_idmaterial_fkey FOREIGN KEY (idmaterial) REFERENCES public.materiales(idmaterial);


--
-- TOC entry 4947 (class 2606 OID 16525)
-- Name: materialesportratamiento materialesportratamiento_idmaterial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_idmaterial_fkey FOREIGN KEY (idmaterial) REFERENCES public.materiales(idmaterial);


--
-- TOC entry 4948 (class 2606 OID 16520)
-- Name: materialesportratamiento materialesportratamiento_idtratamiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materialesportratamiento
    ADD CONSTRAINT materialesportratamiento_idtratamiento_fkey FOREIGN KEY (idtratamiento) REFERENCES public.tratamientos(idtratamiento);


--
-- TOC entry 4951 (class 2606 OID 16563)
-- Name: paquetevendido paquetevendido_idcliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_idcliente_fkey FOREIGN KEY (idcliente) REFERENCES public.clientes(idcliente);


--
-- TOC entry 4952 (class 2606 OID 16558)
-- Name: paquetevendido paquetevendido_idpaquete_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paquetevendido
    ADD CONSTRAINT paquetevendido_idpaquete_fkey FOREIGN KEY (idpaquete) REFERENCES public.paquetes(idpaquete);


--
-- TOC entry 4943 (class 2606 OID 16429)
-- Name: tratamientos tratamientos_idcategoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tratamientos
    ADD CONSTRAINT tratamientos_idcategoria_fkey FOREIGN KEY (idcategoria) REFERENCES public.categorias(idcategoria);


-- Completed on 2026-05-29 01:36:43

--
-- PostgreSQL database dump complete
--

\unrestrict 9b7iSHC9xmk9UA9TjO44vfXhKcMo1QpXJ8mCl8d2O1yz6MZqT6x02GoMpvFJcmA

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict xxAjkhng2rYphEZn7oyf4BgZOg10yXzEbejJML79O5xAK1hcGdPyqToehzREiN9

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-29 01:36:43

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

-- Completed on 2026-05-29 01:36:43

--
-- PostgreSQL database dump complete
--

\unrestrict xxAjkhng2rYphEZn7oyf4BgZOg10yXzEbejJML79O5xAK1hcGdPyqToehzREiN9

--
-- Database "script" dump
--

--
-- PostgreSQL database dump
--

\restrict 9A8uVcQuBxKOfzsJJLddmmpmlqbPpyXrRx7AX0JBOhrvn5UULlFlDJ443noBPdP

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-05-29 01:36:43

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
-- TOC entry 4956 (class 1262 OID 16388)
-- Name: script; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE script WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Cuba.1252';


\unrestrict 9A8uVcQuBxKOfzsJJLddmmpmlqbPpyXrRx7AX0JBOhrvn5UULlFlDJ443noBPdP
\connect script
\restrict 9A8uVcQuBxKOfzsJJLddmmpmlqbPpyXrRx7AX0JBOhrvn5UULlFlDJ443noBPdP

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

-- Completed on 2026-05-29 01:36:44

--
-- PostgreSQL database dump complete
--

\unrestrict 9A8uVcQuBxKOfzsJJLddmmpmlqbPpyXrRx7AX0JBOhrvn5UULlFlDJ443noBPdP

-- Completed on 2026-05-29 01:36:44

--
-- PostgreSQL database cluster dump complete
--

