# Mejoras pendientes

Lista alineada con el SRS (Especificacion de Requerimientos v1.0).

**Completado**: todos los Must del SRS — control de acceso y usuarios, flujo del evaluado (responder con autoguardado, evidencia documental y envio), creacion/edicion/eliminacion de asignaciones (por indicador o plantilla), vistas por rol (RF-ASIG-008/009/010), juicios de valor del evaluador, ciclo completo de estados (incluida la expiracion `NO_COMPLETADO`), CRUD del instrumento (RF-DIM-011 a RF-COM-017, RF-DES-015), posgrados/plantillas/vinculos usuario-posgrado y sugerencia de evaluadores por programa. De los Should: reporte imprimible por asignacion, dashboard con graficas por dimension/indicador y filtros por rol/estado/posgrado/dimension. Ademas: navegacion movil y branding SICVPP-BUAP.

## Pendiente

### Resumen ejecutivo con IA (solicitud del director)

Generar en el reporte un resumen y recomendaciones a partir de los agregados del dashboard y los comentarios/juicios capturados (requiere API key de Anthropic).

### Despliegue

Publicar en Vercel: variables de entorno, dominio autorizado en Google OAuth (`NEXTAUTH_URL`), y verificar respaldos de la BD en Neon.

### Historial de edicion del instrumento (Should)

Bitacora de cambios a dimensiones/criterios/indicadores/descriptores.

### Rol de actores externos

El SRS agrega el rol "Actores externos" (egresados, empleadores), similar a estudiante/profesor. Falta en el enum `Role`.

### Registrar el momento de envio

`submissionDate` es la fecha limite, no la fecha de envio. Agregar un campo que registre cuando el evaluado envio la actividad.

### Pruebas automatizadas

Tests de los casos de uso (autorizacion, guardado, expiracion, juicios) — la arquitectura hexagonal ya los deja aislados.

### Tipado de repositorios

`PrismaAssignmentRepository` devuelve `Promise<any>` en varios metodos; tipar al ir tocando esos archivos.

## Fuera de alcance (Won't del SRS)

- Varias respuestas a una sola asignacion.
- Multiples juicios de valor a una sola asignacion.
