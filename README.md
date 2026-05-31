# SPA Belleza y Relajación — Sistema de Gestión

Sistema web para administrar citas, clientes, empleados, paquetes y materiales de un centro de estética y relajación. Construido con Express + PostgreSQL + Frontend SPA.

---

## Requisitos

- **Node.js** 18+
- **PostgreSQL** 14+
- **npm**

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd "Proyecto Final BD"

# 2. Instalar dependencias
npm install

# 3. Configurar la base de datos
```

## Base de datos

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE SPA;"

# Ejecutar el script de esquema
psql -U postgres -d SPA -f scripts/SPA.sql

# (Opcional) Insertar datos de prueba
psql -U postgres -d SPA -f scripts/insert_datos_adaptado.sql
```

La conexión se configura en `src/config/database.js`:

```js
host: 'localhost'
user: 'postgres'
password: 'jenn126*'
database: 'SPA'
port: 1234
```

## Ejecutar

```bash
npm start
# o
npm run dev
```

Servidor en `http://localhost:3000`

## Arquitectura

```
src/
├── app.js                  # Punto de entrada (Express)
├── config/
│   └── database.js         # Conexión a PostgreSQL
├── models/                 # Clases con validación
│   ├── Area.js
│   ├── Categoria.js
│   ├── Cita.js
│   ├── Cliente.js
│   ├── Distrito.js
│   ├── Empleado.js
│   ├── Material.js
│   ├── Paquete.js
│   └── PaqueteVendido.js
├── repositories/           # Queries SQL directas
│   ├── areaRepository.js
│   ├── categoriaRepository.js
│   ├── citaRepository.js
│   ├── clienteRepository.js
│   ├── distritoRepository.js
│   ├── empleadoRepository.js
│   ├── materialRepository.js
│   ├── paqueteRepository.js
│   └── paqueteVendidoRepository.js
├── services/               # Lógica de negocio + validaciones
│   ├── areaService.js
│   ├── categoriaService.js
│   ├── citaService.js
│   ├── clienteService.js
│   ├── distritoService.js
│   ├── empleadoService.js
│   ├── materialService.js
│   ├── paqueteService.js
│   ├── paqueteVendidoService.js
│   └── validators/
├── controllers/            # Manejadores HTTP (req → res)
│   ├── areaController.js
│   ├── categoriaController.js
│   ├── citaController.js
│   ├── clienteController.js
│   ├── distritoController.js
│   ├── empleadoController.js
│   ├── materialController.js
│   ├── paqueteController.js
│   └── paqueteVendidoController.js
├── routes/                 # Definición de rutas REST
│   ├── areaRoutes.js
│   ├── categoriaRoutes.js
│   ├── citaRoutes.js
│   ├── clienteRoutes.js
│   ├── distritoRoutes.js
│   ├── empleadoRoutes.js
│   ├── materialRoutes.js
│   ├── paqueteRoutes.js
│   └── paqueteVendidoRoutes.js
└── public/                 # Frontend SPA
    ├── index.html
    ├── css/style.css
    └── js/
        ├── api.js          # Helpers fetch
        └── app.js          # Hash router + ENT config
```

Capa por capa:
```
BD (PostgreSQL) → repositories (SQL) → services (lógica) → controllers (HTTP) → routes (Express) → frontend (SPA)
```

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/areas` | Listar áreas |
| GET | `/api/areas/:id` | Obtener área |
| POST | `/api/areas` | Crear área |
| PUT | `/api/areas/:id` | Actualizar área |
| DELETE | `/api/areas/:id` | Eliminar área |

El mismo patrón aplica para: `categorias`, `tratamientos`, `clientes`, `distritos`, `empleados`, `materiales`, `paquetes`, `paquetes-vendidos`, `citas`.

Rutas adicionales de citas:
- `GET /api/citas/cliente/:idCliente`
- `GET /api/citas/empleado/:idEmpleado`
- `GET /api/citas/fecha?fecha=YYYY-MM-DD`

## Frontend

SPA con vanilla JS. Navegación por hash (`#/areas`, `#/clientes`, etc.). Sin frameworks.

### Estructura de ENT

Cada entidad se configura en `app.js` dentro del objeto `ENT`:

```js
areas: {
  label: 'Área',
  labelP: 'Áreas',
  icon: '🏢',
  id: 'idarea',
  cols: [ ... ],    // columnas de la tabla
  form: (d) => `...`,  // HTML del formulario
  btn: 'Área',
  api: 'areas'
}
```

Agregar una nueva entidad requiere:
1. Crear archivos en los 4 layers (backend)
2. Registrar la ruta en `app.js`
3. Agregar entrada en `ENT` (frontend)
4. Agregar enlace en el sidebar (`index.html`)
5. Agregar stat al dashboard (`loadDashboard`)

## Esquema BD

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
 │                                  ├──< materialesporcita
 │                                  │
 │                                  └──< paquetevendido
```

## Scripts útiles

```bash
scripts/
├── SPA.sql                      # Esquema completo
├── insert_datos_adaptado.sql    # Datos de prueba
└── ediciones 1.sql              # Migraciones/parches
```
