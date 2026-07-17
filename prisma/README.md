# Prisma

Esta carpeta contiene el modelo de base de datos y migraciones.

## Archivos importantes

### `schema.prisma`

Define:

- modelos,
- relaciones,
- enums,
- datasource PostgreSQL,
- generador de Prisma Client.

### `seed.mjs`

Siembra el catalogo con el instrumento **SICVPP-BUAP v1** (5 dimensiones, 10 componentes, 16 criterios, 41 indicadores, 123 descriptores):

```bash
npm run db:seed
```

ADVERTENCIA: el seed reemplaza todo el catalogo y elimina las asignaciones existentes, porque dependen del catalogo anterior.

### `migrations/`

Contiene la historia de cambios de base de datos.

Las migraciones muestran que el proyecto cambio de nombres antiguos a nombres nuevos. Por ejemplo:

- `Assigment` paso a `Assignment`.
- `Subsystem` paso a `Dimension`.
- `Answer` paso a `Descriptor`.

Esto explica por que algunas partes del codigo todavia tienen nombres viejos.

## Modelos principales

- `User`
- `Postgraduate`
- `Dimension`
- `Component`
- `Judgement`
- `Indicator`
- `Descriptor`
- `Assignment`
- `AssignmentIndicator`
- `AssignmentIndicatorDescriptor`

## Relacion clave para respuestas

La respuesta de un usuario deberia guardarse alrededor de:

```txt
Assignment
  -> AssignmentIndicator
    -> AssignmentIndicatorDescriptor
```

Esto importa porque un `Indicator` es parte de la rubrica general, pero `AssignmentIndicator` representa ese indicador dentro de una actividad asignada.

## Pendientes del schema

- Agregar el estado `NO_COMPLETADO` al enum `IndicatorStatus` (expiracion por fecha limite).
- Agregar el rol `ACTORES_EXTERNOS` al enum `Role`.
- Definir como se manejaran evidencias: almacenamiento de archivos y permisos.
- Agregar un campo que registre el momento del envio (hoy `submissionDate` es la fecha limite).
