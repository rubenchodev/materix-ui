---
title: "Drawer"
description: "Panel lateral de navegación o contenido auxiliar: temporal, persistente, permanente o responsive, con cabecera y pie generados y patrón app shell."
group: "navigation"
icon: "menu_open"
weight: 10
example: "drawer"
mui: "https://mui.com/material-ui/react-drawer/"
---

`Drawer` es un panel que se desliza desde un borde de la pantalla para mostrar la navegación de la aplicación o contenido auxiliar (filtros, detalles, opciones), como el `Drawer` de MUI. Úsalo para la navegación principal en móvil (temporal) o como barra lateral fija en escritorio (permanente). Para una decisión o un formulario breve que interrumpe el flujo usa [Dialog](../dialog/); para una lista corta de acciones sobre un elemento, [Menu](../menu/).

## Uso básico

Un contenedor `data-mtx="drawer"` con su contenido directo. `data-title` genera la cabecera con título y botón de cierre; el contenido se envuelve en un panel con scroll y se crea un fondo (*backdrop*). Cualquier elemento con `data-mtx-drawer-open="id"` lo abre.

{{< mtx-demo title="Drawer temporal de navegación" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-basic">Abrir navegación</button>

<div data-mtx="drawer" id="doc-drawer-basic" data-title="Correo">
  <nav data-mtx="list" aria-label="Navegación principal">
    <a data-mtx="list-item-button" data-icon="inbox" href="#" data-selected>Bandeja de entrada</a>
    <a data-mtx="list-item-button" data-icon="star" href="#">Destacados</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Enviados</a>
    <a data-mtx="list-item-button" data-icon="drafts" href="#">Borradores</a>
  </nav>
</div>
{{< /mtx-demo >}}

Se cierra con <kbd>Escape</kbd>, con un clic en el fondo o fuera del panel, con la X o con cualquier elemento interior que tenga `data-mtx-drawer-close`. Al hacer clic en un ítem de la lista, este queda seleccionado (el resto se deselecciona dentro del drawer).

## App shell (layout responsive)

La receta principal para una aplicación, sin CSS propio; es la misma estructura que *Responsive drawer* + *Clipped under the app bar* de MUI:

1. Una [AppBar](../app-bar/) `fixed`. Con `data-drawer="id"` su icono de navegación generado pasa a ser el disparador del drawer.
2. Una fila flex (`mtx-d-flex`) con el drawer en `data-variant="responsive"` + `data-clipped`: **temporal** (modal, por encima de la AppBar) por debajo de `data-breakpoint` y **permanente** (caja de ancho fijo en el flujo, sticky justo bajo la AppBar) desde ese ancho. Mismo markup, sin navegación duplicada.
3. Un `<main class="mtx-flex-1 mtx-min-w-0">` que empieza con `.mtx-toolbar-offset` (espaciador con la altura de la AppBar: 56px en móvil, 64px desde 600px).

```html
<header data-mtx="app-bar" data-position="fixed" data-color="primary"
        data-start-icon="menu" data-drawer="app-nav" data-title="Mi aplicación">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Buscar…" aria-label="Buscar">
  </div>
</header>

<div class="mtx-d-flex">
  <div data-mtx="drawer" id="app-nav" data-variant="responsive" data-breakpoint="md"
       data-clipped data-width="240px" data-title="Mi aplicación" data-header="temporary"
       aria-label="Navegación principal">
    <nav data-mtx="list" aria-label="Secciones">
      <a data-mtx="list-item-button" data-icon="dashboard" href="/" aria-current="page" data-mtx-drawer-close>Resumen</a>
      <a data-mtx="list-item-button" data-icon="receipt_long" href="/orders" data-mtx-drawer-close>Pedidos</a>
    </nav>
    <div class="mtx-mt-auto mtx-p-2">…pie anclado abajo…</div>
  </div>

  <main class="mtx-flex-1 mtx-min-w-0">
    <div class="mtx-toolbar-offset"></div>
    …
  </main>
</div>
```

- El icono de menú se oculta solo mientras el drawer es permanente (`mtx-drawer-trigger--hidden`) y recibe `aria-controls`/`aria-expanded`.
- `data-mtx-drawer-close` en los enlaces cierra el drawer tras navegar en móvil; no hace nada mientras es permanente.
- `data-header="temporary"` muestra la cabecera generada (título + botón de cierre) solo en modo temporal, porque en escritorio la AppBar ya muestra la marca.
- `.mtx-drawer__content` es una columna flex: un hijo con `mtx-mt-auto` queda anclado al pie (tarjeta de plan, versión, cerrar sesión…).

Abre el [app shell a pantalla completa]({{< example-url "drawer/dashboard.html" >}}) y cambia el ancho de la ventana. El mismo patrón dentro de un contenedor (con `data-absolute`, para que drawer y fondo queden en el marco):

{{< mtx-demo title="Drawer responsive dentro de un contenedor" layout="block" height="340px" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-drawer="doc-drawer-shell" data-title="Correo"></header>
<div class="mtx-d-flex mtx-position-relative mtx-overflow-hidden" style="height: 260px">
  <div data-mtx="drawer" id="doc-drawer-shell" data-variant="responsive" data-breakpoint="md" data-absolute
       data-width="220px" data-title="Correo" data-header="temporary" aria-label="Carpetas">
    <nav data-mtx="list" aria-label="Carpetas">
      <a data-mtx="list-item-button" data-icon="inbox" href="#" data-selected data-mtx-drawer-close>Entrada</a>
      <a data-mtx="list-item-button" data-icon="star" href="#" data-mtx-drawer-close>Destacados</a>
      <a data-mtx="list-item-button" data-icon="send" href="#" data-mtx-drawer-close>Enviados</a>
    </nav>
  </div>
  <div class="mtx-flex-1 mtx-min-w-0 mtx-p-2">Por debajo de 900px el icono de menú abre el drawer; desde 900px es permanente.</div>
</div>
{{< /mtx-demo >}}

## Variantes

`data-variant` elige el comportamiento, igual que MUI:

- `temporary` (predeterminada): modal sobre la página con fondo, bloquea el scroll del `<body>`, atrapa el foco y lo devuelve al cerrar.
- `persistent`: se abre y cierra sin fondo; la página sigue siendo interactiva.
- `permanent`: siempre visible y no se puede cerrar. Como en MUI, es una caja de ancho fijo en el flujo de una fila flex (`flex-shrink: 0`) cuyo panel es `sticky` y mide el alto de la ventana (`100dvh`), de modo que no se desplaza con la página.
- `responsive`: `temporary` por debajo de `data-breakpoint` (`sm` 600px, `md` 900px por defecto, `lg` 1200px, `xl` 1536px) y `permanent` desde ese ancho, con el mismo markup (ver «App shell»).

Con `data-absolute` el drawer (y su fondo) se posicionan dentro del contenedor padre en lugar de la ventana, útil para paneles incrustados como estos; un `permanent` contenido toma el alto del contenedor en lugar del de la ventana.

{{< mtx-demo title="temporary y persistent dentro de un contenedor" layout="row" height="300px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-temporary">temporary</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-toggle="doc-drawer-persistent">persistent (alternar)</button>

<div data-mtx="drawer" id="doc-drawer-temporary" data-absolute data-width="narrow" data-title="Temporal">
  <nav data-mtx="list" aria-label="Navegación temporal">
    <a data-mtx="list-item-button" data-icon="inbox" href="#">Entrada</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Enviados</a>
  </nav>
</div>

<div data-mtx="drawer" id="doc-drawer-persistent" data-variant="persistent" data-absolute data-width="narrow" data-title="Persistente">
  <nav data-mtx="list" aria-label="Navegación persistente">
    <a data-mtx="list-item-button" data-icon="inbox" href="#">Entrada</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Enviados</a>
  </nav>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="permanent (contenido)" layout="row" >}}
<div data-mtx="drawer" data-variant="permanent" data-absolute data-width="220px" data-title="Permanente">
  <nav data-mtx="list" aria-label="Navegación permanente">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Resumen</a>
    <a data-mtx="list-item-button" data-icon="shopping_cart" href="#">Pedidos</a>
    <a data-mtx="list-item-button" data-icon="people" href="#">Clientes</a>
  </nav>
</div>
<p>Contenido de la página junto al drawer permanente.</p>
{{< /mtx-demo >}}

## Anclas

`data-anchor` define el borde: `left` (predeterminado), `right`, `top` o `bottom`. Los drawers superior e inferior ocupan todo el ancho y se ajustan a su contenido (equivalente a una *bottom sheet*).

{{< mtx-demo title="Cuatro bordes" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-left">left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-right">right</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-top">top</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-bottom">bottom</button>

<div data-mtx="drawer" id="doc-drawer-left" data-anchor="left" data-title="Izquierda" data-padded="true">
  <p>Navegación principal.</p>
</div>
<div data-mtx="drawer" id="doc-drawer-right" data-anchor="right" data-title="Detalles" data-padded="true">
  <p>Panel de detalles o filtros.</p>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>Aceptar</button>
</div>
<div data-mtx="drawer" id="doc-drawer-top" data-anchor="top" data-title="Aviso" data-padded="true">
  <p>Aviso global desplegado desde arriba.</p>
</div>
<div data-mtx="drawer" id="doc-drawer-bottom" data-anchor="bottom" data-title="Compartir">
  <nav data-mtx="list" aria-label="Compartir">
    <a data-mtx="list-item-button" data-icon="mail" href="#">Correo</a>
    <a data-mtx="list-item-button" data-icon="link" href="#">Copiar enlace</a>
  </nav>
</div>
{{< /mtx-demo >}}

## Anchos

Sin `data-width` el ancho es responsivo: `min(85vw, 320px)` por debajo de 600px, 280px desde 600px y 300px desde 900px. Los laterales nunca superan el 85% de la ventana, de modo que siempre queda visible parte de la página.

| `data-width` | Ancho | Variable |
|---|---|---|
| — | `min(85vw, 320px)` · 280px (≥ 600px) · 300px (≥ 900px) | `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` |
| `narrow` | 200px | `--mtx-drawer-width-narrow` |
| `wide` | 360px | `--mtx-drawer-width-wide` |
| `full` (o `full-width`) | 100vw | — |
| Medida CSS (`450px`, `40vw`…) | La indicada | se escribe en `width` y `--mtx-drawer-width` |

{{< mtx-demo title="narrow, wide y medida libre" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-narrow">narrow</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-wide">wide</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-custom">450px</button>

<div data-mtx="drawer" id="doc-drawer-narrow" data-width="narrow" data-title="200px" data-padded="true"><p>Compacto.</p></div>
<div data-mtx="drawer" id="doc-drawer-wide" data-width="wide" data-title="360px" data-padded="true"><p>Para formularios y filtros.</p></div>
<div data-mtx="drawer" id="doc-drawer-custom" data-anchor="right" data-width="450px" data-title="450px" data-padded="true"><p>Medida arbitraria.</p></div>
{{< /mtx-demo >}}

## Cabecera y pie

- `data-title` crea una cabecera con título (`h3`) y botón de cierre; `data-close-button="false"` lo omite (en `permanent` nunca se genera).
- `data-user-name`, `data-user-email` y `data-user-avatar` crean una cabecera de usuario con [Avatar](../avatar/) (por defecto, la inicial del nombre). Tiene prioridad sobre `data-title`.
- `data-footer-version` y `data-footer-action` crean un pie fijo con un texto y un botón de texto en color `error` que cierra el drawer; `data-footer-action-icon` cambia su icono (`logout` por defecto).
- `data-padded="true"` añade 20px de relleno al contenido, manteniendo cabecera y pie de borde a borde.
- `data-header="temporary"` muestra la cabecera generada solo mientras el drawer es temporal (útil en `responsive`). Cualquier elemento puede usar las clases `mtx-drawer__temporary-only` / `mtx-drawer__permanent-only` con el mismo fin.
- `data-subtitle` añade un subtítulo apilado bajo el título (`mtx-drawer__heading`).

La cabecera y el pie quedan fijos y solo el centro desplaza su contenido.

{{< mtx-demo title="Cabecera de usuario, subencabezados y pie" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-user">Abrir menú de cuenta</button>

<div data-mtx="drawer" id="doc-drawer-user"
     data-user-name="Ana García" data-user-email="ana@ejemplo.com" data-user-avatar="AG"
     data-footer-version="v0.1.0" data-footer-action="Cerrar sesión" data-footer-action-icon="logout">
  <div data-mtx="list-subheader">General</div>
  <nav data-mtx="list" aria-label="General">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Dashboard</a>
    <a data-mtx="list-item-button" data-icon="mail" href="#">Mensajes</a>
  </nav>
  <div data-mtx="list-subheader">Ajustes</div>
  <nav data-mtx="list" aria-label="Ajustes">
    <a data-mtx="list-item-button" data-icon="tune" href="#">Preferencias</a>
    <a data-mtx="list-item-button" data-icon="help_outline" href="#">Ayuda</a>
  </nav>
</div>
{{< /mtx-demo >}}

## Estados

Además de abierto y cerrado puedes limitar los cierres implícitos de un drawer temporal:

- `data-disable-backdrop-click`: ni el fondo ni un clic fuera lo cierran.
- `data-disable-escape`: <kbd>Escape</kbd> no lo cierra.
- `data-backdrop="false"` (o `data-hide-backdrop`): sin fondo; un clic fuera lo sigue cerrando.

{{< mtx-demo title="Solo cierre explícito" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-locked">Editar sin guardar</button>

<div data-mtx="drawer" id="doc-drawer-locked" data-title="Cambios sin guardar"
     data-disable-backdrop-click data-disable-escape data-close-button="false" data-padded="true">
  <p>Elige una opción para cerrar.</p>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-drawer-close>Descartar</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>Guardar</button>
</div>
{{< /mtx-demo >}}

## Disparadores declarativos

| Atributo | Dónde | Acción |
|---|---|---|
| `data-mtx-drawer-open="id"` | Cualquier elemento | Abre el drawer `id`. |
| `data-mtx-drawer-toggle="id"` | Cualquier elemento | Alterna el drawer `id` (botón de menú). |
| `data-mtx-drawer-close="id"` | Cualquier elemento | Cierra el drawer `id` (motivo `closeButtonClick`). |
| `data-mtx-drawer-close` (sin valor) | Dentro del drawer | Cierra el drawer que lo contiene. |
| `data-drawer-autofocus` | Dentro del drawer | Elemento que recibe el foco al abrir (si no, el primero enfocable). |

Los disparadores `open` y `toggle` reciben `aria-controls` y `aria-expanded` sincronizados al abrir y cerrar. En un drawer `responsive` reciben además `mtx-drawer-trigger--hidden` (`display: none`) mientras es permanente. Una [AppBar](../app-bar/) con `data-start-icon` + `data-drawer="id"` genera este disparador por ti.

## Bajo la AppBar

En el patrón *clipped* la [AppBar](../app-bar/) ocupa todo el ancho y el drawer empieza debajo. `data-clipped` se aplica a `permanent`, `responsive` (en su modo permanente) y `persistent`: el drawer empieza a `--mtx-app-bar-height` (56px en móvil, 64px desde 600px) y queda bajo la AppBar en el apilamiento (`--mtx-z-index-app-bar` − 1). El temporal ignora `clipped`: es un modal (`--mtx-z-index-modal`) y cubre la AppBar, como en MUI. La receta de página completa está en «App shell».

Dentro de un contenedor, el mismo efecto se consigue con un drawer permanente contenido en la fila bajo la AppBar:

{{< mtx-demo title="AppBar continua con drawer permanente debajo" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <span class="mtx-toolbar__title">Mi aplicación</span>
</header>
<div class="mtx-d-flex">
  <div data-mtx="drawer" data-variant="permanent" data-absolute data-width="220px">
    <nav data-mtx="list" aria-label="Aplicación">
      <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Resumen</a>
      <a data-mtx="list-item-button" data-icon="shopping_cart" href="#">Pedidos</a>
      <a data-mtx="list-item-button" data-icon="bar_chart" href="#">Informes</a>
    </nav>
  </div>
  <div class="mtx-flex-1 mtx-min-w-0 mtx-p-2">Contenido principal</div>
</div>
{{< /mtx-demo >}}

## Responsive

`data-variant="responsive"` sustituye al antiguo patrón de dos drawers. El drawer observa `(min-width: <breakpoint>)` con `matchMedia` y, al cruzarlo:

- **a permanente**: libera el modal (fondo, bloqueo de scroll y trampa de foco) si estaba abierto, aplica `role="navigation"` (salvo que hayas puesto tu propio `role`), quita `role="dialog"`/`aria-modal` del panel y oculta sus disparadores.
- **a temporal**: queda cerrado, recupera en el panel `role="dialog"` + `aria-modal="true"` (con el nombre del `aria-label` del drawer o del título de la cabecera), `aria-hidden="true"`, muestra los disparadores y, si el foco estaba dentro del drawer, lo lleva al disparador.
- Emite `mtx:drawer:mode-change` con `{ mode, previousMode }`. El modo actual está en `drawer.mode`.

```html
<div data-mtx="drawer" id="nav" data-variant="responsive" data-breakpoint="lg" aria-label="Navegación principal">…</div>
```

Sin `matchMedia` (SSR, tests) se comporta como temporal.

## Submenús colapsables

Un ítem con `data-mtx-collapse-trigger="id"` y `aria-expanded` despliega un contenedor `mtx-collapse` con una lista anidada (`data-nested`, sangría de 48px). El indicador `mtx-collapse-indicator` gira 90° y `data-no-select` evita que el ítem padre quede seleccionado.

{{< mtx-demo title="Navegación con secciones plegables" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-nested">Abrir proyectos</button>

<div data-mtx="drawer" id="doc-drawer-nested" data-title="Proyectos">
  <nav data-mtx="list" aria-label="Proyectos">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Resumen</a>
    <button type="button" data-mtx="list-item-button" data-icon="folder" data-no-select
            data-mtx-collapse-trigger="doc-drawer-sub" aria-expanded="false">
      Mis proyectos<span class="material-icons mtx-collapse-indicator" aria-hidden="true">chevron_right</span>
    </button>
    <div id="doc-drawer-sub" class="mtx-collapse" hidden>
      <div data-mtx="list" data-nested>
        <a data-mtx="list-item-button" data-icon="language" href="#">Sitio web</a>
        <a data-mtx="list-item-button" data-icon="smartphone" href="#">App móvil</a>
      </div>
    </div>
  </nav>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Panel de filtros a la derecha con un formulario en [Grid](../grid/):

{{< mtx-demo title="Filtros" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-filters">Filtros</button>

<div data-mtx="drawer" id="doc-drawer-filters" data-anchor="right" data-width="wide" data-padded="true" data-title="Filtros">
  <div data-mtx="grid" data-spacing="2">
    <div data-mtx="grid" data-xs="12"><input data-mtx="text-field" data-label="Buscar" data-variant="outlined" type="search"></div>
    <div data-mtx="grid" data-xs="6"><input data-mtx="text-field" data-label="Precio mín." data-variant="outlined" type="number"></div>
    <div data-mtx="grid" data-xs="6"><input data-mtx="text-field" data-label="Precio máx." data-variant="outlined" type="number"></div>
    <div data-mtx="grid" data-xs="12"><input type="checkbox" data-mtx="checkbox" data-label="Solo con stock" checked></div>
    <div data-mtx="grid" data-xs="12"><button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" data-mtx-drawer-close>Aplicar</button></div>
  </div>
</div>
{{< /mtx-demo >}}

Para un layout de aplicación completo (AppBar fija, drawer con perfil, submenús y pie, contenido en grilla) abre la [plantilla de dashboard]({{< example-url "drawer/dashboard.html" >}}).

## Sintaxis BEM completa

Si el HTML ya trae cabecera, contenido y pie, el componente no duplica nada.

```html
<div class="mtx-drawer mtx-drawer--left mtx-drawer--wide" id="perfil" data-mtx="drawer">
  <div class="mtx-drawer__header">
    <h3 class="mtx-drawer__title">Editar perfil</h3>
    <button type="button" class="mtx-icon-button mtx-drawer__close" aria-label="Cerrar" data-mtx-drawer-close>
      <span class="material-icons" aria-hidden="true">close</span>
    </button>
  </div>
  <div class="mtx-drawer__content mtx-drawer__content--padded">…</div>
  <div class="mtx-drawer__footer">
    <div class="mtx-drawer__footer-info">Borrador guardado</div>
    <div class="mtx-drawer__footer-actions">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-drawer-close>Cancelar</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>Guardar</button>
    </div>
  </div>
</div>
```

## Uso programático

```javascript
const drawer = Materix.getInstance(document.getElementById('perfil'));

drawer.open();
drawer.close('saved');   // el motivo llega en event.detail.reason
drawer.toggle();
console.log(drawer.isOpen);

drawer.element.addEventListener('mtx:drawer:open', () => console.log('abierto'));
drawer.element.addEventListener('mtx:drawer:close', (event) => {
  console.log(event.detail.reason); // backdropClick | escapeKeyDown | closeButtonClick | clickaway | programmatic | …
});
```

Con ES modules:

```javascript
import { Drawer, getInstance } from 'materix-ui';
const drawer = new Drawer(document.getElementById('perfil'));
```

{{< mtx-demo title="open(), close() y eventos" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-drawer-api-open">drawer.open()</button>
<span id="doc-drawer-api-status" aria-live="polite">Sin eventos</span>

<div data-mtx="drawer" id="doc-drawer-api" data-anchor="right" data-title="API" data-padded="true">
  <button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-drawer-api-close">close('saved')</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-drawer-api');
  const drawer = Materix.getInstance(el);
  const status = document.getElementById('doc-drawer-api-status');
  document.getElementById('doc-drawer-api-open').addEventListener('click', (event) => {
    event.stopPropagation();
    drawer.open();
  });
  document.getElementById('doc-drawer-api-close').addEventListener('click', () => drawer.close('saved'));
  el.addEventListener('mtx:drawer:open', () => { status.textContent = 'mtx:drawer:open'; });
  el.addEventListener('mtx:drawer:close', (event) => { status.textContent = 'mtx:drawer:close · reason=' + event.detail.reason; });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-variant` | `temporary`, `persistent`, `permanent`, `responsive` | `temporary` | Comportamiento del drawer. |
| `data-breakpoint` | `sm`, `md`, `lg`, `xl` | `md` | Con `responsive`: ancho (600/900/1200/1536px) desde el que es permanente. |
| `data-anchor` | `left`, `right`, `top`, `bottom` | `left` | Borde desde el que aparece. |
| `data-width` | `narrow`, `wide`, `full`, `full-width` o medida CSS | responsivo | Ancho del drawer (ver «Anchos»). |
| `data-open` | booleano | — | Abre el drawer (temporal o persistente) al inicializarse. |
| `data-absolute` | booleano | — | Posiciona drawer y fondo dentro del contenedor padre; sin bloqueo de scroll del `<body>`. |
| `data-clipped` | booleano | — | En `permanent`, `responsive` y `persistent`: empieza bajo la AppBar (`--mtx-app-bar-height`, 56/64px) y queda debajo en el apilamiento. Se ignora mientras es temporal. |
| `data-elevation` | `0`–`24` | 16 (temporal) | Sombra `--mtx-elevation-{n}`. |
| `data-title` | Texto | — | Genera cabecera con título y botón de cierre. |
| `data-subtitle` | Texto | — | Subtítulo apilado bajo `data-title`. |
| `data-header` | `temporary` | — | Muestra la cabecera generada solo en modo temporal. |
| `data-user-name` · `data-user-email` · `data-user-avatar` | Texto | inicial del nombre | Cabecera de usuario con avatar. |
| `data-close-button` | `false` | `true` | Omite el botón de cierre generado. |
| `data-footer-version` | Texto | — | Texto informativo del pie. |
| `data-footer-action` | Texto | — | Botón del pie que cierra el drawer. |
| `data-footer-action-icon` | Nombre de Material Icons | `logout` | Icono del botón del pie. |
| `data-padded` | `true` | — | Relleno de 20px en el contenido. |
| `data-backdrop` | `false` | `true` | Sin fondo (también `data-hide-backdrop`). |
| `data-disable-backdrop-click` | booleano | — | Ni el fondo ni un clic fuera cierran el drawer. |
| `data-disable-escape` | booleano | — | <kbd>Escape</kbd> no lo cierra. |

Los disparadores (`data-mtx-drawer-open`, `-toggle`, `-close`, `data-drawer-autofocus` y `data-mtx-collapse-trigger`) se describen en «Disparadores declarativos» y «Submenús colapsables».

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-drawer` | Bloque base (`position: fixed`, columna flex, fondo `paper`, elevación 16). |
| `mtx-drawer--left` / `--right` / `--top` / `--bottom` | Ancla. |
| `mtx-drawer--open` | Estado abierto. |
| `mtx-drawer--animated` | Habilita la transición tras la primera interacción (evita animar en la carga). |
| `mtx-drawer--temporary` / `--persistent` / `--permanent` | Modo actual (lo pone el JS; en `responsive` cambia con el breakpoint). |
| `mtx-drawer--responsive` | Drawer con la variante `responsive`. |
| `mtx-drawer--narrow` / `--wide` / `--full-width` | Anchos de 200px, 360px y 100vw. |
| `mtx-drawer--clipped` | Bajo la AppBar. |
| `mtx-drawer--absolute` | Posicionado en el contenedor padre. |
| `mtx-drawer--padded` | Relleno de 20px en el contenido. |
| `mtx-drawer__header` · `__heading` · `__title` · `__subtitle` · `__close` | Cabecera fija y sus partes (el cierre se oculta mientras es permanente). |
| `mtx-drawer__temporary-only` · `mtx-drawer__permanent-only` | Contenido interior visible solo en ese modo. |
| `mtx-drawer-trigger--hidden` | Se añade a los disparadores de un drawer `responsive` mientras es permanente. |
| `mtx-drawer__user` · `__user-avatar` · `__user-info` · `__user-name` · `__user-email` · `__user-role` | Cabecera de usuario. |
| `mtx-drawer__content` · `mtx-drawer__content--padded` · `mtx-drawer__body` | Panel con scroll en columna flex (`mtx-mt-auto` ancla un hijo al pie). |
| `mtx-drawer__footer` · `__footer--column` · `__footer-info` · `__footer-actions` | Pie fijo. |
| `mtx-drawer__backdrop` · `--open` · `--invisible` · `--absolute` | Fondo. |
| `mtx-collapse` · `mtx-collapse--open` · `mtx-collapse-indicator` | Submenús plegables. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `open()` | `void` | Abre el drawer; en `temporary` bloquea el scroll, atrapa el foco y enfoca el primer elemento (o `[data-drawer-autofocus]`). |
| `close(reason = 'programmatic')` | `void` | Cierra el drawer y devuelve el foco al elemento previo. No actúa en `permanent`. |
| `toggle()` | `void` | Alterna abierto/cerrado. |
| `isOpen` (getter) | `boolean` | Estado abierto (siempre `true` mientras es permanente). |
| `mode` (propiedad) | `string` | Modo actual: `temporary`, `persistent` o `permanent`. |
| `syncTriggers()` | `void` | Vuelve a sincronizar `aria-*` y visibilidad de disparadores añadidos después. |
| `destroy()` | `void` | Cierra, retira listeners y elimina el fondo. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:drawer:open` | — | El drawer se abre. |
| `mtx:drawer:close` | `{ reason }` | El drawer se cierra. `reason`: `backdropClick`, `escapeKeyDown`, `closeButtonClick`, `clickaway`, `programmatic` o el valor pasado a `close()`. |
| `mtx:drawer:mode-change` | `{ mode, previousMode }` | Un drawer `responsive` cruza su breakpoint. |

Alias deprecado: `mtx:drawer:modechange` se sigue emitiendo con el mismo `detail` hasta la 1.0.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` | Ancho predeterminado por breakpoint (`min(85vw, 320px)`, 280px, 300px). |
| `--mtx-drawer-width-narrow` · `--mtx-drawer-width-wide` | Anchos `narrow` (200px) y `wide` (360px). |
| `--mtx-drawer-elevation` | Sombra del drawer temporal (`--mtx-elevation-16`). |
| `--mtx-app-bar-height` | Alto de la AppBar para `clipped` (56px, 64px desde 600px). |
| `--mtx-z-index-modal` · `--mtx-z-index-drawer` · `--mtx-z-index-app-bar` | Apilamiento: temporal 1300 (fondo 1299), permanente 1200, permanente clipped 1099, AppBar 1100. |
| `--mtx-color-background-paper` · `--mtx-color-text-primary` · `--mtx-color-text-secondary` · `--mtx-color-divider` · `--mtx-color-action-active` | Colores de superficie, texto, bordes e indicadores. |
| `--mtx-type-h6` · `--mtx-type-body2` | Tipografía del título y subtítulo. |
| `--mtx-duration-standard` · `--mtx-duration-shorter` · `--mtx-easing-standard` | Animaciones de apertura y de submenús. |

## Accesibilidad

- `temporary`: el panel interior recibe `role="dialog"` y `aria-modal="true"`; el foco queda atrapado dentro y vuelve al disparador al cerrar. La trampa intercepta siempre <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> y mueve el foco explícitamente entre los elementos tabulables, así que los enlaces se incluyen también en WebKit/Safari (que por defecto los omite con Tab). `persistent` recibe `role="region"` y `permanent` `role="navigation"`. El contenedor sincroniza `aria-hidden`.
- Da un nombre al contenido: un `<nav aria-label="…">` para la navegación, o `aria-label` en el drawer.
- El `aria-label` del botón de cierre generado sale del diccionario i18n (`drawer.close`: «Close» / «Cerrar»), según el idioma del drawer o de la página.
- `responsive`: la semántica ARIA cambia con el modo (ver «Responsive») y el foco nunca queda dentro de un drawer oculto.
- Los disparadores declarativos reciben `aria-controls` y `aria-expanded`.
- Los submenús colapsados (`mtx-collapse`) reciben `hidden` e `inert`, y un submenú expandido hereda la visibilidad del drawer: dentro de un drawer cerrado (`aria-hidden="true"`) ninguno de sus enlaces es enfocable (axe `aria-hidden-focus`).
- La raíz fija y su fondo fijan `margin: 0`, así que los márgenes de estilos de la página (p. ej. `* + * { margin-top }`) nunca los desplazan.
- Respeta `prefers-reduced-motion`: sin transiciones de apertura ni de submenús.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el disparador | Abre, cierra o alterna el drawer. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los elementos del drawer; en `temporary` el foco no sale de él. |
| <kbd>Escape</kbd> | Cierra el drawer temporal (salvo `data-disable-escape`). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en un ítem plegable | Despliega o pliega el submenú. |
