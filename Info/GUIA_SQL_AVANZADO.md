# Guía SQL Avanzada — SPA Belleza y Relajación

> PostgreSQL 18 | Proyecto Final BD

---

## Índice

1. [Consultas entre tablas (JOINs)](#1-consultas-entre-tablas-joins)
2. [Subconsultas y CTEs](#2-subconsultas-y-ctes)
3. [Vistas (Views)](#3-vistas-views)
4. [Triggers y funciones](#4-triggers-y-funciones)
5. [Validaciones con CHECK](#5-validaciones-con-check)
6. [Diagrama de relaciones del proyecto](#6-diagrama-de-relaciones-del-proyecto)
7. [Ejemplos prácticos del SPA](#7-ejemplos-prácticos-del-spa)
8. [Buenas prácticas](#8-buenas-prácticas)

---

## 1. Consultas entre tablas (JOINs)

### 1.1 INNER JOIN — Solo las que coinciden

Devuelve filas donde la condición se cumple en **ambas** tablas.

```sql
-- Tratamiento con su categoría (si la tiene)
SELECT t.idtratamiento, t.nombre AS tratamiento, c.nombre AS categoria
FROM tratamientos t
INNER JOIN categorias c ON t.idcategoria = c.idcategoria;

-- Cita con cliente y empleado asignado
SELECT c.idcita, cl.nombre AS cliente, e.nombre AS empleado, c.fecha
FROM citas c
INNER JOIN clientes cl ON c.idcliente = cl.idcliente
INNER JOIN empleados e ON c.idempleado = e.idempleado;
```

**En el proyecto:** el repositorio `paqueteVendidoRepository.js` usa `LEFT JOIN` para traer nombre del paquete y del cliente junto a cada venta.

### 1.2 LEFT / RIGHT JOIN — Incluye las que no coinciden

`LEFT JOIN` = todo de la izquierda, `NULL` donde no hay match a la derecha.

```sql
-- Todos los tratamientos, tengan o no materiales asignados
SELECT t.nombre, m.nombre AS material
FROM tratamientos t
LEFT JOIN materialesportratamiento mt ON t.idtratamiento = mt.idtratamiento
LEFT JOIN materiales m ON mt.idmaterial = m.idmaterial;

-- Todas las áreas, con o sin categorías
SELECT a.nombre AS area, c.nombre AS categoria
FROM areas a
LEFT JOIN categorias c ON a.idarea = c.idarea;
```

### 1.3 Tablas pivote (Muchos a Muchos)

Se resuelven con **dos INNER JOIN** atravesando la tabla intermedia.

```sql
-- ¿Qué tratamientos incluye cada paquete?
SELECT p.nombre AS paquete, t.nombre AS tratamiento
FROM paquetes p
INNER JOIN contenidopaquete cp ON p.idpaquete = cp.idpaquete
INNER JOIN tratamientos t ON cp.idtratamiento = t.idtratamiento;

-- ¿Qué materiales usa cada tratamiento?
SELECT t.nombre AS tratamiento, m.nombre AS material, mt.cantidad
FROM tratamientos t
INNER JOIN materialesportratamiento mt ON t.idtratamiento = mt.idtratamiento
INNER JOIN materiales m ON mt.idmaterial = m.idmaterial

-- ¿En qué áreas trabaja cada empleado?
SELECT e.nombre AS empleado, a.nombre AS area
FROM empleados e
INNER JOIN empleadosporarea ea ON e.idempleado = ea.idempleado
INNER JOIN areas a ON ea.idarea = a.idarea;
```

### 1.4 SELF JOIN — Una tabla consigo misma

Útil cuando una fila se relaciona con otra de la misma tabla.

```sql
-- Empleados que comparten distrito
SELECT e1.nombre AS empleado, e2.nombre AS companero, d.nombre AS distrito
FROM empleados e1
INNER JOIN empleados e2 ON e1.iddistrito = e2.iddistrito AND e1.idempleado < e2.idempleado
INNER JOIN distritos d ON e1.iddistrito = d.iddistrito;
```

### 1.5 FULL JOIN — Todo combinado

Une ambas tablas completas; donde no hay match, pone `NULL`.

```sql
-- Categorías y tratamientos (todos los posibles pares)
SELECT c.nombre AS categoria, t.nombre AS tratamiento
FROM categorias c
FULL JOIN tratamientos t ON c.idcategoria = t.idcategoria;
```

### 1.6 CROSS JOIN — Producto cartesiano (poco usado)

Cada fila de A se combina con cada fila de B.

```sql
-- Todos los pares posible (paquete, material) — combinación exhaustiva
SELECT p.nombre, m.nombre
FROM paquetes p
CROSS JOIN materiales m;
```

---

## 2. Subconsultas y CTEs

### 2.1 Subconsulta en WHERE

```sql
-- Tratamientos más caros que el promedio
SELECT nombre, precio
FROM tratamientos
WHERE precio > (SELECT AVG(precio) FROM tratamientos);
```

### 2.2 Subconsulta en SELECT

```sql
-- Cada paquete con el total de sus sesiones
SELECT p.nombre, p.precio,
  (SELECT COUNT(*) FROM contenidopaquete cp WHERE cp.idpaquete = p.idpaquete) AS sesiones
FROM paquetes p;
```

### 2.3 Subconsulta en FROM

```sql
-- Promedio de sesiones por paquete
SELECT AVG(sesiones.s) FROM (
  SELECT COUNT(*) AS s FROM contenidopaquete GROUP BY idpaquete
) sesiones;
```

### 2.4 CTE (WITH)

La forma más legible de escribir consultas complejas.

```sql
-- Paquetes vendidos con el total recaudado por cada uno
WITH ventas AS (
  SELECT pv.idpaquete, COUNT(*) AS cantidad, SUM(p.precio) AS total
  FROM paquetevendido pv
  INNER JOIN paquetes p ON pv.idpaquete = p.idpaquete
  GROUP BY pv.idpaquete
)
SELECT p.nombre, v.cantidad, v.total
FROM paquetes p
INNER JOIN ventas v ON p.idpaquete = v.idpaquete
ORDER BY v.total DESC;

-- Múltiples CTEs
WITH
  empleados_fijos AS (
    SELECT idempleado, nombre FROM empleados WHERE esfijo = true
  ),
  areas_con_personal AS (
    SELECT ea.idarea, COUNT(*) AS cantidad
    FROM empleadosporarea ea
    INNER JOIN empleados_fijos ef ON ea.idempleado = ef.idempleado
    GROUP BY ea.idarea
  )
SELECT a.nombre, acp.cantidad
FROM areas a
LEFT JOIN areas_con_personal acp ON a.idarea = acp.idarea;
```

---

## 3. Vistas (Views)

Una vista es una consulta guardada que se comporta como tabla virtual.

```sql
-- Vista: resumen de citas
CREATE VIEW v_citas_completas AS
SELECT
  c.idcita,
  cl.nombre AS cliente,
  t.nombre AS tratamiento,
  e.nombre AS empleado,
  c.fecha,
  c.hora,
  c.estado
FROM citas c
INNER JOIN clientes cl ON c.idcliente = cl.idcliente
INNER JOIN tratamientos t ON c.idtratamiento = t.idtratamiento
LEFT JOIN empleados e ON c.idempleado = e.idempleado;

-- Usar la vista
SELECT * FROM v_citas_completas WHERE estado = 'pendiente';

-- Vista: ingresos por mes
CREATE VIEW v_ingresos_mensuales AS
SELECT
  EXTRACT(YEAR FROM pv.fechacompra) AS anio,
  EXTRACT(MONTH FROM pv.fechacompra) AS mes,
  SUM(p.precio) AS total
FROM paquetevendido pv
INNER JOIN paquetes p ON pv.idpaquete = p.idpaquete
GROUP BY anio, mes
ORDER BY anio DESC, mes DESC;
```

**Reglas de vistas:**
- `CREATE VIEW nombre AS <SELECT>` — se crea una vez, se consulta como tabla
- `CREATE OR REPLACE VIEW` — reemplaza si ya existe
- `DROP VIEW nombre` — la elimina
- No se pueden modificar datos a través de vistas a menos que sean `WITH CHECK OPTION`

---

## 4. Triggers y funciones

Un **trigger** ejecuta automáticamente una **función** cuando ocurre un evento (`INSERT`, `UPDATE`, `DELETE`) en una tabla.

### 4.1 Ciclo de vida de un trigger

```
1. Sucede un evento en la tabla (INSERT / UPDATE / DELETE)
2. PostgreSQL ejecuta la función asociada al trigger
3. La función recibe las filas afectadas como OLD (antes) y NEW (después)
4. La función puede validar, modificar, o abortar la operación
```

### 4.2 Funciones para triggers

Deben devolver `TRIGGER` y usar `RETURN NEW`, `RETURN OLD`, o `RETURN NULL`.

```sql
-- Función básica que solo registra un mensaje
CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO auditoria (tabla, accion, usuario, momento)
  VALUES (TG_TABLE_NAME, TG_OP, current_user, NOW());
  RETURN NEW;
END;
$$;
```

**Variables especiales disponibles dentro de una función trigger:**

| Variable | Significado |
|----------|-------------|
| `NEW` | La nueva fila (INSERT / UPDATE) |
| `OLD` | La fila anterior (UPDATE / DELETE) |
| `TG_OP` | El evento: `'INSERT'`, `'UPDATE'`, `'DELETE'` |
| `TG_TABLE_NAME` | Nombre de la tabla que disparó el trigger |
| `TG_WHEN` | `'BEFORE'` o `'AFTER'` |
| `TG_LEVEL` | `'ROW'` o `'STATEMENT'` |

### 4.3 Tipos de triggers

| Tipo | Cuándo se ejecuta | Para qué sirve |
|------|-------------------|----------------|
| `BEFORE INSERT` | Antes de insertar | Validar datos, modificar valores antes de guardar, abortar si no cumple |
| `BEFORE UPDATE` | Antes de actualizar | Validar cambios, evitar modificaciones no permitidas |
| `AFTER INSERT` | Después de insertar | Auditoría, actualizar tablas de resumen (contadores) |
| `AFTER UPDATE` | Después de actualizar | Auditoría, sincronizar datos derivados |
| `BEFORE DELETE` | Antes de eliminar | Verificar que se pueda eliminar, evitar borrados accidentales |
| `AFTER DELETE` | Después de eliminar | Actualizar contadores, limpiar datos relacionados |
| `INSTEAD OF` | En vistas | Redirigir la operación a las tablas base |
| `TRUNCATE` | En TRUNCATE | Solo a nivel STATEMENT, no ROW |

### 4.4 Estructura completa de un trigger

```sql
-- 1. Crear la función
CREATE OR REPLACE FUNCTION nombre_funcion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- lógica aquí
  RETURN NEW;  -- o RETURN OLD, o RETURN NULL
END;
$$;

-- 2. Asociar el trigger a la tabla
CREATE TRIGGER nombre_trigger
  {BEFORE | AFTER | INSTEAD OF} {INSERT | UPDATE | DELETE | TRUNCATE}
  ON nombre_tabla
  [FOR EACH ROW]  -- o FOR EACH STATEMENT
  EXECUTE FUNCTION nombre_funcion();

-- 3. (Opcional) Eliminar
DROP TRIGGER IF EXISTS nombre_trigger ON nombre_tabla;
```

### 4.5 Ejemplos para el SPA

#### Ejemplo 1: Evitar eliminar un área que tiene categorías (BEFORE DELETE)

```sql
CREATE OR REPLACE FUNCTION evitar_eliminar_area_con_categorias()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM categorias WHERE idarea = OLD.idarea) THEN
    RAISE EXCEPTION 'No se puede eliminar el área "%" porque tiene categorías asociadas', OLD.nombre;
  END IF;
  RETURN OLD;  -- permite la eliminación
END;
$$;

CREATE TRIGGER trg_evitar_eliminar_area
  BEFORE DELETE ON areas
  FOR EACH ROW
  EXECUTE FUNCTION evitar_eliminar_area_con_categorias();
```

#### Ejemplo 2: Validar que un empleado fijo no tenga más de 40 horas (BEFORE INSERT / UPDATE)

```sql
CREATE OR REPLACE FUNCTION validar_horas_empleado()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.esfijo = true AND NEW.horastrabajo > 40 THEN
    RAISE EXCEPTION 'Un empleado fijo no puede trabajar más de 40 horas (intentó: %)', NEW.horastrabajo;
  END IF;
  IF NEW.horastrabajo < 4 THEN
    RAISE EXCEPTION 'Las horas mínimas son 4 por semana';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_horas_empleado
  BEFORE INSERT OR UPDATE ON empleados
  FOR EACH ROW
  EXECUTE FUNCTION validar_horas_empleado();
```

#### Ejemplo 3: Actualizar cantidad de personal fijo en áreas (AFTER INSERT / UPDATE / DELETE en empleadosPorArea)

```sql
CREATE OR REPLACE FUNCTION actualizar_personal_fijo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE areas
    SET cantidadpersonalfijo = (
      SELECT COUNT(*)
      FROM empleadosporarea ea
      INNER JOIN empleados e ON ea.idempleado = e.idempleado
      WHERE ea.idarea = NEW.idarea AND e.esfijo = true
    )
    WHERE idarea = NEW.idarea;
  END IF;
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE areas
    SET cantidadpersonalfijo = (
      SELECT COUNT(*)
      FROM empleadosporarea ea
      INNER JOIN empleados e ON ea.idempleado = e.idempleado
      WHERE ea.idarea = OLD.idarea AND e.esfijo = true
    )
    WHERE idarea = OLD.idarea;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_actualizar_personal_fijo
  AFTER INSERT OR UPDATE OR DELETE ON empleadosporarea
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_personal_fijo();
```

#### Ejemplo 4: Evitar que una cita se agenda en domingo o fuera del horario laboral (BEFORE INSERT)

```sql
CREATE OR REPLACE FUNCTION validar_horario_cita()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- No domingos
  IF EXTRACT(DOW FROM NEW.fecha) = 0 THEN
    RAISE EXCEPTION 'No se pueden agendar citas los domingos';
  END IF;
  -- Solo entre 8:00 y 18:00
  IF NEW.hora < '08:00'::time OR NEW.hora > '18:00'::time THEN
    RAISE EXCEPTION 'La hora debe estar entre 08:00 y 18:00';
  END IF;
  -- No agendar en el pasado
  IF NEW.fecha < CURRENT_DATE THEN
    RAISE EXCEPTION 'No se pueden agendar citas en el pasado';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_horario_cita
  BEFORE INSERT ON citas
  FOR EACH ROW
  EXECUTE FUNCTION validar_horario_cita();
```

#### Ejemplo 5: Registrar cambios en precios de tratamientos (AFTER UPDATE — auditoría)

```sql
CREATE TABLE IF NOT EXISTS auditoria_precios (
  id SERIAL PRIMARY KEY,
  idtratamiento INTEGER NOT NULL,
  precio_anterior NUMERIC(10,2),
  precio_nuevo NUMERIC(10,2),
  modificado_por TEXT DEFAULT current_user,
  modificado_en TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION registrar_cambio_precio()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.precio IS DISTINCT FROM NEW.precio THEN
    INSERT INTO auditoria_precios (idtratamiento, precio_anterior, precio_nuevo)
    VALUES (NEW.idtratamiento, OLD.precio, NEW.precio);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auditar_precio
  AFTER UPDATE ON tratamientos
  FOR EACH ROW
  EXECUTE FUNCTION registrar_cambio_precio();
```

#### Ejemplo 6: Validar que un paquete vendido tenga fechas coherentes (BEFORE INSERT / UPDATE)

```sql
CREATE OR REPLACE FUNCTION validar_fechas_paquetevendido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.fechacompra > NEW.fechainicio THEN
    RAISE EXCEPTION 'La fecha de compra (%) no puede ser posterior a la fecha de inicio (%)',
      NEW.fechacompra, NEW.fechainicio;
  END IF;
  IF NEW.fechainicio > NEW.fechafin THEN
    RAISE EXCEPTION 'La fecha de inicio (%) no puede ser posterior a la fecha de fin (%)',
      NEW.fechainicio, NEW.fechafin;
  END IF;
  IF NEW.fechacompra > CURRENT_DATE THEN
    RAISE EXCEPTION 'La fecha de compra no puede ser futura';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_fechas_paquetevendido
  BEFORE INSERT OR UPDATE ON paquetevendido
  FOR EACH ROW
  EXECUTE FUNCTION validar_fechas_paquetevendido();
```

#### Ejemplo 7: Eliminar en cascada manual (BEFORE DELETE)

```sql
CREATE OR REPLACE FUNCTION limpiar_cascada_categoria()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Desasignar tratamientos de esta categoría
  UPDATE tratamientos SET idcategoria = NULL WHERE idcategoria = OLD.idcategoria;
  -- También se podría eliminar los tratamientos, según la regla de negocio
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_limpiar_categoria
  BEFORE DELETE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION limpiar_cascada_categoria();
```

### 4.6 Diferencia entre RAISE EXCEPTION y RETURN NULL

| Opción | Efecto |
|--------|--------|
| `RAISE EXCEPTION 'mensaje'` | Aborta la operación y muestra error al usuario |
| `RETURN NULL` | Omite la fila (no la inserta/actualiza) sin error |
| `RETURN NEW` | Continúa con la fila modificada |
| `RETURN OLD` | En DELETE, continúa; en UPDATE, no actualiza |

Para **validaciones** siempre usa `RAISE EXCEPTION`. Para **filtros silenciosos** usa `RETURN NULL`.

### 4.7 Ver triggers existentes

```sql
-- Todos los triggers del esquema público
SELECT
  tgname AS nombre_trigger,
  relname AS tabla,
  pg_get_triggerdef(oid) AS definicion
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE NOT tgisinternal;
```

---

## 5. Validaciones con CHECK

### 5.1 CHECK simple

```sql
CREATE TABLE citas (
  idcita SERIAL PRIMARY KEY,
  estado VARCHAR(20) DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'realizada', 'cancelada'))
);
```

### 5.2 CHECK con múltiples columnas

```sql
CREATE TABLE paquetevendido (
  idpaquetevendido SERIAL PRIMARY KEY,
  fechacompra DATE NOT NULL,
  fechainicio DATE NOT NULL,
  fechafin DATE NOT NULL,
  CHECK (fechacompra <= fechainicio),
  CHECK (fechainicio <= fechafin)
);
```

### 5.3 CHECK con nombre explícito

```sql
ALTER TABLE empleados ADD CONSTRAINT chk_horas_semana
  CHECK (horastrabajo BETWEEN 4 AND 40);

ALTER TABLE paquetes ADD CONSTRAINT chk_precio_positivo
  CHECK (precio > 0);
```

### 5.4 CHECK vs Trigger: cuándo usar cada uno

| Situación | CHECK | Trigger BEFORE |
|-----------|:-----:|:--------------:|
| Validar rango de valores (`BETWEEN`, `>=`) | ✅ Recomendado | ❌ Excesivo |
| Validar lista de valores (`IN`) | ✅ Recomendado | ❌ Excesivo |
| Validar relación entre columnas de la misma fila | ✅ Recomendado | ❌ Excesivo |
| Validar contra otras tablas (subconsulta) | ❌ No soportado | ✅ Necesario |
| Validar con lógica condicional compleja | �O Limitado | ✅ Flexible |
| Auditoría / efectos secundarios | ❌ No | ✅ AFTER trigger |
| Llamar a API externa o lógica en otro lenguaje | ❌ No | ✅ Posible |

**Regla práctica:** si la validación solo mira los valores de la fila actual → usa `CHECK`. Si necesita mirar otras tablas o ejecutar lógica → usa `BEFORE INSERT/UPDATE` trigger.

---

## 6. Diagrama de relaciones del proyecto

```
areas ──< categorias ──< tratamientos >── contenidopaquete >── paquetes
 │                                             │                  │
 │        ┌────────────────────────────────────┘                  │
 │        ▼                                                        ▼
 │    materialesportratamiento                              paquetevendido
 │        │                                                      │
 │        ▼                                                      ▼
 │    materiales                                            clientes
 │
 ├──< empleadosporarea >── empleados >── distritos
 │                            │
 │                            ├──< empleadosfijosportratamiento
 │                            │
 │                            └──< citas
 │                                  │
 │                                  ├──< materialesporcita >── materiales
 │                                  │
 │                                  └──< paquetevendido (idpaquetevendido)
```

**Leyenda:**
- `──` = 1 a 1
- `──<` = 1 a muchos
- `>──<` = muchos a muchos (tabla pivote)

### Tablas pivote (muchos a muchos)

| Tabla pivote | Tabla A | Tabla B |
|--------------|---------|---------|
| `contenidopaquete` | `paquetes` | `tratamientos` |
| `materialesportratamiento` | `tratamientos` | `materiales` |
| `empleadosporarea` | `empleados` | `areas` |
| `empleadosfijosportratamiento` | `empleados` | `tratamientos` |
| `materialesporcita` | `citas` | `materiales` |

---

## 7. Ejemplos prácticos del SPA

### 7.1 Reporte: Ingresos por cliente

```sql
SELECT
  cl.idcliente,
  cl.nombre,
  COUNT(pv.idpaquetevendido) AS paquetes_comprados,
  SUM(p.precio) AS total_gastado
FROM clientes cl
LEFT JOIN paquetevendido pv ON cl.idcliente = pv.idcliente
LEFT JOIN paquetes p ON pv.idpaquete = p.idpaquete
GROUP BY cl.idcliente, cl.nombre
ORDER BY total_gastado DESC NULLS LAST;
```

### 7.2 Reporte: Ocupación de empleados

```sql
SELECT
  e.idempleado,
  e.nombre,
  COUNT(c.idcita) AS citas_asignadas,
  COUNT(c.idcita) FILTER (WHERE c.estado = 'realizada') AS citas_realizadas,
  COUNT(c.idcita) FILTER (WHERE c.estado = 'cancelada') AS citas_canceladas
FROM empleados e
LEFT JOIN citas c ON e.idempleado = c.idempleado
GROUP BY e.idempleado, e.nombre
ORDER BY citas_asignadas DESC;
```

### 7.3 Reporte: Tratamientos populares

```sql
SELECT
  t.idtratamiento,
  t.nombre,
  COUNT(c.idcita) AS veces_agendado
FROM tratamientos t
LEFT JOIN citas c ON t.idtratamiento = c.idtratamiento
GROUP BY t.idtratamiento, t.nombre
ORDER BY veces_agendado DESC;
```

### 7.4 Reporte: Materiales gastados por período

```sql
SELECT
  m.idmaterial,
  m.nombre,
  SUM(mc.cantidadmaterialutilizado) AS total_usado
FROM materiales m
INNER JOIN materialesporcita mc ON m.idmaterial = mc.idmaterial
INNER JOIN citas c ON mc.idcita = c.idcita
WHERE c.fecha BETWEEN '2026-01-01' AND '2026-12-31'
GROUP BY m.idmaterial, m.nombre
ORDER BY total_usado DESC;
```

### 7.5 Consulta: Clientes con paquetes vencidos

```sql
SELECT
  cl.nombre AS cliente,
  p.nombre AS paquete,
  pv.fechafin,
  CURRENT_DATE - pv.fechafin AS dias_vencido
FROM paquetevendido pv
INNER JOIN clientes cl ON pv.idcliente = cl.idcliente
INNER JOIN paquetes p ON pv.idpaquete = p.idpaquete
WHERE pv.fechafin < CURRENT_DATE
ORDER BY dias_vencido DESC;
```

### 7.6 CTE combinado: Resumen semanal del SPA

```sql
WITH
  citas_semana AS (
    SELECT idcita, idcliente, idtratamiento, idempleado, fecha, hora
    FROM citas
    WHERE fecha >= date_trunc('week', CURRENT_DATE)
      AND fecha < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
  ),
  materiales_usados AS (
    SELECT mc.idcita, SUM(mc.cantidadmaterialutilizado) AS total_materiales
    FROM materialesporcita mc
    INNER JOIN citas_semana cs ON mc.idcita = cs.idcita
    GROUP BY mc.idcita
  )
SELECT
  cs.fecha,
  COUNT(*) AS citas,
  COUNT(DISTINCT cs.idcliente) AS clientes_atendidos,
  COALESCE(SUM(mu.total_materiales), 0) AS materiales_gastados
FROM citas_semana cs
LEFT JOIN materiales_usados mu ON cs.idcita = mu.idcita
GROUP BY cs.fecha
ORDER BY cs.fecha;
```

---

## 8. Buenas prácticas

### 8.1 JOINs

- **Siempre usa alias** (`FROM empleados e` en vez de `FROM empleados`)
- Prefiere `INNER JOIN` sobre `FROM t1, t2 WHERE ...` (legibilidad)
- Usa `LEFT JOIN` solo cuando necesites filas de la tabla izquierda sin match
- Si usas `LEFT JOIN`, los filtros de la tabla derecha van en el `ON`, no en el `WHERE`
- Pon las columnas de JOIN en el `ON` y los filtros en el `WHERE`

```sql
-- ❌ Mal: LEFT JOIN con filtro en WHERE (se comporta como INNER)
SELECT * FROM areas a
LEFT JOIN categorias c ON a.idarea = c.idarea
WHERE c.nombre IS NOT NULL;

-- ✅ Bien: la intención es un INNER JOIN
SELECT * FROM areas a
INNER JOIN categorias c ON a.idarea = c.idarea;
```

### 8.2 Triggers

- Nombra los triggers con prefijo: `trg_accion_tabla`
  - `trg_before_insert_citas`, `trg_after_update_precios`
- Nombra las funciones con el mismo nombre del trigger o con un verbo
- Siempre especifica `FOR EACH ROW` (el default es `FOR EACH STATEMENT` que es menos común)
- Documenta qué hace el trigger con un comentario SQL
- No abuses de los triggers: si puedes validar con `CHECK` o con `UNIQUE`, úsalo
- Ten cuidado con triggers recursivos (un trigger en A que modifica B, y B tiene un trigger que modifica A)

### 8.3 CTEs vs Subconsultas

- Usa CTEs para consultas que lea otro desarrollador → más fáciles de depurar
- Usa subconsultas simples para casos de 1 línea como `WHERE x > (SELECT AVG(...))`
- PostgreSQL optimiza ambas de la misma manera, la diferencia es legibilidad

### 8.4 Rendimiento

- Crea índices en las columnas que usas en JOINs (las FK ya tienen índice implícito en PostgreSQL si son referenciadas)
- Para consultas frecuentes, crea una vista o un índice compuesto
- `EXPLAIN ANALYZE SELECT ...` muestra el plan de ejecución

```sql
-- Índice útil para búsquedas por nombre
CREATE INDEX idx_tratamientos_nombre ON tratamientos (nombre);

-- Índice compuesto para reportes de citas por fecha y estado
CREATE INDEX idx_citas_fecha_estado ON citas (fecha, estado);
```

### 8.5 Resumen: orden de escritura SQL

```sql
SELECT columnas                     -- 3. qué columnas quiero
FROM tabla_principal                -- 1. de dónde vienen los datos
JOIN otra_tabla ON condición        -- 2. cómo se relacionan
WHERE filtro                        -- 4. filtro de filas
GROUP BY columna                    -- 5. agrupación
HAVING filtro_grupo                 -- 6. filtro sobre grupos
ORDER BY columna                    -- 7. ordenar
LIMIT n OFFSET m;                   -- 8. paginación
```

---

*Documento generado para el proyecto SPA Belleza y Relajación — PostgreSQL 18*
