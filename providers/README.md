# Providers

Los providers manejan estado compartido del frontend.

## `AuthProvider.jsx`

Envuelve la aplicacion con `SessionProvider` de NextAuth.

Esto permite usar sesion del usuario desde componentes cliente.

## `StyleProvider.jsx`

Controla visibilidad del navbar interno.

Estado:

- `visibleNav`

Funciones:

- `hiddeNav`: oculta el navbar.
- `showNav`: muestra el navbar.

Nota: `hiddeNav` tiene typo. Deberia ser `hideNav`.

## `ActivitiesProvider.jsx`

Es el provider mas importante de la app actual.

Responsabilidades:

- cargar actividades asignadas con `fetchPreActivities`;
- cargar detalle de actividad con `fetchActivity`;
- guardar actividad actual en estado;
- guardar estado local del formulario de respuestas mediante reducer.

## Estado de respuestas

El reducer maneja:

- `INIT_ASSIGNMENT`
- `SET_DESCRIPTOR`
- `SET_COMMENT`

El estado tiene esta forma aproximada:

```js
{
  descriptors: {
    [id]: {
      assignmentIndicatorId,
      descriptorId,
      valueAssigned,
      comment
    }
  },
  status
}
```

## Riesgo actual

El provider inicializa respuestas usando `Indicator.id`, pero el backend necesita distinguir ese id del `AssignmentIndicator.id`. Esa confusion debe resolverse antes de implementar guardado definitivo.
