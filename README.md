# SSMPP

Sistema web para gestionar actividades de evaluacion relacionadas con programas de posgrado. El proyecto esta construido con Next.js, NextAuth, Prisma y PostgreSQL.

> Estado actual: prototipo funcional incompleto. Ya existen piezas para autenticacion, listado de actividades y visualizacion de rubricas, pero el guardado/envio de respuestas todavia no esta terminado.

## Mapa del proyecto

```txt
app/
  api/              Endpoints del backend dentro de Next.js.
  app/              Pantallas internas del sistema despues de iniciar sesion.
  landing/          Pantalla publica y acceso al login.

components/
  app/              Componentes de la aplicacion interna.
  landing/          Componentes de la landing publica.

providers/          Estado global de frontend.
domain/             Logica de dominio, actualmente enfocada en autenticacion.
lib/                Clientes y configuracion compartida.
prisma/             Modelo de base de datos y migraciones.
constants/          Constantes compartidas.
docs/               Documentacion general del sistema.
```

## Documentacion recomendada

- [Vision general](./docs/README.md)
- [Arquitectura](./docs/arquitectura.md)
- [Flujos del sistema](./docs/flujos.md)
- [Modelo de datos](./docs/modelo-datos.md)
- [Mejoras pendientes](./docs/mejoras-pendientes.md)
- [API routes](./app/api/README.md)
- [Componentes](./components/README.md)
- [Providers](./providers/README.md)
- [Prisma](./prisma/README.md)
- [Despliegue a produccion](./docs/despliegue-produccion.md)

## Stack tecnico

- Next.js 16
- React 19
- NextAuth 4
- Prisma 6
- PostgreSQL
- Tailwind CSS 4

## Scripts principales

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm check
```

## Lectura rapida

La aplicacion tiene dos superficies principales:

1. `landing`: pagina publica y acceso a Google Sign-In.
2. `app`: area privada donde un usuario ve y responde actividades asignadas.

## Control de acceso

- Cualquier cuenta de Google puede iniciar sesion; al hacerlo por primera vez queda registrada con `accessStatus: PENDIENTE`.
- Solo las cuentas con `accessStatus: APROBADO` pueden entrar a `/app` y consumir la API. Las cuentas pendientes o rechazadas son redirigidas a `/landing/accounts/status`.
- Un `ADMINISTRADOR` aprueba/rechaza cuentas y asigna roles desde `/app/admin/users`.
- El primer administrador se habilita con `pnpm db:admin correo@dominio --confirm` después de que esa cuenta inicie sesión una vez.

La base de datos esta organizada alrededor de:

- Usuarios y roles.
- Posgrados.
- Dimensiones, componentes, criterios, indicadores y descriptores.
- Asignaciones de actividades a usuarios.
- Respuestas o evaluaciones por descriptor.

## Advertencias actuales

- El seed reemplaza el catálogo y elimina asignaciones; exige confirmación explícita.
- Las evidencias se guardan en PostgreSQL y deben considerarse en respaldos y capacidad.
- No hay una suite automatizada de pruebas funcionales.
