# Flujos del sistema

## 1. Entrada a la aplicacion

Cuando el usuario entra a `/`, `proxy.js` revisa si existe un token de NextAuth.

- Si hay token, redirige a `/app`.
- Si no hay token, redirige a `/landing`.

## 2. Login

El login vive en `app/landing/accounts/page.jsx`.

Flujo esperado:

1. Usuario presiona `Sign In`.
2. NextAuth inicia login con Google.
3. `signIn` callback revisa el perfil.
4. Si el usuario no existe, `login_with_google` lo crea en base de datos.
5. `jwt` callback carga datos del usuario desde la base.
6. `session` callback expone esos datos en `session.user`.

## 3. Listado de actividades

La pantalla `/app` usa `ActivitiesProvider`.

Flujo actual:

1. `app/app/page.jsx` llama `fetchPreActivities`.
2. `fetchPreActivities` consulta `/api/assigment/my`.
3. El endpoint busca asignaciones relacionadas con `session.user.id`.
4. Si el usuario tiene rol `ESTUDIANTE`, devuelve actividades asignadas.
5. `PreActivities` renderiza la lista.
6. Cada item navega hacia `app/assignment/:id`.

## 4. Detalle de actividad

La pantalla `/app/assignment/[id]` carga una actividad especifica.

Flujo actual:

1. La pantalla obtiene el `id` desde la URL.
2. Llama `fetchActivity(id)`.
3. El provider consulta `/api/assigment/:id`.
4. El endpoint valida sesion.
5. Revisa si la actividad pertenece al usuario mediante `UserAssignTo`.
6. Consulta `Assignment` con su dimension e indicadores.
7. Reorganiza indicadores por criterio (`Judgement`).
8. Devuelve una estructura preparada para el frontend.

## 5. Responder rubrica

Flujo parcialmente implementado:

1. El usuario selecciona un descriptor.
2. `Descriptor.jsx` actualiza estado local mediante el reducer.
3. El usuario escribe comentario.
4. `Indicator.jsx` actualiza estado local despues de un debounce.
5. Actualmente los datos se imprimen en consola.

Pendiente:

- enviar los datos al backend,
- validar permisos,
- guardar en `AssignmentIndicatorDescriptor`,
- manejar evidencia,
- marcar indicadores o asignaciones como completas,
- permitir envio formal de la actividad.

## 6. Revision

El modelo tiene roles como `COORDINADOR`, `PROFESOR` y `EVALUADOR`, ademas de estados como `EN_REVISION` y `COMPLETADO`.

El flujo de revision todavia no esta implementado en pantallas ni endpoints.
