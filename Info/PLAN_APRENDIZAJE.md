# Plan de Aprendizaje — SPA Belleza y Relajación

> *Para estudiante de Ingeniería Informática con base en C, Java, JS y PostgreSQL. Sin experiencia en web.*

---

## 🧭 Mapa del camino

```
FASE 1 ─── Entender la web (3 conceptos clave)
FASE 2 ─── Poner en funcionamiento el proyecto base
FASE 3 ─── Completar el backend (BD → API)
FASE 4 ─── Construir las vistas (frontend)
FASE 5 ─── Funcionalidades avanzadas (auth, reportes)
FASE 6 ─── Pullirlo y desplegar
```

---

## FASE 0 — Conceptos Fundamentales (ANTES de escribir código)

### 📖 Qué necesitas entender primero

| Concepto | Analogía con lo que ya sabes |
|---|---|
| **Cliente-Servidor** | Como una función main() que recibe parámetros (request) y devuelve resultados (response), pero separado en dos máquinas |
| **HTTP** (GET, POST, PUT, DELETE) | Son los métodos para pedir/crear/actualizar/eliminar, como los verbos de un CRUD en Java |
| **REST API** | Es la "interfaz" del backend, como los métodos públicos de una clase |
| **JSON** | Es como un objeto de Java/JavaScript, pero en texto para transmitir datos |
| **Ruta (Route)** | Es como un switch-case que decide qué función ejecutar según la URL que llegue |
| **Middleware** | Es como un filtro o decorador — algo por lo que pasa la petición antes de llegar a su destino |
| **View Engine (EJS)** | Es como hacer print() o System.out.println(), pero generando HTML en lugar de texto plano |

### 🎯 Ejercicio inicial (30 min)

Abre Postman o tu navegador y juega con APIs públicas:
- `GET https://jsonplaceholder.typicode.com/posts` — obtén datos
- `GET https://jsonplaceholder.typicode.com/posts/1` — obtén uno
- `POST https://jsonplaceholder.typicode.com/posts` con un cuerpo JSON — crea

Esto te muestra cómo funciona una API real.

---

## FASE 1 — Poner en Marcha el Proyecto

### 🎯 Objetivo: Ver algo en el navegador

### Paso 1.1 — Configurar el entorno

```
node -v          → Debe mostrar v18+ (si no, instalar Node.js)
npm -v           → Debe mostrar v9+
code .           → Abre VSCode en la carpeta del proyecto
```

### Paso 1.2 — Agregar dependencias faltantes

El proyecto necesita `pg` para conectar con PostgreSQL. Ejecuta:

```bash
npm install pg
```

Tu `package.json` ahora tendrá `pg` agregado.

### Paso 1.3 — Configurar la conexión a BD

Edita `src/config/database.js`:

```js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',       // tu usuario
  password: 'tuPassword', // tu contraseña
  database: 'spa_belleza',
  port: 5432
});

module.exports = pool;
```

Luego crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE spa_belleza;
```

Y ejecuta `SPA.sql` para crear las tablas, luego los inserts de prueba.

### 🧪 Prueba de concepto

Crea un archivo `prueba_conexion.js` en la raíz:

```js
const pool = require('./src/config/database');

async function test() {
  const res = await pool.query('SELECT NOW()');
  console.log('Conectado a:', res.rows[0].now);
}
test();
```

Si ves la fecha, la conexión funciona.

---

### 📚 Lo que aprendiste en FASE 1

- Cómo se instalan paquetes con npm
- Cómo se configura una conexión a PostgreSQL desde Node.js
- Cómo se ejecuta una consulta SQL desde JavaScript
- Diferencia entre el cliente psql y el cliente desde código

---

## FASE 2 — Completar el Backend (API REST)

### 🎯 Objetivo: Que todas las entidades tengan endpoints funcionales

### Paso 2.1 — Entender el patrón por capas

```
Route        →  Recibe la petición HTTP y llama al controlador adecuado
Controller   →  Toma los datos de la request, llama al servicio, arma la respuesta
Service      →  Contiene la lógica de negocio (validaciones, reglas)
Repository   →  Hace las consultas SQL directamente
Model        →  Define la estructura de los datos y validaciones básicas
```

Tu proyecto ya tiene esta estructura, pero la mayoría de archivos están vacíos.

### Paso 2.2 — El orden correcto para construir

No hagas todo a la vez. Sigue este orden, **una entidad a la vez**:

```
1. Área         (la más simple, casi sin reglas)
2. Categoría    (depende de Área)
3. Material     (simple, con stock)
4. Tratamiento  (tiene validaciones, depende de Categoría)
5. Cliente      (independiente)
6. Distrito     (independiente, simple)
7. Empleado     (depende de Distrito, tiene lógica fijo/suplente)
8. Paquete      (depende de Tratamiento)
9. Cita         (la más compleja, depende de casi todo)
10. Reportes    (solo consultas SELECT)
```

### Paso 2.3 — Plantilla para implementar una entidad

Para cada entidad, debes completar 4 archivos en este orden:

#### 1. Repository (consultas SQL)

```js
// src/repositories/areaRepository.js
const pool = require('../config/database');

const areaRepository = {
  async listarTodos() {
    const result = await pool.query('SELECT * FROM areas ORDER BY idarea');
    return result.rows;
  },

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM areas WHERE idarea = $1', [id]);
    return result.rows[0];
  },

  async guardar({ nombre }) {
    const result = await pool.query(
      'INSERT INTO areas (nombrearea, cantidadpersonalfijo) VALUES ($1, 0) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  },

  async eliminar(id) {
    await pool.query('DELETE FROM areas WHERE idarea = $1', [id]);
  }
};

module.exports = areaRepository;
```

**¿Qué aprenderás aquí?**
- Consultas parametrizadas (`$1`, `$2`) para evitar SQL injection
- `RETURNING *` para obtener los datos creados
- `result.rows` contiene los registros devueltos
- Promesas con `async/await`

#### 2. Service (lógica de negocio)

```js
// src/services/areaService.js
const areaRepository = require('../repositories/areaRepository');

const areaService = {
  async listarAreas() {
    return await areaRepository.listarTodos();
  },

  async obtenerArea(id) {
    const area = await areaRepository.buscarPorId(id);
    if (!area) throw new Error('Área no encontrada');
    return area;
  },

  async crearArea(datos) {
    // Validación
    if (!datos.nombre || datos.nombre.length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    return await areaRepository.guardar(datos);
  },

  async eliminarArea(id) {
    await this.obtenerArea(id); // valida que exista
    await areaRepository.eliminar(id);
  }
};

module.exports = areaService;
```

**¿Qué aprenderás aquí?**
- Separación de responsabilidades
- Validaciones de negocio
- Manejo de errores con throw

#### 3. Controller (manejo de HTTP)

```js
// src/controllers/areaController.js
const areaService = require('../services/areaService');

const areaController = {
  async listarTodos(req, res) {
    try {
      const areas = await areaService.listarAreas();
      res.json({ success: true, count: areas.length, data: areas });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const area = await areaService.obtenerArea(req.params.id);
      res.json({ success: true, data: area });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  },

  async crear(req, res) {
    try {
      const area = await areaService.crearArea(req.body);
      res.status(201).json({ success: true, data: area });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await areaService.eliminarArea(req.params.id);
      res.json({ success: true, message: 'Área eliminada' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

module.exports = areaController;
```

**¿Qué aprenderás aquí?**
- Cómo se reciben datos del cliente (`req.params`, `req.body`, `req.query`)
- Códigos de estado HTTP (200, 201, 400, 404, 500)
- Try/catch para manejo de errores en APIs
- Formato de respuesta JSON consistente

#### 4. Route (conexión final)

```js
// src/routes/areaRoutes.js
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.get('/', areaController.listarTodos);
router.get('/:id', areaController.obtenerPorId);
router.post('/', areaController.crear);
router.delete('/:id', areaController.eliminar);

module.exports = router;
```

**¿Qué aprenderás aquí?**
- Cómo se define una ruta con Express
- Métodos HTTP: GET, POST, PUT, PATCH, DELETE
- Parámetros de ruta (`:id`)

#### 5. Conectar en app.js

```js
const areaRoutes = require('./routes/areaRoutes');
app.use('/api/areas', areaRoutes);
```

### 🧪 Prueba cada paso con curl o Postman

```bash
# Listar áreas
curl http://localhost:3000/api/areas

# Crear área
curl -X POST http://localhost:3000/api/areas \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Masajes"}'

# Obtener una
curl http://localhost:3000/api/areas/1

# Eliminar
curl -X DELETE http://localhost:3000/api/areas/1
```

---

### 📚 Lo que aprendiste en FASE 2

- Arquitectura en capas (Route → Controller → Service → Repository → DB)
- CRUD completo para una entidad
- Consultas SQL parametrizadas
- Manejo de errores HTTP
- Cómo probar APIs con curl/Postman

---

## FASE 3 — Vistas con EJS (Frontend)

### 🎯 Objetivo: Ver formularios y tablas en el navegador

### Paso 3.1 — Configurar EJS en app.js

```js
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
```

### Paso 3.2 — Crear un layout base

`src/views/layouts/plantilla.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= titulo %></title>
  <link rel="stylesheet" href="/css/estilos.css">
</head>
<body>
  <nav>
    <a href="/areas">Áreas</a>
    <a href="/categorias">Categorías</a>
    <a href="/tratamientos">Tratamientos</a>
    <a href="/empleados">Empleados</a>
    <a href="/clientes">Clientes</a>
    <a href="/citas">Citas</a>
    <a href="/paquetes">Paquetes</a>
    <a href="/reportes">Reportes</a>
  </nav>
  <main>
    <%- body %>
  </main>
</body>
</html>
```

### Paso 3.3 — Vista para listar (ejemplo con áreas)

`src/views/areas/listar.ejs`:

```html
<h1>Listado de Áreas</h1>
<a href="/areas/nuevo">+ Nueva Área</a>

<table border="1">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Personal Fijo</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <% areas.forEach(area => { %>
      <tr>
        <td><%= area.idarea %></td>
        <td><%= area.nombrearea %></td>
        <td><%= area.cantidadpersonalfijo %></td>
        <td>
          <a href="/areas/editar/<%= area.idarea %>">Editar</a>
          <form action="/areas/eliminar/<%= area.idarea %>" method="POST" style="display:inline">
            <button type="submit">Eliminar</button>
          </form>
        </td>
      </tr>
    <% }) %>
  </tbody>
</table>
```

### Paso 3.4 — Vista para crear/editar

`src/views/areas/formulario.ejs`:

```html
<h1><%= area ? 'Editar' : 'Nueva' %> Área</h1>

<form action="<%= area ? '/areas/editar/' + area.idarea : '/areas/nuevo' %>" method="POST">
  <div>
    <label>Nombre:</label>
    <input type="text" name="nombre" value="<%= area ? area.nombrearea : '' %>" required>
  </div>
  <button type="submit">Guardar</button>
</form>

<% if (error) { %>
  <p style="color:red"><%= error %></p>
<% } %>
```

### 📚 Lo que aprendiste en FASE 3

- Renderizado del lado del servidor con EJS
- Templates y layouts
- Bucles y condicionales en plantillas
- Formularios HTML y envío POST
- Cómo pasar datos del backend al frontend

---

## FASE 4 — Lógica Compleja (Triggers + Reglas de Negocio)

### 🎯 Objetivo: Implementar las reglas de negocio en la BD

### Paso 4.1 — Triggers en PostgreSQL

Los triggers se implementan en SQL (archivo `03_triggers.sql`). Cada uno es una función + el trigger que la ejecuta:

```sql
-- Ejemplo: validar_tratamiento

CREATE OR REPLACE FUNCTION fn_validar_tratamiento()
RETURNS TRIGGER AS $$
BEGIN
  -- Precio debe ser > 0 y < 1000
  IF NEW.precio <= 0 OR NEW.precio >= 1000 THEN
    RAISE EXCEPTION 'El precio debe estar entre 0 y 1000';
  END IF;

  -- Duración múltiplo de 15, entre 15 y 240
  IF NEW.duracion % 15 != 0 OR NEW.duracion < 15 OR NEW.duracion > 240 THEN
    RAISE EXCEPTION 'La duración debe ser múltiplo de 15 y estar entre 15 y 240 minutos';
  END IF;

  -- Nombre mínimo 3 caracteres
  IF LENGTH(NEW.nombre) < 3 THEN
    RAISE EXCEPTION 'El nombre debe tener al menos 3 caracteres';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_tratamiento
  BEFORE INSERT OR UPDATE ON tratamientos
  FOR EACH ROW EXECUTE FUNCTION fn_validar_tratamiento();
```

### ¿Qué aprenderás aquí?

- `NEW` y `OLD` en triggers
- `RAISE EXCEPTION` para rechazar operaciones
- `TG_OP` para saber si es INSERT/UPDATE/DELETE
- Diferencia entre `BEFORE` y `AFTER`
- `FOR EACH ROW` vs `FOR EACH STATEMENT`

### Paso 4.2 — La cita es el caso más complejo

La cita involucra:
1. Validar fecha (no domingo, no pasada)
2. Validar hora (9-13, 14-18, respetando duración)
3. Validar que el empleado no tenga superposición
4. Si usa paquete, validar fechas del paquete
5. Al cambiar a "realizada", registrar ingreso
6. Cambiar "pendiente" → "cancelada" si la fecha ya pasó

**Estrategia recomendada**: Haz las validaciones **en el backend (service)** primero, y luego agrega los triggers como respaldo en la BD.

### 📚 Lo que aprendiste en FASE 4

- Triggers y funciones en PostgreSQL
- Validaciones complejas con múltiples condiciones
- Consistencia entre backend y base de datos
- Transacciones y manejo de errores

---

## FASE 5 — Reportes

### 🎯 Objetivo: Generar los 6 reportes requeridos

Cada reporte es una **función SQL** que devuelve una tabla. Luego creas un endpoint en Node.js que la ejecute.

```sql
-- Ejemplo: Top 3 tratamientos más solicitados
CREATE OR REPLACE FUNCTION fn_top_3_tratamientos()
RETURNS TABLE(nombre VARCHAR, total_solicitudes BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT t.nombre, COUNT(c.idcita)::BIGINT AS total
  FROM tratamientos t
  JOIN citas c ON c.idtratamiento = t.idtratamiento
  GROUP BY t.idtratamiento
  ORDER BY total DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql;
```

Luego desde Node.js:

```js
async function top3() {
  const result = await pool.query('SELECT * FROM fn_top_3_tratamientos()');
  return result.rows;
}
```

### 📚 Lo que aprendiste en FASE 5

- Funciones SQL que devuelven tablas (`RETURNS TABLE`)
- Consultas con JOIN, GROUP BY, agregaciones
- Cómo llamar funciones SQL desde Node.js

---

## FASE 6 — Autenticación y Roles

### 🎯 Objetivo: Dependiente, Admin y Empleado Fijo

Necesitas:
1. Una tabla `usuarios` con: id, username, password_hash, rol (dependiente/admin/empleado)
2. Middleware de autenticación (verificar sesión)
3. Middleware de autorización (verificar rol)
4. Login/logout con `express-session`

### Conceptos clave

- **Hash de contraseñas**: usar `bcrypt` (npm install bcrypt)
- **Sesiones**: usar `express-session` (ya está en package.json)
- **Middleware**: función que se ejecuta antes de llegar al controlador

```js
// middleware de autenticación
function requiereAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

// middleware de autorización
function requiereRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.session.usuario.rol)) {
      return res.status(403).send('Acceso denegado');
    }
    next();
  };
}
```

Uso en rutas:

```js
router.get('/areas', requiereAuth, requiereRol('admin'), areaController.listarTodos);
```

---

## 🗓️ PLAN DE TRABAJO SEMANAL (10+ hrs/semana)

| Semana | Fase | Qué harás | Entregable |
|--------|------|-----------|------------|
| **1** | FASE 1 | Configurar entorno, conectar BD, ejecutar schema + datos de prueba | Backend conectado a PostgreSQL |
| **2** | FASE 2 | Implementar Área + Categoría (repo, service, controller, route) | API funcional de áreas y categorías |
| **3** | FASE 2 | Implementar Material + Tratamiento (completo) | CRUD de materiales y tratamientos |
| **4** | FASE 2 | Implementar Cliente + Distrito + Empleado | CRUD de clientes, distritos, empleados |
| **5** | FASE 2 | Implementar Paquete + PaqueteVendido | CRUD de paquetes y ventas |
| **6** | FASE 2 | Implementar Cita (la más difícil) | CRUD de citas con validaciones |
| **7** | FASE 3 | Configurar EJS, crear layout, vistas de Área y Categoría | Páginas web funcionando |
| **8** | FASE 3 | Vistas de Tratamiento, Material, Cliente, Empleado | Frontend completo CRUD |
| **9** | FASE 3 | Vistas de Paquete, Cita, Dashboard | Frontend completo |
| **10** | FASE 4 | Triggers SQL: validar_tratamiento, validar_empleado, validar_cita | Reglas de negocio en BD |
| **11** | FASE 4 | Triggers: actualizar_stock, finalizar_cita, citas_vencidas, personal_fijo | Automatización completa |
| **12** | FASE 5 | 6 reportes SQL + vistas | Reportes funcionales |
| **13** | FASE 6 | Login, registro, roles, middlewares de auth | Sistema con roles |
| **14** | Pulido | CSS, responsive, validaciones frontend, testing | Proyecto completo |

---

## 🧠 CONCEPTOS CLAVE QUE IRÁS APRENDIENDO

| Concepto | Dónde aparece | Lo que ya sabes que se parece |
|---|---|---|
| **async/await** | En todos los repos/services | Como hilos en Java, pero más simple |
| **Promesas** | Detrás de async/await | Como Callable/Future en Java |
| **Route params** (`req.params`) | Rutas con `:id` | Parámetros de función |
| **Query params** (`req.query`) | `/api/areas?nombre=x` | Argumentos de línea de comandos |
| **Request body** (`req.body`) | POST/PUT con JSON | Parámetros de un método set |
| **HTTP Status Codes** | Respuestas del controlador | Códigos de retorno en C |
| **Middleware** | Antes de cada ruta | Decoradores en Java, filtros |
| **SQL Injection** | Consultas con `$1` | Validación de entrada como en C |
| **EJS templates** | Vistas HTML con `<%= %>` | System.out.printf() con HTML |
| **Sessions** | express-session | Variables globales por usuario |
| **Hash de contraseñas** | bcrypt | Función hash unidireccional |

---

## 💡 RECOMENDACIONES FINALES

1. **No copies y pegues**. Escribe cada línea. Es la única forma de aprender.
2. **Una entidad a la vez**. Termina Área antes de pasar a Categoría.
3. **Prueba cada endpoint** con Postman/curl antes de hacer la vista.
4. **Lee los errores**. El 90% de las veces el error te dice exactamente qué falta.
5. **Si te atascas >30 min**, pregunta. Pero intenta resolverlo antes.
6. **Usa console.log()** generosamente para ver qué está pasando.
7. **Mantén el proyecto en Git**. `git add .` + `git commit -m "mensaje"` después de cada entidad completada.

---

## 🔗 RECURSOS RECOMENDADOS

- **Node.js + Express**: https://expressjs.com/es/guide/routing.html
- **PostgreSQL desde Node**: Documentación de `node-postgres` (solo busca "node-postgres docs")
- **EJS**: https://ejs.co/#docs
- **Tus propios archivos LEEME.txt**: Cada carpeta del proyecto tiene explicaciones.
- **Las imágenes en `src/views/explicacion/`**: Muestran el flujo de datos gráficamente.

---

> "El mejor momento para empezar fue ayer. El segundo mejor momento es ahora."
