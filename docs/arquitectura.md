# Arquitectura

## Vista general

El proyecto usa el App Router de Next.js. Eso significa que las pantallas, layouts y API routes viven dentro de `app/`.

```txt
Usuario
  -> Landing publica
  -> Login con Google
  -> Area privada /app
  -> Listado de actividades
  -> Detalle de actividad
  -> Respuesta de rubrica
  -> Persistencia en PostgreSQL mediante Prisma
```

## Capas

### `app/`

Contiene rutas visuales y rutas API.

- `app/layout.tsx`: layout raiz, carga fuentes globales y `AuthProvider`.
- `app/landing/page.tsx`: landing publica.
- `app/landing/accounts/page.tsx`: boton de inicio de sesion con Google.
- `app/landing/accounts/status/page.tsx`: estado de cuenta para usuarios pendientes o rechazados.
- `app/app/layout.tsx`: layout del area privada; valida server-side que exista sesion y que la cuenta este aprobada.
- `app/app/page.tsx`: listado de actividades asignadas.
- `app/app/assignment/[id]/page.tsx`: detalle de una actividad.
- `app/app/admin/users/page.tsx`: panel de gestion de usuarios, solo para `ADMINISTRADOR`.
- `app/api/`: backend de Next.js.

### `components/`

Componentes reutilizables de interfaz.

- `components/landing`: navbar de la landing.
- `components/app`: navbar y layout de la zona privada.
- `components/app/activities`: componentes para mostrar actividades, criterios, indicadores y descriptores.

### `providers/`

Estado compartido del frontend.

- `AuthProvider`: envuelve la app con `SessionProvider` de NextAuth.
- `StyleProvider`: controla visibilidad del navbar.
- `ActivitiesProvider`: obtiene actividades, guarda actividad actual y maneja estado local de respuestas.

### `lib/`

Configuracion compartida.

- `lib/prisma.ts`: instancia global de Prisma Client.
- `lib/auth.ts`: configuracion de NextAuth y callbacks. El callback `jwt` consulta la base en cada refresco del token, por lo que cambios de rol o de estado de acceso aplican sin re-login.
- `lib/apiAuth.ts`: helper `requireApprovedSession()` usado por todos los endpoints para validar sesion, cuenta aprobada y roles permitidos.

### `domain/`

Funciones de dominio. Actualmente solo contiene logica de autenticacion:

- crear usuario si entra con Google por primera vez (queda como `PENDIENTE`).
- obtener informacion del usuario para el JWT (id, rol y estado de acceso).

### `src/`

Arquitectura hexagonal para los dominios de asignaciones y usuarios.

- `src/core/domain`: entidades (`User`, con enums `Role` y `AccessStatus`) y contratos de repositorio.
- `src/core/application`: casos de uso (`GetAssignmentById`, `SaveStudentResponse`, `SubmitStudentAssignment`, `ListUsers`, `UpdateUserAccess`) y DTOs con validacion Zod.
- `src/infrastructure/persistence`: implementaciones Prisma de los repositorios.

### `prisma/`

Define el modelo de base de datos y migraciones.

## Observaciones de arquitectura

La separacion general es razonable para un prototipo, pero la logica de asignaciones esta repartida entre:

- provider de frontend,
- componentes de rubrica,
- endpoints API,
- modelo Prisma.

Para terminar el proyecto convendria agrupar mejor todo lo relacionado con asignaciones, por ejemplo en una carpeta `features/assignments` o manteniendo una convencion clara entre API, componentes y tipos.
