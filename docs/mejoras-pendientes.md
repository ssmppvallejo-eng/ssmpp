# Mejoras pendientes

Lista alineada con el SRS (Especificacion de Requerimientos v1.0).

**Completado**: todos los Must del SRS — control de acceso y usuarios (incluido el rol `ACTORES_EXTERNOS`), flujo del evaluado (responder con autoguardado, comentario/evidencia obligatorios por indicador segun RF-IND-005, y envio con fecha real de envio `submittedAt`), creacion/edicion/eliminacion de asignaciones (por indicador o plantilla), vistas por rol (RF-ASIG-008/009/010), juicios de valor del evaluador, ciclo completo de estados (incluida la expiracion `NO_COMPLETADO`), CRUD del instrumento (RF-DIM-011 a RF-COM-017, RF-DES-015), posgrados/plantillas/vinculos usuario-posgrado y sugerencia de evaluadores por programa. De los Should: reporte imprimible por asignacion, dashboard con graficas por dimension/indicador, filtros por rol/estado/posgrado/dimension, e historial de edicion del instrumento. Ademas: navegacion movil y branding SICVPP-BUAP.

## Pendiente

### Resumen ejecutivo con IA (solicitud del director)

Generar en el reporte un resumen y recomendaciones a partir de los agregados del dashboard y los comentarios/juicios capturados (requiere API key de Anthropic).

### Despliegue

Publicar en Vercel: variables de entorno, dominio autorizado en Google OAuth (`NEXTAUTH_URL`), y verificar respaldos de la BD en Neon.

### Pruebas automatizadas

Tests de los casos de uso (autorizacion, guardado, expiracion, juicios) — la arquitectura hexagonal ya los deja aislados.

### Tipado de repositorios

`PrismaAssignmentRepository` devuelve `Promise<any>` en varios metodos; tipar al ir tocando esos archivos.

## Fuera de alcance (Won't del SRS)

- Varias respuestas a una sola asignacion.
- Multiples juicios de valor a una sola asignacion.
