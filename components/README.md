# Componentes

Esta carpeta contiene componentes visuales de la landing y de la aplicacion interna.

## `components/landing`

Componentes de la pagina publica.

### `Navbar.jsx`

Muestra el logo, enlaces de navegacion y un boton para ir a la pantalla de login.

## `components/app`

Componentes de la zona privada.

### `LayoutContent.jsx`

Layout del area privada.

Responsabilidades:

- mostrar u ocultar el navbar segun `StyleProvider`;
- envolver el contenido con `ActivityProvider`.

### `Navbar.jsx`

Navbar lateral de la aplicacion interna.

Estado actual:

- muestra la seccion `Actividades`;
- tiene logica local para marcar seleccion, pero no usa estado React, asi que el cambio no fuerza re-render.

## `components/app/activities`

Componentes para mostrar y responder actividades.

### `PreActiviities.jsx`

Renderiza la lista de actividades asignadas.

Nota: el nombre tiene typo. Deberia ser `PreActivities.jsx`.

### `PreActivityItem.jsx`

Renderiza una actividad individual y navega hacia su detalle.

### `Judgement.jsx`

Renderiza un criterio de evaluacion y sus indicadores.

### `Indicator.jsx`

Renderiza un indicador, sus descriptores, comentario y evidencia.

Estado actual:

- actualiza comentario con debounce;
- prepara un objeto `apiData`;
- solo imprime en consola, no persiste.

### `Descriptor.jsx`

Renderiza una opcion de respuesta para un indicador.

Estado actual:

- al hacer click actualiza estado local;
- usa debounce;
- solo imprime en consola, no persiste.

## Observacion general

Los componentes de actividades mezclan UI con detalles del contrato de guardado. Para escalar el proyecto, conviene mover la comunicacion con API a funciones de servicio o a un hook especializado.
