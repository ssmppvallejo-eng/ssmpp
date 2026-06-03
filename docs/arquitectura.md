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

- `app/layout.jsx`: layout raiz, carga fuentes globales y `AuthProvider`.
- `app/landing/page.jsx`: landing publica.
- `app/landing/accounts/page.jsx`: boton de inicio de sesion con Google.
- `app/app/layout.jsx`: layout del area privada.
- `app/app/page.jsx`: listado de actividades asignadas.
- `app/app/assignment/[id]/page.jsx`: detalle de una actividad.
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

- `lib/prima.js`: instancia global de Prisma Client.
- `lib/auth.js`: configuracion de NextAuth y callbacks.

### `domain/`

Funciones de dominio. Actualmente solo contiene logica de autenticacion:

- crear usuario si entra con Google por primera vez.
- obtener informacion del usuario para el JWT.

### `prisma/`

Define el modelo de base de datos y migraciones.

## Observaciones de arquitectura

La separacion general es razonable para un prototipo, pero la logica de asignaciones esta repartida entre:

- provider de frontend,
- componentes de rubrica,
- endpoints API,
- modelo Prisma.

Para terminar el proyecto convendria agrupar mejor todo lo relacionado con asignaciones, por ejemplo en una carpeta `features/assignments` o manteniendo una convencion clara entre API, componentes y tipos.
