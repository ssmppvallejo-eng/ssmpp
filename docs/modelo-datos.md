# Modelo de datos

El modelo Prisma describe una rubrica de evaluacion y su asignacion a usuarios.

## Estructura academica

### `Dimension`

Representa una dimension de evaluacion.

Relaciones:

- tiene muchos `Component`.
- tiene muchas `Assignment`.

### `Component`

Representa un componente dentro de una dimension.

Relaciones:

- pertenece a una `Dimension`.
- tiene muchos `Judgement`.

### `Judgement`

Representa un criterio de evaluacion.

Relaciones:

- pertenece a un `Component`.
- tiene muchos `Indicator`.

### `Indicator`

Representa un indicador evaluable.

Relaciones:

- pertenece a un `Judgement`.
- tiene muchos `Descriptor`.
- puede formar parte de templates.
- puede formar parte de asignaciones mediante `AssignmentIndicator`.

### `Descriptor`

Representa una opcion o nivel de respuesta para un indicador.

Campos importantes:

- `title`
- `value`
- `description`

## Asignaciones

### `Assignment`

Representa una actividad asignada.

Campos importantes:

- `ownerId`
- `assignmentDate`
- `submissionDate`
- `status`
- `dimensionId`

Relaciones:

- pertenece a un usuario propietario (`owner`).
- pertenece a una dimension.
- tiene indicadores mediante `AssignmentIndicator`.
- tiene usuarios asignados mediante `UserAssignTo`.

### `AssignmentIndicator`

Une una asignacion con un indicador especifico.

Esta tabla es importante porque una respuesta no deberia guardarse solo contra el `Indicator`, sino contra el indicador dentro de una asignacion concreta.

### `AssignmentIndicatorDescriptor`

Representa la respuesta/evaluacion de un descriptor dentro de un indicador asignado.

Campos importantes:

- `assignmentIndicatorId`
- `descriptorId`
- `valueAssigned`
- `evaluationValue`
- `note`
- `evidenceName`
- `evidenceUrl`
- `addComment`
- `addEvidence`
- `complete`
- `commment`

Observacion: el campo `commment` parece tener un typo. Probablemente deberia llamarse `comment`.

## Usuarios

### `User`

Representa una cuenta autenticada.

Campos importantes:

- `email`
- `role`
- `active`
- `image`
- `name`

### `UserAssignTo`

Une usuarios con asignaciones.

### `UserPostgraduate`

Une usuarios con posgrados.

## Templates y posgrados

### `Postgraduate`

Representa un programa de posgrado.

### `Template`

Plantilla de indicadores asociada a un posgrado.

### `TemplateIndicator`

Une templates con indicadores.

## Estados y roles

### Estados de asignacion

- `PENDIENTE`
- `EN_PROCESO`
- `ENVIADO`
- `EN_REVISION`
- `COMPLETADO`

### Roles

- `ADMINISTRADOR`
- `ESTUDIANTE`
- `COORDINADOR`
- `PROFESOR`
- `EVALUADOR`

## Riesgos del modelo actual

- Falta una restriccion unica clara para evitar respuestas duplicadas por `assignmentIndicatorId` y `descriptorId`, si esa es la regla de negocio.
- El frontend actualmente usa el id de `Indicator` donde parece necesitarse el id de `AssignmentIndicator`.
- El typo `commment` puede causar errores y confusion.
- Hay migraciones antiguas con nombres previos como `Assigment`, `Subsystem` y `Answer`, lo que explica parte de la mezcla de nombres en el codigo.
