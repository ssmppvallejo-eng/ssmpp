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

- Revisar si `AssignmentIndicatorDescriptor` necesita una llave unica compuesta por `assignmentIndicatorId` y `descriptorId`.
- Corregir typo `comment`.
- Confirmar si `valueAssigned` representa la respuesta del usuario o un valor copiado del descriptor.
- Definir como se manejaran evidencias: nombre, URL, almacenamiento y permisos.
