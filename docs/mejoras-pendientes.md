# Mejoras pendientes

Lista alineada con el SRS (Especificacion de Requerimientos v1.0). Lo ya completado: migracion a TypeScript, flujo completo del evaluado (responder/enviar), login y control de acceso, creacion de asignaciones (por indicador o plantilla), vista de supervision admin/coordinador (RF-ASIG-010), flujo del evaluador con juicios de valor (RF-ASIG-009, estados hasta COMPLETADO), CRUD del instrumento (RF-DIM-011 a RF-COM-017 y RF-DES-015), y gestion de posgrados, plantillas y vinculacion usuario-posgrado.

## Prioridad alta (Must del SRS)

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

- Dashboard con grafica por indicadores.
- Resumen ejecutivo generado con IA en el reporte de evaluacion.
- Historial de edicion del instrumento.
- Filtrar por posgrado y por rol.
- Pruebas automatizadas (autorizacion de endpoints, guardado de respuestas, transformaciones de datos).

## Fuera de alcance (Won't del SRS)

- Varias respuestas a una sola asignacion.
- Multiples juicios de valor a una sola asignacion.
