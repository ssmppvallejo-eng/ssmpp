# Documentacion del sistema

Esta carpeta explica como esta armado el proyecto y que hace cada parte importante.

## Orden sugerido de lectura

1. [Arquitectura](./arquitectura.md)
2. [Flujos del sistema](./flujos.md)
3. [Modelo de datos](./modelo-datos.md)
4. [Mejoras pendientes](./mejoras-pendientes.md)

## Resumen

El sistema busca permitir que usuarios autenticados respondan actividades de evaluacion asociadas a dimensiones, componentes, criterios, indicadores y descriptores.

El proyecto ya tiene una estructura base util, pero todavia mezcla partes terminadas con partes de prototipo. La documentacion distingue entre lo que existe actualmente y lo que parece ser la intencion del sistema.

## Capas principales

- **Frontend:** pantallas y componentes dentro de `app/`, `components/` y `providers/`.
- **Backend:** rutas API dentro de `app/api/`.
- **Autenticacion:** NextAuth con Google, configurado en `lib/auth.js` y `app/api/auth/[...nextauth]/route.js`.
- **Base de datos:** Prisma schema y migraciones dentro de `prisma/`.
- **Dominio:** funciones pequenas bajo `domain/`, actualmente enfocadas en login.
