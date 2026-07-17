# API routes

Esta carpeta contiene los endpoints del backend usando Route Handlers de Next.js.

Todos los endpoints (excepto `api/auth`) validan la sesion con `requireApprovedSession()` de `lib/apiAuth.ts`:

- sin sesion responde `401`;
- cuenta con `accessStatus` distinto de `APROBADO` responde `403`;
- si el endpoint restringe roles y el usuario no tiene uno permitido, responde `403`.

## Rutas actuales

### `api/auth/[...nextauth]`

Expone NextAuth.

Responsabilidades:

- manejar login con Google,
- crear sesion,
- ejecutar callbacks definidos en `lib/auth.ts`.

### `api/users`

`GET` (solo `ADMINISTRADOR`): lista todos los usuarios con id, email, nombre, imagen, rol y estado de acceso. Usa `ListUsersUseCase`.

### `api/users/[id]`

`PATCH` (solo `ADMINISTRADOR`): actualiza `accessStatus` y/o `role` de un usuario. Body validado con Zod. Usa `UpdateUserAccessUseCase`, que rechaza con `403` si el administrador intenta modificar su propia cuenta y `404` si el usuario no existe.

### `api/assignment`

`GET` (solo `ADMINISTRADOR`): lista todas las asignaciones.

### `api/assignment/my`

`GET`: devuelve las actividades asignadas al usuario autenticado.

Flujo:

1. Valida sesion y cuenta aprobada.
2. Si el rol es `ESTUDIANTE`, busca registros en `UserAssignTo`.
3. Devuelve una lista simple para la pantalla `/app`.
4. Otros roles reciben `403`.

### `api/assignment/[id]`

`GET`: detalle de una asignacion.

- valida sesion y cuenta aprobada;
- revisa que la asignacion pertenezca al usuario (`403` si no);
- consulta `Assignment`, `Dimension`, `Indicator`, `Descriptor` y `Judgement`;
- transforma los datos para que el frontend los renderice agrupados por criterio.

`POST` (solo `ESTUDIANTE`): guarda la respuesta de un indicador (descriptor seleccionado y comentario). Body validado con Zod (`SaveAssignmentResponseSchema`). Hace upsert en `AssignmentIndicatorDescriptor` mediante `SaveStudentResponseUseCase`.

### `api/assignment/[id]/submit`

`POST` (solo `ESTUDIANTE`): envia la actividad.

- valida ownership (`403`);
- valida que todos los indicadores tengan respuesta (`409` si estan incompletos);
- marca la asignacion como `ENVIADO`.
