# Mejoras pendientes

Lista alineada con el SRS (Especificacion de Requerimientos v1.0). Lo ya completado: migracion a TypeScript, guardado/envio de respuestas del estudiante, y el flujo de login y control de acceso (aprobacion de cuentas, roles y panel de administracion de usuarios).

## Prioridad alta (Must del SRS)

### Creacion de asignaciones

Un administrador debe poder crear asignaciones "por indicador o por plantilla" y asignarlas a uno o mas usuarios. Hoy las asignaciones solo pueden crearse directamente en la base de datos.

### Flujo del evaluador

- Asignar evaluadores a evaluaciones enviadas, por programa.
- Vista del evaluador (RF-ASIG-009): respuestas del evaluado mas espacio para juicio de valor textual y numerico por indicador (campos `evaluationValue` y `note` ya existen en el schema).
- Transiciones de estado `ENVIADO -> EN_REVISION -> COMPLETADO`.

### CRUD de la taxonomia

Crear y editar dimensiones, componentes, criterios, indicadores y descriptores (RF-DIM-011 a RF-COM-017). Regla RF-DES-015: exactamente 3 descriptores por indicador, con ponderaciones 1-3 unicas.

### Ciclo de vida completo de estados

- Agregar `NO_COMPLETADO` al enum de estados.
- Logica de expiracion cuando `submissionDate` (fecha limite) se vence.

## Prioridad media

### Evidencia documental

RF-IND-005 pide adjuntar evidencia cuando el indicador lo requiera. No hay mecanismo de subida de archivos; definir almacenamiento (S3, blob de Vercel, etc.).

### Registrar el momento de envio

`submissionDate` es la fecha limite, no la fecha de envio. Agregar un campo para registrar cuando el estudiante envio la actividad.

### Rol de actores externos

El SRS agrega el rol "Actores externos" (egresados, empleadores), similar a estudiante/profesor. Falta en el enum `Role`.

### Tipado de repositorios

`PrismaAssignmentRepository` devuelve `Promise<any>` en varios metodos. Tipar los retornos con las entidades de `src/core/domain/entities/` al ir tocando esos archivos.

## Prioridad baja (Should/Could del SRS)

- Reporte PDF por asignacion.
- Dashboard con grafica por indicadores.
- Historial de edicion del instrumento.
- Filtrar por posgrado y por rol.
- Pruebas automatizadas (autorizacion de endpoints, guardado de respuestas, transformaciones de datos).

## Fuera de alcance (Won't del SRS)

- Varias respuestas a una sola asignacion.
- Multiples juicios de valor a una sola asignacion.
