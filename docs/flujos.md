# Flujos del sistema

## 1. Entrada a la aplicacion

Cuando el usuario entra a `/`, `proxy.js` revisa si existe un token de NextAuth.

- Si hay token, redirige a `/app`.
- Si no hay token, redirige a `/landing`.

## 2. Login y control de acceso

El login vive en `app/landing/accounts/page.tsx`. Cualquier cuenta de Google puede iniciar sesion, pero solo las cuentas aprobadas pueden usar el sistema (RF-SIS-001).

Flujo:

1. Usuario presiona `Continuar con Google`.
2. NextAuth inicia login con Google.
3. `signIn` callback revisa el perfil.
4. Si el usuario no existe, `login_with_google` lo crea en base de datos con `accessStatus: PENDIENTE`.
5. `jwt` callback carga `userId`, `role` y `accessStatus` desde la base. Esta consulta se repite en cada refresco del token, por lo que una aprobacion o cambio de rol surte efecto sin necesidad de re-login.
6. `session` callback expone esos datos en `session.user`.

Despues del login, el acceso se decide por `accessStatus`:

- `APROBADO`: entra al area privada `/app`.
- `PENDIENTE` o `RECHAZADO`: el layout de `/app` (server-side) lo redirige a `/landing/accounts/status`, que muestra el estado de su cuenta y un boton de cerrar sesion.

En el backend, todos los endpoints usan `requireApprovedSession()` (`lib/apiAuth.ts`), que responde `401` sin sesion y `403` si la cuenta no esta aprobada o el rol no esta permitido.

## 3. Aprobacion de cuentas (administrador)

La pantalla `/app/admin/users` es visible solo para el rol `ADMINISTRADOR` (RF-USR-002/003/004).

Flujo:

1. `UsersManager` consulta `GET /api/users` (solo administradores).
2. Se listan todos los usuarios con foto, nombre, email, estado de acceso y rol.
3. El administrador puede aprobar o rechazar cuentas y, para cuentas aprobadas, asignar rol.
4. Cada accion llama `PATCH /api/users/:id`, validado con Zod y ejecutado por `UpdateUserAccessUseCase`.
5. Un administrador no puede modificar su propia cuenta; esto evita que el sistema quede sin administradores.

El primer administrador se siembra manualmente en la base de datos (columna `role` de la tabla `User`).

## 4. Creacion de asignaciones (administrador)

La pantalla `/app/admin/assignments` lista las asignaciones existentes y `/app/admin/assignments/new` permite crear nuevas (RF "Asignacion de una asignacion").

Flujo:

1. `AssignmentCreator` carga el catalogo (`/api/dimensions`), las plantillas (`/api/templates`) y los usuarios aprobados (`/api/users`).
2. El administrador elige una dimension.
3. Define los indicadores en uno de dos modos: **por indicador** (checkboxes agrupados por componente y criterio) o **por plantilla**.
4. Define la fecha de vencimiento (`submissionDate`) y selecciona uno o mas usuarios aprobados.
5. `POST /api/assignment` valida con Zod y ejecuta `CreateAssignmentUseCase`, que verifica dimension, pertenencia de los indicadores a la dimension y aprobacion de los usuarios.
6. Se crean `Assignment` (status `PENDIENTE`, `assignmentDate` = hoy), sus `AssignmentIndicator` y los `UserAssignTo` en una transaccion.

## 5. Supervision de asignaciones (administrador/coordinador)

Desde `/app/admin/assignments` cada fila enlaza a `/app/admin/assignments/:id`, la vista de revision (RF-ASIG-010):

1. `AssignmentReview` consulta `GET /api/assignment/:id/review` (roles `ADMINISTRADOR` y `COORDINADOR`).
2. Se muestra el resumen (estado, avance de indicadores respondidos, fechas, responsables) y la jerarquia completa por criterio.
3. Por indicador se ve la justificacion normativa, los 3 descriptores con el seleccionado resaltado, el comentario y la evidencia del evaluado, y el juicio de valor del evaluador cuando exista.
4. El boton "Reporte" abre `/app/admin/assignments/:id/report`: un reporte imprimible (boton "Imprimir / Guardar como PDF") con resumen de resultados (puntaje de logro por criterio y global, promedio de juicios del evaluador, nivel de logro segun la escala 1-3) y el detalle de cada indicador con autoevaluacion, juicio, comentarios y observaciones. Tambien accesible para el evaluador desde su panel cuando la evaluacion esta completada.

## 6. Listado de actividades

La pantalla `/app` usa `ActivitiesProvider`.

Flujo actual:

1. `app/app/page.tsx` llama `fetchPreActivities`.
2. `fetchPreActivities` consulta `/api/assignment/my`.
3. El endpoint busca asignaciones relacionadas con `session.user.id`.
4. Si el usuario tiene rol `ESTUDIANTE`, devuelve actividades asignadas.
5. `PreActivities` renderiza la lista.
6. Cada item navega hacia `app/assignment/:id`.

## 7. Detalle de actividad

La pantalla `/app/assignment/[id]` carga una actividad especifica.

Flujo actual:

1. La pantalla obtiene el `id` desde la URL.
2. Llama `fetchActivity(id)`.
3. El provider consulta `/api/assignment/:id`.
4. El endpoint valida sesion y cuenta aprobada.
5. Revisa si la actividad pertenece al usuario mediante `UserAssignTo`.
6. Consulta `Assignment` con su dimension e indicadores.
7. Reorganiza indicadores por criterio (`Judgement`).
8. Devuelve una estructura preparada para el frontend.

## 8. Responder y enviar la rubrica

Flujo actual:

1. El usuario selecciona un descriptor y, si aplica, escribe un comentario.
2. Los cambios se guardan con autoguardado mediante `POST /api/assignment/:id`, que ejecuta `SaveStudentResponseUseCase` y hace upsert en `AssignmentIndicatorDescriptor`.
3. Al terminar, el usuario envia la actividad con `POST /api/assignment/:id/submit`.
4. `SubmitStudentAssignmentUseCase` valida ownership y completitud: si hay indicadores sin responder, responde `409`.
5. Si todo esta completo, la asignacion pasa a estado `ENVIADO`.

6. Con un descriptor seleccionado, el evaluado puede adjuntar evidencia documental (`POST /api/assignment/:id/evidence`, PDF/imagen/ofimatica, max. 5 MB); el archivo se guarda en la BD y se descarga via `/api/evidence/:id`.

## 9. Revision (evaluador)

Cierra el ciclo de vida de la evaluacion: `ENVIADO -> EN_REVISION -> COMPLETADO`.

1. Con la evaluacion en `ENVIADO`, el administrador asigna un evaluador desde la vista de revision (`POST /api/assignment/:id/evaluators`; requiere usuario aprobado con rol `EVALUADOR`). Al asignar el primero, el estado pasa a `EN_REVISION`.
2. El evaluador ve la evaluacion en su lista de actividades; al abrirla se muestra el panel de evaluacion (`EvaluatorPanel`) en lugar de la rubrica de respuesta.
3. Por indicador, el evaluador ve la respuesta del evaluado (descriptor, comentario, evidencia) y la justificacion normativa, y emite su juicio de valor numerico (escala 1-3) y textual (`POST /api/assignment/:id/judgement`).
4. Cuando todos los indicadores tienen juicio, el evaluador completa la revision (`POST /api/assignment/:id/complete`) y el estado pasa a `COMPLETADO`; si falta alguno responde `409`.

Reglas relacionadas del ciclo de estados (RF-SIS-007):

- La primera respuesta guardada mueve la asignacion de `PENDIENTE` a `EN_PROCESO`.
- Despues del envio, el evaluado ya no puede modificar respuestas (`409`).

Expiracion: al consultar listados o detalles, las asignaciones `PENDIENTE`/`EN_PROCESO`/`EN_REVISION` cuya fecha limite ya vencio pasan automaticamente a `NO_COMPLETADO` y dejan de aceptar respuestas.
