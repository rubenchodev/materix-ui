---
title: "App Bar"
description: "Barra superior con el título, la navegación y las acciones principales de la pantalla actual."
group: "surfaces"
icon: "view_headline"
weight: 10
example: "app-bar"
import: "AppBar, Toolbar, ToolbarTitle, ToolbarOffset"
mui: "https://mui.com/material-ui/react-app-bar/"
---

`AppBar` es la barra superior de la aplicación: muestra el título de la pantalla, el botón de navegación y las acciones más frecuentes dentro de una `Toolbar`. Úsala una vez por pantalla como cabecera. Para cambiar entre vistas del mismo nivel usa [Tabs](../tabs/), para la navegación principal combínala con un [Drawer](../drawer/) y para una acción principal flotante usa un [Fab](../fab/).

```tsx
import { AppBar, Toolbar } from '@rubenchodev/materix-react';
// o solo este componente:
import { AppBar, Toolbar } from '@rubenchodev/materix-react/components/app-bar';
```

## Uso básico

`title`, `startIcon` y `endIcon` generan la `Toolbar`, el título y los [IconButton](../icon-button/) (el equivalente de la sintaxis simplificada vanilla). Los hijos se colocan tras el título. La barra es `fixed` por defecto; estas demos usan `position="static"` para que quede dentro de la página.

{{< react-demo id="app-bar/01-basic" layout="block" >}}

## Colores

`color` admite `primary`, `secondary`, `default` (superficie paper; el valor por defecto), `transparent` e `inherit`. `elevation` cambia la sombra (4 por defecto); se escribe en la variable `--mtx-app-bar-shadow` para que `transparent` y `--flat` puedan anularla. Con `elevation={0}` la barra recibe `mtx-app-bar--flat` y, en `default`, un único divisor inferior en lugar de la sombra.

{{< react-demo id="app-bar/02-colors" layout="block" >}}

## Tamaños

La Toolbar normal mide 56px en móvil y 64px desde 600px, con márgenes laterales de 16 y 24px. `dense` la reduce a 48px y `toolbarVariant="prominent"` la eleva a 128px con el título abajo. `disableGutters` quita los márgenes laterales.

{{< react-demo id="app-bar/03-sizes" layout="block" >}}

## Con y sin iconos

`startIcon` añade el botón de navegación (`.mtx-toolbar__navigation-icon`) y `endIcon` una acción final; ambos aceptan un nombre de Material Icons o un nodo. Sus nombres accesibles se fijan con `startIconLabel` y `endIconLabel`; sin ellos, el icono `menu` (o cualquier icono inicial con `navigationControls`) se etiqueta "Open navigation" desde el diccionario i18n (`appBar.openNavigation`) y los demás usan su nombre. Para varias acciones escríbelas como hijos y marca el título con `ToolbarTitle`. Dentro de la Toolbar, los [Button](../button/) `text` y `outlined` y los IconButton heredan el color de la barra; los `contained` conservan sus colores.

{{< react-demo id="app-bar/04-icons" layout="block" >}}

## Posición

`position` define cómo se comporta la barra al desplazar la página.

| Valor | Comportamiento |
|---|---|
| `fixed` (por defecto) | Fija arriba del viewport (`z-index` de app bar). Empieza el contenido con `<ToolbarOffset />` para reservar su altura (56px, 64px desde 600px; `dense` 48px). |
| `sticky` | Fluye con el contenido y se pega arriba al alcanzarlo. |
| `static` | Forma parte del flujo normal; se desplaza con la página. |
| `absolute` | Anclada arriba del ancestro posicionado; con `bottom`, abajo. |
| `relative` | Posición relativa, sin anclaje. |

`clipped` eleva el `z-index` por encima de un Drawer recortado. Cuando la página tiene una barra `fixed` o `sticky`, el CSS añade `scroll-padding-top` a `<html>` para que los destinos `#ancla` no queden ocultos bajo ella (ajústalo con `--mtx-scroll-padding-top`).
En la demo, la barra `fixed` queda contenida por un `transform` en su marco; en una página real queda fija a la ventana.

{{< react-demo id="app-bar/05-position" layout="block" >}}

## Menú y búsqueda

Las acciones abren un [Menu](../menu/) con `useMenu()` (el equivalente de `data-open-menu` en vanilla). Para buscar, usa el patrón `.mtx-app-bar-search` (40px de alto, con los modificadores `--grow`, `--right`, `--centered` y `--compact`) o un [TextField](../text-field/) con `variant="no-label"` y `size="small"`, que puede encogerse dentro de la Toolbar. Su relleno, texto y placeholder derivan del color de la barra, así que conservan el contraste en `primary`, `secondary`, `default` y en el tema oscuro. Envuelve el patrón con `role="search"` y da al input un `aria-label`.

{{< react-demo id="app-bar/06-menu-search" layout="block" >}}

## Scroll

`elevateOnScroll` empieza sin sombra y aplica la elevación al desplazarse; `hideOnScroll` oculta la barra al bajar (más de 50px) y la muestra al subir. Por defecto se observa la ventana; `scrollTarget` acepta una ref, un elemento, una función o un selector CSS del contenedor con scroll. El cálculo se hace una vez por frame y el frame pendiente se cancela al desmontar.

{{< react-demo id="app-bar/07-scroll" layout="block" >}}

## Responsive

La Toolbar cambia de altura y márgenes a 600px. Para la navegación, muestra enlaces de texto en pantallas anchas y un icono con un Menu en las estrechas, alternándolos con las utilidades `mtx-d-md-none` / `mtx-d-md-flex`.

{{< react-demo id="app-bar/08-responsive" layout="block" >}}

## Con Drawer

En vanilla, `data-drawer="id"` convierte el botón de navegación en disparador de un Drawer. En React, `onNavigationClick` abre el [Drawer](../drawer/) y `navigationControls` / `navigationExpanded` mantienen sincronizados `aria-controls` y `aria-expanded`. Para el app shell completo (barra fija + Drawer responsive recortado + `ToolbarOffset`), consulta la página de Drawer.

{{< react-demo id="app-bar/09-drawer" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<AppBar
  startIcon="menu"
  title="Panel"
  navigationControls="main-drawer"
  navigationExpanded={open}
  onNavigationClick={() => setOpen((value) => !value)}
/>
<Drawer id="main-drawer" open={open} onClose={() => setOpen(false)}>…</Drawer>;
```

## Maquetación en grilla

La barra ocupa el 100 % del ancho de su contenedor; el contenido de la pantalla se maqueta debajo con [Grid](../grid/).

{{< react-demo id="app-bar/10-grid" layout="block" >}}

## Uso programático

Los métodos `setColor()` y `setPosition()` de vanilla pasan a ser las props `color` y `position`; cualquier cambio es un nuevo render. La barra vanilla no emite eventos.

{{< react-demo id="app-bar/11-programmatic" layout="block" >}}

## Composición con Toolbar

Si los hijos incluyen una `Toolbar`, no se genera ninguna (el equivalente de la sintaxis BEM completa vanilla): úsalo para varias Toolbar, barras `prominent` o el control total del contenido.

{{< react-demo id="app-bar/12-composition" layout="block" >}}

## Referencia de la API

### AppBar

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `position` | `'fixed' \| 'sticky' \| 'static' \| 'absolute' \| 'relative'` | `'fixed'` | Posicionamiento. |
| `color` | `'primary' \| 'secondary' \| 'default' \| 'transparent' \| 'inherit'` | `'default'` | Color de fondo y de texto. |
| `elevation` | `number` (0–24) | elevación 4 del CSS | Sombra vía `--mtx-app-bar-shadow`; `0` añade `--flat`. |
| `elevateOnScroll` | `boolean` | `false` | Sin sombra arriba; elevación al desplazarse. |
| `hideOnScroll` | `boolean` | `false` | Se oculta al bajar (más de 50px) y reaparece al subir. |
| `scrollTarget` | `RefObject \| HTMLElement \| Window \| (() => …) \| string` | `window` | Contenedor con scroll observado. |
| `bottom` | `boolean` | `false` | Ancla la barra abajo (`fixed`/`absolute`). |
| `clipped` | `boolean` | `false` | `z-index` por encima del Drawer recortado. |
| `title` | `ReactNode` | — | `.mtx-toolbar__title` generado. |
| `startIcon` | `ReactNode` | — | IconButton de navegación. |
| `startIconLabel` | `string` | "Open navigation" (`menu` o nodo) / nombre del icono | `aria-label` del botón de navegación. |
| `onNavigationClick` | `(event) => void` | — | Clic en el botón de navegación (p. ej. abrir un Drawer). |
| `navigationControls` | `string` | — | `aria-controls` del botón de navegación. |
| `navigationExpanded` | `boolean` | `false` | `aria-expanded` del botón de navegación (con `navigationControls`). |
| `endIcon` | `ReactNode` | — | IconButton final (tras los hijos). |
| `endIconLabel` | `string` | nombre del icono (nodo: "More options") | `aria-label` del botón final. |
| `onEndIconClick` | `(event) => void` | — | Clic en el botón final. |
| `dense` | `boolean` | `false` | Toolbar de 48px. |
| `toolbarVariant` | `'regular' \| 'dense' \| 'prominent'` | `'regular'` | Altura de la Toolbar generada. |
| `disableGutters` | `boolean` | `false` | Toolbar generada sin márgenes laterales. |
| `component` | `ElementType` | `'header'` | Elemento raíz. |

`ref`, `className`, `style` y el resto de atributos van a la raíz.

### Toolbar, ToolbarTitle y ToolbarOffset

| Componente | Props | Descripción |
|---|---|---|
| `Toolbar` | `variant` (`regular`, `dense`, `prominent`), `disableGutters`, `component` | Fila `.mtx-toolbar`. |
| `ToolbarTitle` | `component` (`span`) | `.mtx-toolbar__title`: ocupa el espacio libre con elipsis. |
| `ToolbarOffset` | `dense` | `.mtx-toolbar-offset`: espaciador con la altura de una barra fija. |

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-position`, `setPosition()` | `position` |
| `data-color`, `setColor()` | `color` |
| `data-elevation` | `elevation` |
| `data-elevate-on-scroll`, `data-hide-on-scroll`, `data-scroll-target` | `elevateOnScroll`, `hideOnScroll`, `scrollTarget` |
| `data-title`, `data-start-icon`, `data-end-icon` | `title`, `startIcon`, `endIcon` |
| `data-start-icon-label`, `data-end-icon-label` | `startIconLabel`, `endIconLabel` |
| `data-drawer="id"` | `onNavigationClick` + `navigationControls` + `navigationExpanded` |
| `data-dense`, `.mtx-toolbar--prominent`, `.mtx-toolbar--disable-gutters` | `dense`, `toolbarVariant="prominent"`, `disableGutters` |
| `.mtx-app-bar--bottom`, `.mtx-app-bar--clipped` | `bottom`, `clipped` |
| `.mtx-toolbar` existente (sintaxis BEM) | hijo `Toolbar` |

### Clases y variables CSS

Las mismas que la librería vanilla: `mtx-app-bar` (`--fixed`, `--sticky`, `--static`, `--absolute`, `--relative`, `--primary`, `--secondary`, `--default`, `--transparent`, `--inherit`, `--flat`, `--bottom`, `--clipped`, `--hidden`, `--animated`), `mtx-toolbar` (`--dense`, `--prominent`, `--disable-gutters`, `__navigation-icon`, `__title`, `__spacer`), `mtx-toolbar-offset` (`--dense`) y `mtx-app-bar-search` (`--grow`, `--right`, `--centered`, `--compact`). `--animated` se añade tras el primer frame pintado para que el color y la elevación iniciales no se animen. Variables: `--mtx-app-bar-shadow`, `--mtx-app-bar-height`, `--mtx-scroll-padding-top`, `--mtx-app-bar-search-max-width`, `--mtx-z-index-app-bar` y `--mtx-toolbar-action-gap`.

## Accesibilidad

- La raíz es un `<header>`: es el landmark `banner` cuando está en el nivel superior de la página.
- Los IconButton generados siempre tienen `aria-label` (`startIconLabel`/`endIconLabel`; por defecto el "Open navigation" de i18n para `menu`, `navigationControls` o un icono-nodo, "More options" para un icono-nodo final y, si no, el nombre del icono) y sus iconos son `aria-hidden`. Un icono-nodo sin etiqueta avisa en desarrollo: fija etiquetas explícitas para iconos cuyo nombre no sea significativo.
- Con `navigationControls`, el botón de navegación expone `aria-controls` y el `aria-expanded` que pases en `navigationExpanded`.
- Agrupa los enlaces de navegación en un `<nav aria-label="…">`. Las transiciones siguen las duraciones de los tokens y se desactivan con `prefers-reduced-motion`; con `hideOnScroll` la barra reaparece al subir.

| Tecla | Acción |
|---|---|
| `Tab` | Recorre los botones y campos de la barra en orden visual. |
| `Enter` / `Espacio` | Activa el botón enfocado. |
