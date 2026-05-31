# Plan de Trabajo — Equipo de 3 Integrantes

> **Proyecto:** Sistema de Gestión "SPA Belleza y Relajación"
> **Arquitectura:** Node.js + Express + PostgreSQL + SPA vanilla JS
> **Objetivo de aprendizaje:** Cada integrante recorre todas las capas (BD → Backend → Frontend) en cada sprint, rotando entidades para cubrir el 100% del stack.

---

## Resumen del Estado Actual

### Lo que ya funciona (10 APIs CRUD completas)

| API | Entidad | Endpoint | Estado |
|-----|---------|----------|--------|
| 1 | Áreas | `/api/areas` | ✅ |
| 2 | Categorías | `/api/categorias` | ✅ |
| 3 | Tratamientos | `/api/tratamientos` | ✅ |
| 4 | Clientes | `/api/clientes` | ✅ |
| 5 | Distritos | `/api/distritos` | ✅ |
| 6 | Empleados | `/api/empleados` | ✅ |
| 7 | Materiales | `/api/materiales` | ✅ |
| 8 | Paquetes | `/api/paquetes` | ✅ |
| 9 | Paquetes Vendidos | `/api/paquetes-vendidos` | ✅ |
| 10 | Citas | `/api/citas` | ✅ |

### Frontend SPA (hash router)

- 11 vistas funcionales (incluyendo Dashboard y Citas)
- Navegación por `#/areas`, `#/clientes`, etc.
- CRUD completo desde el navegador (listar, crear, editar, eliminar)
- Sin frameworks, vanilla JS

### Documentación existente

- `info/GUIA_SQL_AVANZADO.md` — 788 líneas (JOINs, CTEs, Vistas, Triggers, Buenas prácticas)
- `info/PLAN_APRENDIZAJE.md` — 663 líneas (plan 14 semanas para 1 persona)
- `info/Doc resumen proyecto.txt` — especificación completa de entidades y reglas de negocio
- `info/Lee aqui.txt` — explicación del flujo de una petición

---

## Fase 0 — Bugs Críticos a Corregir (Semana 1)

> **Los 3 integrantes trabajan en paralelo.** Cada uno toma un grupo de bugs y los corrige. Al finalizar, todos conocen las 3 áreas.

### Integrante A — Backend: Repositories + Services (8 bugs)

| # | Archivo | Línea | Bug |
|---|---------|-------|-----|
| 1 | `clienteRepository.js` | 30–50 | `crear()` usa sintaxis `SET` en `INSERT` + variable `contador` undefined |
| 2 | `paqueteRepository.js` | 9–22 | `buscarPorId` y `buscarPorNombre` definidos 2 veces (el segundo sobreescribe) |
| 3 | `areaRepository.js` | 74–77 | `eliminar()` no guarda resultado → `result.rows[0]` lanza TypeError |
| 4 | `categoriaRepository.js` | 88–91 | Mismo bug que areaRepository.eliminar |
| 5 | `materialRepository.js` | 73–76 | Mismo bug que areaRepository.eliminar |
| 6 | `distritoRepository.js` | 63–64 | Mismo bug que areaRepository.eliminar |
| 7 | `paqueteRepository.js` | 94–95 | Mismo bug que areaRepository.eliminar |
| 8 | `paqueteRepository.js` | SELECTs | Segundo bloque de queries usa aliases en español (`"Nombre"`) — migrar a snake_case |

### Integrante B — Backend: Controllers + Services (6 bugs)

| # | Archivo | Línea | Bug |
|---|---------|-------|-----|
| 1 | `categoriaService.js` | 12, 18, 35 | Llama `obtenerPorId()` / `obtenerCategoriaPorId()` — métodos no existen |
| 2 | `citaController.js` | 66 | Llama `citaService.modificarCita()` — el método se llama `actualizarCita` |
| 3 | `paqueteVendidoController.js` | 25 | Llama `paqueteVendidoService.crearPaqueteV()` — el método se llama `crearPaquete` |
| 4 | `paqueteController.js` | 16 | Llama `paqueteService.obtenerPaquetePorId()` — el método tiene "s": `obtenerPaquetesPorId` |
| 5 | `tratamientoService.js` | 18 | Typo `tratemiento.nombre` (debería ser `tratamiento`) |
| 6 | `tratamientoService.js` | 33 | Llama `this.obtenerTratamiento(id)` — el método es `obtenerTratamientoPorId` |

### Integrante C — Frontend + BD (5 bugs)

| # | Archivo | Línea | Bug |
|---|---------|-------|-----|
| 1 | `src/public/js/app.js` | 323–331 | HTML malformado: cierra `</table>` dentro de `<tr>` en vez de `</td></tr>` |
| 2 | `src/public/js/app.js` | ENT forms | `tratamientos` envía `idCategoria` (camelCase) pero backend espera `idcategoria` (snake_case) |
| 3 | `src/public/js/app.js` | ENT paquetes | Formulario no incluye campo `duraciontotal` (el modelo lo requiere) |
| 4 | `src/public/js/app.js` | ENT paquetes-vendidos | Formulario no incluye campo `precio` |
| 5 | `src/public/js/app.js` | ENT citas | Formulario no incluye campo `precio` |

**BD: Ejecutar migraciones**
```sql
ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS duraciontotal NUMERIC(5,0) NOT NULL DEFAULT 30;
ALTER TABLE materiales ADD COLUMN IF NOT EXISTS cantidad INTEGER NOT NULL DEFAULT 0;
```

---

## Fase 1 — Relaciones N a N (Semana 2)

> Cada integrante implementa 2 relaciones tablas puente completas (Repository + Service + Controller + Routes + Frontend). Todos los archivos existen como esqueletos o están parcialmente implementados.

### Integrante A — Empleados vs Áreas + Tratamientos

- **`empleadosPorArea.js`**: Reparar queries (alias correctos, snake_case)
- **`empleadosFijosPorTratamiento.js`**: Crear si no existe (Repository, Service, Controller, Routes)
- **Frontend**: Vista para asignar/desasignar empleados fijos a áreas y tratamientos
- **Regla**: Solo empleados con `esFijo = true` pueden asignarse

### Integrante B — Materiales vs Tratamientos + Citas

- **`materialesPorTratamiento.js`**: Reparar bugs (alias `mpt.cantidad`, no `mat.cantidad`; parámetros intercambiados en `existeRelacion`)
- **`materialesPorCita.js`**: Crear Repository/Service/Controller/Routes
- **Frontend**: Vista para registrar materiales usados en una cita
- **Regla**: Al insertar en `materialesPorCita`, descontar del stock de `materiales`

### Integrante C — Paquete vs Tratamientos

- **`contenidoPaquete.js`**: Reparar bugs (alias `cont` vs `cp`, doble alias `cp cont`)
- Crear Service + Controller + Routes para `contenidoPaquete`
- **Frontend**: Vista para agregar/remover tratamientos de un paquete
- **Regla**: Al agregar/remover, recalcular `paquetes.duraciontotal` (suma de duraciones de tratamientos)

---

## Fase 2 — Triggers en BD (Semana 3)

> Cada integrante implementa 3 triggers en SQL y los integra con el backend (validación desde JS + trigger como respaldo).

### Integrante A — Validación de Datos

1. **`validar_tratamiento`** → BEFORE INSERT OR UPDATE: precio, duración, nombre
2. **`validar_empleado`** → BEFORE INSERT OR UPDATE: CI (11 dígitos), teléfono, horas (fijo ≤40, suplente ≤20)
3. **`validar_cita`** → BEFORE INSERT OR UPDATE: fecha no pasada, no domingo, hora 9–18, duración

### Integrante B — Automatización de Stock y Personal

1. **`actualizar_cantidad_personal_fijo`** → AFTER INSERT/UPDATE/DELETE ON empleadosPorArea: recalcula `areas.cantidadpersonalfijo`
2. **`actualizar_stock_materiales`** → AFTER INSERT ON materialesPorCita: descuenta de `materiales.cantidad`, error si negativo
3. **`finalizar_cita`** → BEFORE UPDATE ON citas: al cambiar estado a `'realizada'`, registrar ingreso

### Integrante C — Citas y Paquetes

1. **`validar_cita_en_paquete`** → BEFORE INSERT OR UPDATE ON citas: si `idpaquetevendido` no es null, validar fecha dentro del rango
2. **`actualizar_citas_vencidas`** → función SQL (llamada desde Node.js con `setInterval`): cambiar `'pendiente'` → `'cancelada'` si fecha ya pasó
3. **`validar_no_conflicto_horario_empleado`** → trigger/function: evitar superposición de citas para el mismo empleado en el mismo día

---

## Fase 3 — Reportes SQL + Endpoints (Semana 4)

> Cada integrante implementa 2 reportes completos (función SQL + endpoint /api/reportes + vista frontend).

### Integrante A — Reportes de Clientes

1. **Top 3 tratamientos más solicitados**
2. **Tratamientos y paquetes solicitados por un cliente en un periodo**
   - Endpoint: `GET /api/reportes/top-tratamientos`
   - Endpoint: `GET /api/reportes/cliente/:idCliente?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`

### Integrante B — Reportes de Personal

1. **Lista de empleados que atendieron a un cliente**
2. **Localización de personal por distrito**
   - Endpoint: `GET /api/reportes/empleados-cliente/:idCliente`
   - Endpoint: `GET /api/reportes/personal-por-distrito`

### Integrante C — Reportes de Gestión

1. **Informe de discrepancias mensual** (planificados vs realizados, materiales planif vs usados)
2. **Informe de ingresos mensual** (paquetes vendidos, tratamientos individuales, ingresos totales)
   - Endpoint: `GET /api/reportes/discrepancias?mes=MM&anio=YYYY`
   - Endpoint: `GET /api/reportes/ingresos?mes=MM&anio=YYYY`

**Archivos a crear:**
- `src/repositories/reporteRepository.js`
- `src/services/reporteService.js`
- `src/controllers/reporteController.js`
- `src/routes/reporteRoutes.js` (reemplazar el actual que importa `entidadController` inexistente)
- Registrar en `app.js`

---

## Fase 4 — Autenticación y Roles (Semana 5)

> Los 3 integrantes trabajan juntos. Cada uno implementa un rol completo.

### Integrante A — Login + Sesión (infraestructura compartida)

- Tabla `usuarios` (id, username, password_hash, rol, id_empleado nullable)
- Middleware `auth.js`: verificar sesión
- Middleware `requireRole(rol)`: autorización
- Ruta `/api/auth/login` + `/api/auth/logout`
- Vista login en frontend
- Usar `bcrypt` para hash de contraseñas

### Integrante B — Rol Dependiente

- CRUD de clientes (solo dependiente puede crear/editar clientes)
- Agenda y gestiona citas (crear, cambiar estado a realizada/cancelada)
- Registra compras de paquetes
- No puede ver: áreas, categorías, tratamientos, empleados, materiales

### Integrante C — Rol Administrador + Empleado Fijo

- **Admin**: CRUD completo de áreas, categorías, tratamientos, empleados, materiales, paquetes
- **Empleado fijo**: Solo registrar materiales usados en citas (`materialesPorCita`)
- **Admin**: Acceso a todos los reportes

---

## Fase 5 — Dashboard + Pulido (Semana 6)

### Integrante A — Dashboard avanzado

- Tarjetas con totales: clientes hoy, citas hoy, ingresos del día, empleados activos
- Gráfico de citas por día (usando Canvas API o Chart.js vía CDN)
- Próximas citas (próximas 24h)
- Alertas: stock bajo (materiales con cantidad < 10), citas vencidas sin cancelar

### Integrante B — Pruebas unitarias

- Tests con Node.js nativo (assert) o `node:test`
- Probar cada repository (crud básico)
- Probar cada service (validaciones, duplicados, existencia)
- Probar cada controller (HTTP status codes, respuestas JSON)
- Crear `tests/test_areas.js`, `tests/test_categorias.js`, etc.

### Integrante C — Refactor + Limpieza

- Unificar estilo de exportación: todos los services como objetos literales (ninguno como class instance)
- Eliminar archivos vacíos (`env.js`, `validators.js`, `dateHelpers.js`, `logger.js`, `validationMiddleware.js`, `errorHandler.js`, `index.js` de repos/models, `dashboardController.js`, `reporteController.js`, `reporteService.js`, `reporteRepository.js`)
- `reporteRoutes.js` actual: eliminar (importa `entidadController` inexistente)
- Verificar que `app.js` solo importe rutas que existen
- Añadir validación `express.urlencoded()` y `express-session` (ya en package.json)

---

## Distribución de Entregables por Semana

```
         ┌────────────────────────────────────────────────────────────┐
         │            Integrante A        │  Integrante B  │ Integrante C │
Semana 1 │ Repositories (bugs)           │ Controllers+Svc│ Frontend+BD  │
Semana 2 │ Empleado-Área-Tratamiento    │ Material-Tto-Cita│ Paquete-Tto │
Semana 3 │ Triggers validación          │ Triggers stock  │ Triggers cita│
Semana 4 │ Reportes clientes            │ Reportes perso  │ Reportes ges │
Semana 5 │ Auth (login, middleware)     │ Rol dependiente │ Rol admin+fij│
Semana 6 │ Dashboard avanzado           │ Tests unitarios │ Refactor     │
         └────────────────────────────────────────────────────────────┘
```

## Criterios de Éxito por Fase

### Semana 1 — Bugs corregidos
- [ ] Las 10 APIs responden sin errores 500
- [ ] CRUD completo desde el frontend para todas las entidades
- [ ] Formularios incluyen todos los campos requeridos por los modelos

### Semana 2 — Relaciones N a N funcionando
- [ ] Se puede asignar/desasignar empleado a área y tratamiento
- [ ] Se puede registrar material usado en una cita (descuenta stock)
- [ ] Se puede agregar/remover tratamiento de un paquete (actualiza duraciontotal)

### Semana 3 — Triggers activos
- [ ] Insert inválido de tratamiento → error desde BD
- [ ] Cambio en empleadosPorArea → actualiza cantidadpersonalfijo
- [ ] Material usado en cita → descuenta de stock (error si negativo)
- [ ] Cita con fecha pasada → cancelada automáticamente

### Semana 4 — Reportes consultables
- [ ] 6 endpoints de reporte responden con datos reales
- [ ] Vistas en frontend muestran los reportes en tablas

### Semana 5 — Login funcional
- [ ] 3 roles con permisos diferentes
- [ ] Alguien sin sesión no puede ver nada
- [ ] Dependiente solo ve clientes y citas
- [ ] Admin ve todo
- [ ] Empleado fijo solo registra materiales

### Semana 6 — Producto completo
- [ ] Dashboard muestra KPIs del día
- [ ] Tests automatizados pasan
- [ ] Sin archivos vacíos, sin bugs conocidos
- [ ] Estilo de código consistente en todo el proyecto
