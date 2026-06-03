# Mejoras pendientes

Esta lista resume puntos detectados al leer el proyecto. No todos son bugs criticos, pero si ayudan a ordenar el trabajo.

## Prioridad alta

### Completar persistencia de respuestas

Actualmente el frontend actualiza estado local y hace `console.log`, pero no guarda respuestas.

Pendiente:

- enviar descriptor seleccionado al endpoint correcto,
- enviar comentario,
- guardar evidencia o definir como se almacenara,
- actualizar status de actividad,
- manejar errores y confirmacion visual.

### Corregir contrato entre frontend y backend

El frontend usa `indicatorId` como `assignmentIndicatorId`. Para guardar correctamente, se necesita distinguir:

- `Indicator.id`: indicador base de la rubrica.
- `AssignmentIndicator.id`: indicador dentro de una asignacion concreta.

### Corregir endpoint `POST /api/assigment/[id]`

El endpoint no llama la funcion de guardado para estudiantes. Ademas, la funcion de guardado usa una llave compuesta que no existe actualmente en Prisma.

### Normalizar nombres

Hay typos que conviene corregir antes de crecer el sistema:

- `assigment` -> `assignment`
- `prima` -> `prisma`
- `hiddeNav` -> `hideNav`
- `PreActiviities` -> `PreActivities`
- `commment` -> `comment`
- `GOOGLE_CLIENT_SECRECT` -> `GOOGLE_CLIENT_SECRET`

## Prioridad media

### Revisar autenticacion y autorizacion

Pendiente:

- usar `await getServerSession` en todas las rutas,
- decidir si `active` bloquea acceso,
- definir permisos por rol,
- evitar que usuarios no activos accedan a informacion sensible.

### Mejorar manejo de errores

Actualmente algunos errores solo se imprimen en consola o se silencian.

Pendiente:

- respuestas HTTP consistentes,
- mensajes controlados,
- validacion de body en endpoints,
- estados de carga y error en UI.

### Documentar variables de entorno

Hace falta una guia para:

- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Prioridad baja-media

### Migracion gradual a TypeScript

Conviene hacerla despues de estabilizar el contrato de datos.

Orden sugerido:

1. constantes,
2. `lib`,
3. `domain`,
4. API routes,
5. providers,
6. componentes.

### Reorganizar carpetas por feature

La arquitectura actual sirve para prototipo. Si el proyecto crece, convendria agrupar asignaciones y rubricas por feature.

Ejemplo:

```txt
features/
  assignments/
    components/
    services/
    types/
    validators/
```

### Agregar pruebas basicas

Minimo recomendado:

- tests de transformacion de datos de asignaciones,
- tests de autorizacion de endpoints,
- tests del guardado de respuestas,
- validacion de Prisma schema.
