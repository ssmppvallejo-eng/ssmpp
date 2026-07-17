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

`GET` (solo `ADMINISTRADOR`): lista todas las asignaciones con dimension, creador, usuarios asignados y conteo de indicadores.

`POST` (solo `ADMINISTRADOR`): crea una asignacion. Body validado con Zod (`CreateAssignmentSchema`):

- `dimensionId`: dimension a evaluar;
- `dueDate`: fecha de vencimiento (`submissionDate`);
- `userIds`: usuarios responsables (deben existir y estar aprobados);
- `indicatorIds` **o** `templateId` (exclusivos entre si): indicadores elegidos manualmente o tomados de una plantilla.

`CreateAssignmentUseCase` valida que la dimension exista, que los indicadores existan y pertenezcan a la dimension, y crea `Assignment`, `AssignmentIndicator` y `UserAssignTo` en una sola transaccion.

### `api/dimensions`

`GET` (solo `ADMINISTRADOR`): catalogo jerarquico dimension -> componentes -> criterios -> indicadores, usado por el formulario de creacion de asignaciones.

### `api/templates`

`GET` (solo `ADMINISTRADOR`): lista plantillas con su posgrado y conteo de indicadores.

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

### `api/assignment/[id]/review`

`GET` (solo `ADMINISTRADOR` y `COORDINADOR`): vista de supervision (RF-ASIG-010). Devuelve la jerarquia completa de la asignacion con, por indicador: justificacion normativa, los 3 descriptores, la respuesta capturada (descriptor, comentario, evidencia) y el juicio de valor del evaluador cuando exista, ademas de progreso, responsables y fechas. No exige pertenencia.

### `api/assignment/[id]/submit`

`POST`: envia la actividad (cualquier usuario asignado via `UserAssignTo`).

- valida ownership (`403`);
- valida que todos los indicadores tengan respuesta (`409` si estan incompletos);
- marca la asignacion como `ENVIADO`.

### `api/assignment/[id]/evaluators`

`POST` (solo `ADMINISTRADOR`): asigna un evaluador a una evaluacion `ENVIADO` o `EN_REVISION`. El usuario debe estar aprobado y tener rol `EVALUADOR`. Al asignar el primero, el estado pasa a `EN_REVISION`.

### `api/assignment/[id]/judgement`

`POST` (`EVALUADOR` y `COORDINADOR`, siendo miembros de la asignacion): guarda el juicio de valor de un indicador (`evaluationValue` 1-3 y `note` textual). Requiere que la asignacion este `EN_REVISION` y que el indicador tenga respuesta del evaluado.

### `api/assignment/[id]/complete`

`POST` (`EVALUADOR` y `COORDINADOR`, siendo miembros): completa la revision. Si algun indicador no tiene juicio de valor responde `409`; si todos lo tienen, el estado pasa a `COMPLETADO`.
