# API routes

Esta carpeta contiene los endpoints del backend usando Route Handlers de Next.js.

## Rutas actuales

### `api/auth/[...nextauth]`

Expone NextAuth.

Responsabilidades:

- manejar login con Google,
- crear sesion,
- ejecutar callbacks definidos en `lib/auth.js`.

### `api/users`

Busca usuarios en base de datos.

Estado actual:

- tiene errores de implementacion:
  - importa `prima`, pero el cliente exportado se llama `prisma`;
  - llama `getServerSession` sin `await`;
  - no valida roles de forma estricta.

### `api/assigment`

Endpoint general de asignaciones.

Estado actual:

- esta incompleto;
- usa `assigment`, pero el modelo Prisma actual es `assignment`;
- no devuelve respuesta en todos los caminos;
- el `catch` esta vacio.

### `api/assigment/my`

Devuelve las actividades asignadas al usuario autenticado.

Flujo:

1. Obtiene sesion.
2. Si no hay sesion, responde `401`.
3. Si el rol es `ESTUDIANTE`, busca registros en `UserAssignTo`.
4. Devuelve una lista simple para la pantalla `/app`.
5. Otros roles reciben `403`.

### `api/assigment/[id]`

Obtiene detalle de una asignacion especifica y contiene un `POST` todavia incompleto.

GET actual:

- valida sesion;
- revisa que la asignacion pertenezca al usuario;
- consulta `Assignment`, `Dimension`, `Indicator`, `Descriptor` y `Judgement`;
- transforma los datos para que el frontend los renderice agrupados por criterio.

POST actual:

- parsea body;
- valida sesion;
- pero no ejecuta correctamente la persistencia para estudiantes.

## Nota de nombres

La carpeta usa `assigment`, pero la palabra correcta es `assignment`. Ademas, Prisma ya usa el modelo `Assignment`, por lo que conviene normalizar esta ruta antes de crecer el API.
