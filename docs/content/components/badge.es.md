---
title: "Badge"
description: "Muestra un número o un punto de estado en la esquina de un icono, avatar o botón para señalar elementos nuevos o pendientes."
group: "data-display"
icon: "notifications"
weight: 20
example: "badge"
import: "Badge"
mui: "https://mui.com/material-ui/react-badge/"
---

`Badge` envuelve un elemento (icono, avatar, botón) y coloca un contador o un punto en su esquina. Úsalo para señalar mensajes sin leer, notificaciones pendientes o un estado en línea. No lo uses para etiquetas de texto independientes (usa [Chip](../chip/)) ni para mensajes de estado de la página (usa [Alert](../alert/)).

```tsx
import { Badge } from '@rubenchodev/materix-react';
// o solo este componente:
import { Badge } from '@rubenchodev/materix-react/components/badge';
```

## Uso básico

Envuelve el contenido con `<Badge>` y pasa el valor en `badgeContent`. El componente renderiza el nodo `.mtx-badge__badge` después de los hijos y lo posiciona.

{{< react-demo "badge/01-basic" >}}

## Variantes

`standard` (por defecto) muestra el contenido, un número o un texto corto. `dot` muestra un punto de 8px e ignora `badgeContent`.

{{< react-demo id="badge/02-variants" layout="block" >}}

## Sobre iconos, avatares y botones

La insignia envuelve cualquier elemento. Con un botón de icono puede ir dentro, envolviendo el icono (patrón MUI), o fuera, envolviendo el botón. La insignia es decorativa (`aria-hidden="true"`), así que el número debe formar parte del `aria-label` del botón.

{{< react-demo "badge/03-with-icons" >}}

## Colores

Sin `color` (o con `default`) la insignia es un gris neutro que se adapta al tema, como en MUI. El resto de valores usa la paleta con su texto de contraste.

{{< react-demo id="badge/04-colors" layout="block" >}}

## Estados

La insignia se oculta (`.mtx-badge--invisible`, animación de escala) cuando `badgeContent` es `0`, `null` o no existe. `showZero` muestra el cero, `invisible` la oculta siempre y `max` (99 por defecto) convierte los números mayores en `max+`. `max` solo se aplica a números o cadenas numéricas.

{{< react-demo id="badge/05-states" layout="block" >}}

## En línea (standalone)

`standalone` muestra la insignia en el flujo del texto, sin elemento anclado: contadores en navegación, listas o pestañas. Su número pasa a ser contenido (sin `aria-hidden`). Con `label` se añade un `.mtx-badge__label` oculto visualmente para lectores de pantalla (`{0}` se sustituye por el contenido mostrado) y la insignia visible vuelve a ser decorativa.

{{< react-demo id="badge/06-standalone" layout="block" >}}

## Posición

`anchor` coloca la insignia en `top-right` (por defecto), `top-left`, `bottom-right` o `bottom-left`. También se acepta `anchorOrigin={{ vertical, horizontal }}` de MUI, que prevalece sobre `anchor`.

{{< react-demo "badge/07-position" >}}

## Superposición

`overlap="rectangular"` (por defecto) usa las esquinas de la caja; `circular` acerca la insignia al borde de formas redondas como un Avatar.

{{< react-demo id="badge/08-overlap" layout="block" >}}

## Casos de uso

Una barra de acciones con contadores y un avatar con estado en línea.

{{< react-demo "badge/09-use-cases" >}}

## Maquetación en grilla

Accesos de un panel en [Grid](../grid/): 2 columnas en móvil y 4 desde `md`.

{{< react-demo id="badge/10-grid" layout="block" >}}

## Uso controlado

En React la insignia se controla con props: cambia `badgeContent` o `invisible` y el siguiente render aplica `max` y la regla del cero. Sustituye a los setters `content` e `invisible` de vanilla.

{{< react-demo id="badge/11-controlled" layout="block" >}}

## API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `badgeContent` | `ReactNode` | — | Contenido de la insignia (número o texto corto). |
| `variant` | `'standard'` \| `'dot'` | `'standard'` | `dot` añade `.mtx-badge--dot`. |
| `color` | `'default'` \| `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` | `'default'` | Añade `.mtx-badge--{color}`. |
| `anchor` | `'top-right'` \| `'top-left'` \| `'bottom-right'` \| `'bottom-left'` | `'top-right'` | Esquina de la insignia. |
| `anchorOrigin` | `{ vertical: 'top' \| 'bottom', horizontal: 'left' \| 'right' }` | — | Alternativa MUI a `anchor`. |
| `overlap` | `'rectangular'` \| `'circular'` | `'rectangular'` | `circular` añade `.mtx-badge--overlap-circular`. |
| `max` | `number` | `99` | Los valores numéricos mayores muestran `max+`. |
| `showZero` | `boolean` | `false` | Muestra la insignia cuando el contenido es `0`. |
| `invisible` | `boolean` | `false` | Oculta siempre la insignia. |
| `standalone` | `boolean` | `false` | Insignia en línea sin elemento anclado. |
| `label` | `string` | — | Texto para lectores de pantalla; `{0}` = contenido. |
| `component` | `ElementType` | `'span'` | Elemento o componente raíz. |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

El resto de props se reenvía al elemento raíz. También se exporta la utilidad `formatBadgeContent(content, max)`.

### Callbacks

Badge no emite eventos.

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-badge` | Raíz (inline-flex relativo). |
| `.mtx-badge__badge` | La insignia. |
| `.mtx-badge__label` | Texto oculto visualmente (`label`). |
| `.mtx-badge--dot` | Punto de 8px. |
| `.mtx-badge--{color}` | Color de la paleta (`default`, `primary`…). |
| `.mtx-badge--top-left` / `--bottom-right` / `--bottom-left` | Anclaje (top-right no lleva clase). |
| `.mtx-badge--overlap-circular` | Posición para formas redondas. |
| `.mtx-badge--invisible` | Oculta (escala 0). |
| `.mtx-badge--standalone` | Insignia en línea. |

## Accesibilidad

- Las insignias ancladas son decorativas (`aria-hidden="true"`): incluye el número en el nombre accesible del control envuelto (`aria-label="Notificaciones, 17 sin leer"`).
- En modo `standalone` el número se lee como contenido; con `label` lo sustituye el texto para lectores de pantalla.
- La insignia nunca recibe foco y el color no es el único portador de significado.
- La animación de escala se desactiva con `prefers-reduced-motion: reduce`.

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="badge">` | `<Badge>` |
| `data-content="4"` | `badgeContent={4}` |
| `data-variant="dot"` | `variant="dot"` |
| `data-color="error"` | `color="error"` |
| `data-anchor="bottom-left"` | `anchor="bottom-left"` |
| `data-overlap="circular"` | `overlap="circular"` |
| `data-max="9"` | `max={9}` |
| `data-show-zero` | `showZero` |
| `data-invisible` | `invisible` |
| `data-standalone` | `standalone` |
| `data-label="{0} sin leer"` | `label="{0} sin leer"` |
| `badge.content = 5` / `badge.invisible = true` | `badgeContent={5}` / `invisible` |

El DOM renderizado (clases y atributos) es idéntico al del componente vanilla tras inicializarse. La raíz por defecto es `span` (MUI); usa `component="div"` para igualar un `div` de vanilla.
