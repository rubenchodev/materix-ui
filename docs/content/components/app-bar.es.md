---
title: "App Bar"
description: "Barra superior con el título, la navegación y las acciones principales de la pantalla actual."
group: "surfaces"
icon: "view_headline"
weight: 10
example: "app-bar"
mui: "https://mui.com/material-ui/react-app-bar/"
---

**App Bar** es la barra superior de la aplicación: muestra el título de la pantalla, el botón de navegación y las acciones más frecuentes dentro de una **Toolbar**. Úsala una vez por pantalla como cabecera. Para cambiar entre vistas del mismo nivel usa [Tabs](../tabs/), para la navegación principal combínala con un [Drawer](../drawer/) y, para una acción principal flotante, usa un [Fab](../fab/).

## Uso básico

Un `<header data-mtx="app-bar">` con `data-title`, `data-start-icon` y `data-end-icon` genera la `.mtx-toolbar`, el título y los IconButtons. Los hijos que escribas se colocan después del título. Por defecto la barra es `fixed`; en estas demos se usa `data-position="static"` para que quede dentro de la página.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Noticias" data-start-icon="menu">
  <button class="mtx-button mtx-button--text" data-mtx="button">Entrar</button>
</header>
{{< /mtx-demo >}}

## Colores

`data-color` admite `primary`, `secondary`, `default` (superficie de papel; es el valor si no se indica), `transparent` e `inherit`. `data-elevation` cambia la sombra (4 por defecto). Con `data-elevation="0"` la barra recibe `mtx-app-bar--flat` y, en `default`, un único divisor inferior en lugar de la sombra. `transparent` nunca lleva sombra. Los colores derivan del color de contraste de la barra, así que siguen siendo correctos en tema oscuro (donde `primary` es claro con texto oscuro).

{{< mtx-demo title="Colores" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Primary" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="secondary" data-title="Secondary" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="default" data-title="Default" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="transparent" data-elevation="0" data-title="Transparent" data-start-icon="menu"></header>
</div>
{{< /mtx-demo >}}

## Tamaños

La Toolbar regular mide 56 px en móvil y 64 px desde 600 px, con márgenes laterales de 16 y 24 px. `data-dense` la reduce a 48 px. La variante `prominent` (128 px) solo está disponible con la sintaxis BEM (`.mtx-toolbar--prominent`).

{{< mtx-demo title="Regular y dense" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Regular" data-start-icon="menu" data-end-icon="search"></header>
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-dense data-title="Dense" data-start-icon="menu" data-end-icon="search"></header>
</div>
{{< /mtx-demo >}}

## Con iconos

`data-start-icon` añade el botón de navegación (`.mtx-toolbar__navigation-icon`) y `data-end-icon` una acción final. Sus nombres accesibles se fijan con `data-start-icon-label` y `data-end-icon-label`; sin ellos, el icono `menu` (o cualquier icono inicial con `data-drawer`) se etiqueta «Abrir navegación» desde el diccionario i18n y el resto usa su nombre. Con `data-drawer="id"` el botón de navegación alterna ese [Drawer](../drawer/). Para varias acciones escribe tú los botones como hijos (marca el título con `.mtx-toolbar__title`).

{{< mtx-demo title="Icono inicial/final y botones propios" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Inicial y final" data-start-icon="arrow_back" data-end-icon="account_circle"></header>
  <header data-mtx="app-bar" data-position="static" data-color="primary">
    <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu" aria-label="Abrir navegación"></button>
    <span class="mtx-toolbar__title">Fotos</span>
    <button data-mtx="icon-button" data-icon="search" aria-label="Buscar"></button>
    <button data-mtx="icon-button" data-icon="more_vert" aria-label="Más opciones"></button>
  </header>
</div>
{{< /mtx-demo >}}

### Botones en la barra

Dentro de la Toolbar, los [Button]({{< relref "/components/button" >}}) `text` y `outlined` y los Icon Button heredan el color de la barra (como `color="inherit"` en MUI), así que se leen sobre `primary`, `secondary` y `default` sin clases extra. Los `contained` conservan su par fondo/contraste: elige un color que destaque sobre la barra (p. ej. `data-color="secondary"` sobre una barra `primary`). Los deshabilitados mantienen su color de estado.

{{< mtx-demo title="Text, outlined y contained en una barra primary" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Materix">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-1">
    <button class="mtx-button mtx-button--text mtx-d-none mtx-d-sm-inline-flex" data-mtx="button">Docs</button>
    <button class="mtx-button mtx-button--outlined" data-mtx="button">Login</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="secondary" data-start-icon="rocket_launch">Empezar</button>
  </div>
</header>
{{< /mtx-demo >}}

## Posición

`data-position` define cómo se comporta la barra al desplazar la página.

| Valor | Comportamiento |
|---|---|
| `fixed` (predeterminado) | Fija arriba en la ventana (`z-index` de app bar). Empieza el contenido con `<div class="mtx-toolbar-offset"></div>` para reservar su altura (56px, 64px desde 600px; `--dense` 48px). |
| `sticky` | Fluye con el contenido y se pega arriba al alcanzarla. |
| `static` | Forma parte del flujo y se desplaza con la página. |
| `absolute` | Anclada arriba del ancestro posicionado; con `.mtx-app-bar--bottom`, abajo. |
| `relative` | Posición relativa, sin anclaje. |

{{< mtx-demo title="Sticky dentro de un contenedor con scroll" layout="block" >}}
<div style="height: 220px; overflow-y: auto; border: 1px solid var(--mtx-color-divider);">
  <p class="mtx-p-2">Este párrafo queda por encima de la barra. Desplaza el contenedor.</p>
  <header data-mtx="app-bar" data-position="sticky" data-color="secondary" data-title="Sticky"></header>
  <div class="mtx-p-2">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
</div>
{{< /mtx-demo >}}

### Anclas bajo la barra

Cuando la página tiene una AppBar `fixed` o `sticky`, `<html>` recibe automáticamente `scroll-padding-top: var(--mtx-app-bar-height)` (48px si la única Toolbar es `dense`): al seguir un enlace `#ancla` o al mover el foco con Tab, el destino se detiene debajo de la barra en lugar de quedar oculto. Ajusta el valor con `--mtx-scroll-padding-top` (p. ej. `<html style="--mtx-scroll-padding-top: 120px">` si hay una segunda barra) o desactívalo con `<html data-mtx-scroll-padding="false">`. Para destinos concretos existe la utilidad `mtx-scroll-mt-app-bar`, y `mtx-scroll-smooth` en `<html>` activa el desplazamiento suave respetando `prefers-reduced-motion` (ver [Utilidades]({{< relref "/guide/utilities" >}})).

```html
<html class="mtx-scroll-smooth">
<body>
  <header data-mtx="app-bar" data-position="sticky" data-title="Landing">
    <a class="mtx-button mtx-button--text" data-mtx="button" href="#precios">Precios</a>
  </header>
  …
  <section id="precios">…</section> <!-- no queda bajo la barra -->
```

## Scroll

`data-elevate-on-scroll` empieza sin sombra y aplica la elevación al desplazar; `data-hide-on-scroll` oculta la barra al bajar (pasados 50 px) y la muestra al subir. `data-scroll-target` indica el selector del contenedor observado (por defecto, la ventana).

{{< mtx-demo title="Hide on scroll en un contenedor" layout="block" >}}
<div id="doc-app-bar-scroll" style="height: 220px; overflow-y: auto; border: 1px solid var(--mtx-color-divider);">
  <header data-mtx="app-bar" data-position="sticky" data-color="primary" data-hide-on-scroll data-scroll-target="#doc-app-bar-scroll" data-title="Se oculta al bajar" data-start-icon="menu"></header>
  <div class="mtx-p-2">
    <p>Baja para ocultar la barra; sube para que reaparezca.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
  </div>
</div>
{{< /mtx-demo >}}

```html
<!-- Página completa: la barra observa la ventana -->
<header data-mtx="app-bar" data-color="default" data-elevate-on-scroll data-title="Mi aplicación"></header>
```

## Menú y búsqueda

Las acciones pueden abrir un [Menu](../menu/) con `data-open-menu="#id"`. Para buscar, usa el patrón `.mtx-app-bar-search` (40 px de alto, con modificadores `--grow`, `--right`, `--centered` y `--compact`) o un [TextField](../text-field/) con `data-variant="no-label"` y `data-size="small"` (puede encogerse dentro de la Toolbar). Su relleno, texto y placeholder derivan del color de la barra (`currentColor`), así que mantienen el contraste en `primary`, `secondary`, `default` y en tema oscuro. `--grow` ocupa el espacio libre hasta `--mtx-app-bar-search-max-width` (560px) y no cambia de ancho al enfocar.

{{< mtx-demo title="Menú de cuenta y búsqueda" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu" aria-label="Abrir navegación"></button>
  <span class="mtx-toolbar__title">Panel</span>
  <div class="mtx-app-bar-search mtx-app-bar-search--right">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Buscar…" aria-label="Buscar" />
  </div>
  <button data-mtx="icon-button" data-icon="account_circle" aria-label="Cuenta de usuario" data-open-menu="#doc-app-bar-menu"></button>
</header>
<div data-mtx="menu" id="doc-app-bar-menu">
  <div data-mtx="menu-item" data-icon="person">Perfil</div>
  <div data-mtx="menu-item" data-icon="logout">Cerrar sesión</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Búsqueda que crece (--grow)" layout="column" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-title="Pedidos">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Buscar pedidos o clientes…" aria-label="Buscar pedidos o clientes" />
  </div>
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notificaciones"></button>
</header>
<header data-mtx="app-bar" data-position="static" data-color="default" data-elevation="0" data-start-icon="menu" data-title="Archivos">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Buscar en Drive" aria-label="Buscar en Drive" />
  </div>
  <button data-mtx="icon-button" data-icon="settings" aria-label="Ajustes"></button>
</header>
{{< /mtx-demo >}}

## Casos de uso reales

### Barra con Drawer de navegación

Con `data-drawer="id"` el botón de navegación generado alterna un [Drawer](../drawer/) (equivale a escribir un botón con `data-mtx-drawer-toggle="id"`), sin JavaScript.

{{< mtx-demo title="App Bar + Drawer" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-drawer="doc-app-bar-drawer" data-title="Panel con Drawer">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notificaciones"></button>
</header>
<div data-mtx="drawer" id="doc-app-bar-drawer" data-anchor="left" data-title="Panel">
  <ul data-mtx="list" aria-label="Navegación principal">
    <li data-mtx="list-item-button" data-icon="dashboard">Vista general</li>
    <li data-mtx="list-item-button" data-icon="analytics">Estadísticas</li>
    <li data-mtx="list-item-button" data-icon="settings">Ajustes</li>
  </ul>
</div>
{{< /mtx-demo >}}

### App shell

Para el layout completo de una aplicación (AppBar `fixed` + Drawer `responsive` y `clipped`, temporal en móvil y permanente en escritorio, + `.mtx-toolbar-offset` + `<main>`) sigue la [receta App shell](../drawer/#app-shell-layout-responsive) del Drawer. No necesita CSS propio.

### Navegación responsive

Muestra enlaces de texto en pantallas anchas y un icono con Menu en las estrechas, alternando con tus propias clases de visibilidad (el ejemplo en vivo de `/examples/app-bar` lo muestra completo).

```html
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <span class="nav-mobile">
    <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu"
            aria-label="Abrir navegación" data-open-menu="#nav-menu"></button>
  </span>
  <span class="mtx-toolbar__title">LOGO</span>
  <nav class="nav-desktop" aria-label="Secciones">
    <button class="mtx-button mtx-button--text" data-mtx="button">Productos</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Precios</button>
  </nav>
</header>
```

## Sintaxis BEM completa

Si la barra ya contiene una `.mtx-toolbar`, no se auto-construye: escribe las clases de posición y color tú mismo. Es la vía para variantes sin atributo, como `prominent`, varias Toolbars o la barra inferior.

```html
<header class="mtx-app-bar mtx-app-bar--static mtx-app-bar--primary" data-mtx="app-bar">
  <div class="mtx-toolbar mtx-toolbar--prominent">
    <button class="mtx-icon-button mtx-toolbar__navigation-icon" data-mtx="icon-button" aria-label="Abrir navegación">
      <span class="material-icons" aria-hidden="true">menu</span>
    </button>
    <span class="mtx-toolbar__title">Título prominente</span>
    <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Buscar">
      <span class="material-icons" aria-hidden="true">search</span>
    </button>
  </div>
</header>

<!-- Barra inferior dentro de un contenedor posicionado -->
<header class="mtx-app-bar mtx-app-bar--absolute mtx-app-bar--bottom mtx-app-bar--primary" data-mtx="app-bar">
  <div class="mtx-toolbar">...</div>
</header>
```

## Uso programático

Las barras se inicializan al cargar la página. La instancia expone `setColor()` y `setPosition()`; no emite eventos.

```javascript
// UMD (window.Materix)
const el = document.querySelector('#barra');
const appBar = Materix.getInstance(el);   // o: new Materix.AppBar(el)
appBar.setColor('secondary');
appBar.setPosition('sticky');
appBar.destroy();                         // quita el listener de scroll y desvincula la instancia
```

```javascript
// ES modules
import { AppBar } from '@rubenchodev/materix-ui';
const appBar = new AppBar(document.querySelector('header'));
```

{{< mtx-demo title="setColor()" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Barra dinámica" id="doc-app-bar-api"></header>
<div class="mtx-stack mtx-stack--row mtx-stack--spacing-1 mtx-mt-2" style="flex-wrap: wrap;">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="primary">primary</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="secondary">secondary</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="default">default</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-app-bar-api');
  if (!el) return;
  document.querySelectorAll('[data-doc-color]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      Materix.getInstance(el).setColor(btn.getAttribute('data-doc-color'));
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `app-bar` | — | Inicializa el componente. |
| `data-title` | texto | — | Genera `.mtx-toolbar__title` (solo sin `.mtx-toolbar` previa). |
| `data-start-icon` | nombre de Material Icon | — | IconButton de navegación al inicio. |
| `data-end-icon` | nombre de Material Icon | — | IconButton al final (después de los hijos). |
| `data-start-icon-label` · `data-end-icon-label` | texto | «Abrir navegación» (`menu`) / nombre del icono | `aria-label` de los IconButtons generados. |
| `data-drawer` | `id` del Drawer | — | El botón de navegación generado alterna ese Drawer (`data-mtx-drawer-toggle`, `aria-controls`, `aria-expanded`). |
| `data-dense` | booleano (presencia) | ausente | Toolbar densa de 48 px. |
| `data-position` | `fixed` \| `sticky` \| `static` \| `absolute` \| `relative` | `fixed` | Posicionamiento. |
| `data-color` | `primary` \| `secondary` \| `default` \| `transparent` \| `inherit` | `default` | Color de fondo y texto. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | `4` | Sombra, escrita en la variable `--mtx-app-bar-shadow` (así `--transparent` y `--flat` pueden anularla). `0` añade `--flat`. |
| `data-elevate-on-scroll` | booleano (presencia) | ausente | Sin sombra arriba; elevación al desplazar. |
| `data-hide-on-scroll` | booleano (presencia) | ausente | Se oculta al bajar y reaparece al subir. |
| `data-scroll-target` | selector CSS | ventana | Contenedor cuyo scroll se observa. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-app-bar` | Contenedor flex en columna, ancho completo. |
| `.mtx-app-bar--fixed` / `--sticky` / `--static` / `--absolute` / `--relative` | Posición. |
| `.mtx-app-bar--primary` / `--secondary` / `--default` / `--transparent` / `--inherit` | Color. |
| `.mtx-app-bar--bottom` | Ancla la barra abajo (con `fixed` o `absolute`). |
| `.mtx-app-bar--hidden` | Desplazada fuera de la vista (la usa `hide-on-scroll`). |
| `.mtx-app-bar--animated` | Activa las transiciones de sombra, color y ocultación. JavaScript la añade tras el primer frame pintado para que el color, el tema y la elevación iniciales no se animen al cargar. |
| `.mtx-app-bar--clipped` | `z-index` por encima del Drawer recortado. |
| `.mtx-app-bar--flat` / `--elevation-0` | Sin sombra; en `default`, un único divisor inferior. |
| `.mtx-toolbar` | Fila de 56/64 px con márgenes de 16/24 px. |
| `.mtx-toolbar--dense` | 48 px de alto. |
| `.mtx-toolbar--prominent` | 128 px, título alineado abajo. |
| `.mtx-toolbar--disable-gutters` | Sin márgenes laterales. |
| `.mtx-toolbar__navigation-icon` | Botón de navegación (margen −12 px / 16 px). |
| `.mtx-toolbar__title` | Título h6 que ocupa el espacio libre con elipsis. |
| `.mtx-toolbar__spacer` | Separador flexible. |
| `.mtx-app-bar-search` | Campo de búsqueda de 40 px; modificadores `--grow` (ocupa el espacio libre, máx. 560px, sin salto de ancho al enfocar), `--right`, `--centered`, `--compact`. |
| `.mtx-toolbar-offset` · `--dense` | Espaciador con la altura de la AppBar fija (56px, 64px desde 600px; dense 48px). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setColor(color)` | `void` | Sustituye la clase de color (`primary`, `secondary`, `default`, `transparent`, `inherit`). |
| `setPosition(position)` | `void` | Sustituye la clase de posición (`fixed`, `static`, `sticky`, `absolute`, `relative`). |
| `destroy()` | `void` | Elimina el listener de scroll, cancela los frames pendientes y desvincula la instancia del registro. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-primary` / `--mtx-color-primary-contrast` | Color `primary`. |
| `--mtx-color-secondary` / `--mtx-color-secondary-contrast` | Color `secondary`. |
| `--mtx-color-background-paper` / `--mtx-color-text-primary` / `--mtx-color-divider` | Color `default`. |
| `--mtx-elevation-{n}` · `--mtx-app-bar-shadow` | Sombra (la variable la fijan `data-elevation` y elevate-on-scroll). |
| `--mtx-app-bar-height` | Altura que usan `.mtx-toolbar-offset` y el Drawer clipped (56px, 64px desde 600px). |
| `--mtx-scroll-padding-top` | Sustituye el `scroll-padding-top` automático de `<html>` con una AppBar fixed/sticky (por defecto `--mtx-app-bar-height`). |
| `--mtx-app-bar-search-max-width` | Ancho máximo de `.mtx-app-bar-search--grow` (560px). |
| `--mtx-z-index-app-bar` / `--mtx-z-index-drawer` | Apilamiento (1100; `--clipped` usa drawer + 1). |
| `--mtx-spacing-2` / `--mtx-spacing-3` | Márgenes de la Toolbar. |
| `--mtx-toolbar-action-gap` | Espacio entre acciones consecutivas colocadas directamente en la Toolbar (IconButton, Button, Avatar, Badge, ToggleButton). Por defecto `--mtx-spacing-1` (8px), para que iconos, badges y avatar no queden pegados. Usa `0` para los icon buttons juntos de MUI. |
| `--mtx-duration-standard` / `--mtx-easing-standard` | Transiciones de sombra, color y ocultación (solo con `mtx-app-bar--animated`; ninguna con `prefers-reduced-motion`). |

## Accesibilidad

- Usa `<header>` como raíz: es el landmark `banner` cuando está en el nivel superior de la página.
- Los IconButtons generados por `data-start-icon`/`data-end-icon` toman su `aria-label` de `data-start-icon-label`/`data-end-icon-label`; por defecto el icono `menu` es «Abrir navegación» (i18n, `appBar.openNavigation`) y el resto usa su nombre, así que ponles siempre una etiqueta. Sus iconos son `aria-hidden`.
- Con `data-drawer`, el botón de navegación expone `aria-controls` y un `aria-expanded` que mantiene sincronizado el Drawer.
- `.mtx-app-bar-search` muestra un anillo de foco de 2px cuando su campo recibe el foco de teclado; envuélvelo con `role="search"` y da al input un `aria-label`.
- Agrupa los enlaces de navegación en un `<nav aria-label="…">`.
- Las transiciones respetan la duración de los tokens; con `hide-on-scroll` la barra vuelve a mostrarse al subir, de modo que la navegación nunca queda inaccesible.

| Tecla | Acción |
|---|---|
| `Tab` | Recorre los botones y campos de la barra en orden visual. |
| `Enter` / `Espacio` | Activa el botón enfocado (abre el Menu o el Drawer). |
