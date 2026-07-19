# Modelo de datos

El modelo Prisma describe una rubrica de evaluacion y su asignacion a usuarios.

El catalogo (dimensiones a descriptores) corresponde al instrumento **SICVPP-BUAP v1** ("Sistema de Indicadores Contextualizados para Valorar la Pertinencia de los Programas de Posgrado de la BUAP", 16-05-2026): 5 dimensiones, 10 componentes, 16 criterios, 41 indicadores y 123 descriptores. Se siembra con `npm run db:seed` (ver `prisma/seed.mjs`).

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

Representa un indicador evaluable (evidencia empirico-observable).

Campos importantes:

- `code`
- `description`
- `justification`: justificacion normativa del indicador (leyes y lineamientos que lo sustentan).

Relaciones:

- pertenece a un `Judgement`.
- tiene muchos `Descriptor`.
- puede formar parte de templates.
- puede formar parte de asignaciones mediante `AssignmentIndicator`.

### `Descriptor`

Representa un nivel de logro para un indicador. Cada indicador tiene exactamente 3 descriptores con ponderaciones unicas (RF-DES-015):

- `value: 1` — No logrado
- `value: 2` — En proceso
- `value: 3` — Plenamente logrado

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
- `submissionDate`: fecha limite/cierre (se fija al crear la asignacion).
- `submittedAt`: momento real en que el evaluado envio la actividad (`null` mientras no se envie).
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
- `comment`

Existe una restriccion unica sobre `(assignmentIndicatorId, descriptorId)` que evita respuestas duplicadas por descriptor dentro de un indicador asignado.

## Usuarios

### `User`

Representa una cuenta autenticada.

Campos importantes:

- `email`
- `role`
- `accessStatus` (control de acceso: `PENDIENTE`, `APROBADO`, `RECHAZADO`)
- `image`
- `name`

Toda cuenta nueva entra como `PENDIENTE` y solo puede usar el sistema cuando un administrador la aprueba.

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

### `EvidenceFile`

Almacena el archivo binario de una evidencia documental subida por un evaluado (RF-IND-005). `AssignmentIndicatorDescriptor.evidenceUrl` apunta a `/api/evidence/:id`.

### `InstrumentEditLog`

Bitacora de cambios al instrumento (dimensiones, componentes, criterios, indicadores, descriptores). No usa llaves foraneas hacia las entidades del catalogo porque estas pueden eliminarse; el registro queda como evidencia historica con `entityType`, `entityId`, `entityCode`, `action` (`CREATE`/`UPDATE`/`DELETE`), `changes` (JSON) y quien hizo el cambio.

## Estados y roles

### Estados de asignacion

- `PENDIENTE`
- `EN_PROCESO`
- `ENVIADO`
- `EN_REVISION`
- `COMPLETADO`

### Estados de acceso (`AccessStatus`)

- `PENDIENTE`: cuenta registrada, en espera de aprobacion.
- `APROBADO`: cuenta con acceso al sistema.
- `RECHAZADO`: cuenta denegada.

### Roles

- `ADMINISTRADOR`
- `ESTUDIANTE`
- `COORDINADOR`
- `PROFESOR`
- `EVALUADOR`
- `ACTORES_EXTERNOS`: egresados, empleadores y sector productivo regional. Se comporta como `ESTUDIANTE`/`PROFESOR` para responder actividades (la pertenencia se define por `UserAssignTo`, no por rol).

## Riesgos del modelo actual

- `submissionDate` es la fecha limite/cierre de la asignacion (se fija al crearla); `submittedAt` registra el momento real del envio.
- El enum de estados aun no incluye `NO_COMPLETADO` (expiracion por fecha limite), previsto en el SRS.
- La tabla `Judgement` almacena criterios de la rubrica; no confundir con el "juicio de valor" del evaluador, que vive en `evaluationValue` y `note` de `AssignmentIndicatorDescriptor`.
- Hay migraciones antiguas con nombres previos como `Assigment`, `Subsystem` y `Answer`, lo que explica parte de la mezcla de nombres en el codigo.
