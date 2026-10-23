---
title: "Pagination"
description: "Permite elegir una página dentro de un conjunto grande de resultados, con elipsis, primera/última página y modo enlaces para SSR."
group: "navigation"
icon: "last_page"
weight: 35
example: "pagination"
mui: "https://mui.com/material-ui/react-pagination/"
---

`Pagination` implementa `Pagination` de MUI: botones de página con elipsis calculada con el mismo algoritmo que `usePagination`, botones anterior/siguiente y, opcionalmente, primera/última, variantes `text` y `outlined`, formas `circular` y `rounded`, tres tamaños y tres colores. Úsalo para recorrer listados de resultados, artículos de un blog o catálogos. Para tablas con «filas por página» y rango «1–10 de 100», usa `TablePagination` de [Table](../table/).

## Uso básico

Un único `<nav data-mtx="pagination">` con `data-count` (total de páginas) y, opcionalmente, `data-page` (base 1). El componente genera los botones, la elipsis y los `aria-label` traducidos.

{{< mtx-demo title="Paginación básica" layout="column" >}}
<nav data-mtx="pagination" data-count="10"></nav>
<nav data-mtx="pagination" data-count="10" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-color="secondary"></nav>
<nav data-mtx="pagination" data-count="10" data-disabled></nav>
{{< /mtx-demo >}}

## Variantes

`data-variant="text"` (predeterminada) u `outlined`.

{{< mtx-demo title="Outlined" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-color="secondary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-disabled></nav>
{{< /mtx-demo >}}

## Formas

`data-shape="circular"` (predeterminada) o `rounded` (radio de 4px).

{{< mtx-demo title="Rounded" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="2" data-shape="rounded" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="2" data-shape="rounded" data-variant="outlined"></nav>
{{< /mtx-demo >}}

## Tamaños

`data-size="small|medium|large"`: ítems de 26px, 32px (predeterminado) y 40px, como `PaginationItem` de MUI.

{{< mtx-demo title="Small, medium y large" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-size="small" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-size="large" data-color="primary"></nav>
{{< /mtx-demo >}}

## Colores

`data-color="standard|primary|secondary"` define el color de la página seleccionada.

{{< mtx-demo title="Color de la página seleccionada" layout="column" >}}
<nav data-mtx="pagination" data-count="6" data-page="3"></nav>
<nav data-mtx="pagination" data-count="6" data-page="3" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="6" data-page="3" data-color="secondary"></nav>
{{< /mtx-demo >}}

## Botones

Muestra los botones de primera y última página con `data-show-first-button` y `data-show-last-button`; oculta anterior y siguiente con `data-hide-prev-button` y `data-hide-next-button`.

{{< mtx-demo title="Primera/última y sin anterior/siguiente" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="5" data-show-first-button data-show-last-button></nav>
<nav data-mtx="pagination" data-count="10" data-page="5" data-hide-prev-button data-hide-next-button></nav>
{{< /mtx-demo >}}

## Rangos de paginación

`data-sibling-count` (1) fija cuántas páginas se muestran a cada lado de la actual y `data-boundary-count` (1) cuántas al principio y al final.

{{< mtx-demo title="sibling-count y boundary-count" layout="column" >}}
<nav data-mtx="pagination" data-count="11" data-page="6"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-sibling-count="0"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-sibling-count="2"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-boundary-count="2"></nav>
{{< /mtx-demo >}}

## Estados

Los ítems tienen hover, focus-visible (<kbd>Tab</kbd>) y ripple al pulsar. Anterior/siguiente se deshabilitan solos en los extremos; `data-disabled` deshabilita todo el componente.

{{< mtx-demo title="Última página y deshabilitado" layout="column" >}}
<nav data-mtx="pagination" data-count="5" data-page="5" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="5" data-page="2" data-color="primary" data-disabled></nav>
<nav data-mtx="pagination" data-count="5" data-page="2" data-variant="outlined" data-color="primary" data-disabled></nav>
{{< /mtx-demo >}}

## Modo enlaces (SSR)

Con `data-href-template` cada ítem es un `<a href>` (`{page}` se sustituye por el número): funciona con renderizado en servidor, se puede abrir en otra pestaña y no necesita JavaScript para navegar. Los ítems que no pueden navegar llevan `aria-disabled="true"` y no tienen `href`.

{{< mtx-demo title="Enlaces" layout="column" >}}
<nav data-mtx="pagination" data-count="8" data-page="3" data-href-template="?page={page}" data-variant="outlined" data-shape="rounded" data-color="primary"></nav>
{{< /mtx-demo >}}

{{< callout type="info" title="Mejora progresiva" >}}
En modo enlaces, al pulsar una página se emite `mtx:pagination:change` **cancelable**. Si llamas a `preventDefault()`, se cancela la navegación nativa y el componente actualiza la página actual en el cliente (útil para cargar la página con `fetch` y mantener los enlaces para buscadores y usuarios sin JavaScript).
{{< /callout >}}

## Casos de uso reales

Listado de artículos paginado en el cliente: `mtx:pagination:change` repinta la lista.

{{< mtx-demo title="Listado paginado" layout="column" >}}
<ul data-mtx="list" id="doc-pg-articles" aria-live="polite"></ul>
<nav data-mtx="pagination" data-count="4" data-color="primary" aria-label="Paginación de artículos" id="doc-pg-articles-nav"></nav>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var articles = ['Cómo diseñar formularios accesibles', 'Guía de tokens de color', 'Tipografía responsive con clamp()', 'Sombras y elevación en MUI', 'Estados de foco visibles', 'Patrones de navegación móvil', 'Tablas con ordenación y filtros', 'Microinteracciones con ripple', 'Modo oscuro sin parpadeo', 'Iconografía en cuadrícula de 24px', 'Rejillas de 12 columnas', 'Diálogos y gestión del foco'];
  var perPage = 3;
  var list = document.getElementById('doc-pg-articles');
  var pager = Materix.getInstance(document.getElementById('doc-pg-articles-nav'));
  function render(page) {
    var start = (page - 1) * perPage;
    list.innerHTML = articles.slice(start, start + perPage).map(function (title, i) {
      return '<li data-mtx="list-item"><span data-mtx="list-item-text" data-primary="' + title + '" data-secondary="Artículo ' + (start + i + 1) + ' de ' + articles.length + '"></span></li>';
    }).join('');
    Materix.initAll(list);
  }
  render(pager.page);
  pager.element.addEventListener('mtx:pagination:change', function (event) { render(event.detail.page); });
});
</script>

## Sintaxis BEM completa

Estructura prerenderizada (SSR) que ya se ve correcta sin JavaScript. Si añades `data-mtx="pagination"`, el componente reutiliza el `<ul>` y vuelve a pintar los ítems a partir de `data-count`/`data-page`.

```html
<nav class="mtx-pagination mtx-pagination--outlined mtx-pagination--rounded mtx-pagination--medium mtx-pagination--color-primary" aria-label="pagination navigation">
  <ul class="mtx-pagination__ul">
    <li><a class="mtx-pagination__item" href="?page=1" aria-label="Ir a la página 1">1</a></li>
    <li><a class="mtx-pagination__item mtx-pagination__item--selected" href="?page=2" aria-current="page" aria-label="página 2">2</a></li>
    <li><a class="mtx-pagination__item" href="?page=3" aria-label="Ir a la página 3">3</a></li>
    <li><div class="mtx-pagination__ellipsis">…</div></li>
    <li><a class="mtx-pagination__item" href="?page=9" aria-label="Ir a la página 9">9</a></li>
  </ul>
</nav>
```

## Uso programático

`goTo(n)`, `next()` y `previous()` emiten `mtx:pagination:change`; asignar `page` o `count` actualiza sin emitir (útil para sincronizar con un estado externo sin bucles).

{{< mtx-demo title="Métodos y eventos" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-color="primary" data-show-first-button data-show-last-button id="doc-pg-api"></nav>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-prev">previous()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-next">next()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-goto">goTo(7)</button>
</div>
<p class="mtx-typography--body2" id="doc-pg-status" aria-live="polite">Página 1</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var api = Materix.getInstance(document.getElementById('doc-pg-api'));
  var status = document.getElementById('doc-pg-status');
  api.element.addEventListener('mtx:pagination:change', function (event) {
    status.textContent = 'Página ' + event.detail.page + ' (anterior: ' + event.detail.previousPage + ')';
  });
  document.getElementById('doc-pg-prev').addEventListener('click', function () { api.previous(); });
  document.getElementById('doc-pg-next').addEventListener('click', function () { api.next(); });
  document.getElementById('doc-pg-goto').addEventListener('click', function () { api.goTo(7); });
});
</script>

```javascript
const pagination = Materix.getInstance(document.querySelector('#paginacion-resultados'));

pagination.element.addEventListener('mtx:pagination:change', (event) => {
  loadResults(event.detail.page);
});

pagination.goTo(3);        // emite mtx:pagination:change
pagination.count = 25;     // silencioso; ajusta la página actual si hace falta
pagination.page = 1;       // silencioso

// Instanciación directa
const pager = new Materix.Pagination(document.querySelector('nav.paginador'));
```

Con ES modules:

```javascript
import { Pagination, getInstance } from 'materix-ui';
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `pagination` | — | Inicializa el componente sobre un `<nav>` (recomendado), un `<div>` (recibe `role="navigation"`) o un `<ul>` (se envuelve en `<nav>`). |
| `data-count` | entero ≥ 0 | `1` | Número total de páginas. |
| `data-page` | entero ≥ 1 | `1` | Página actual (base 1). El componente lo mantiene sincronizado. |
| `data-sibling-count` | entero ≥ 0 | `1` | Páginas visibles a cada lado de la actual. |
| `data-boundary-count` | entero ≥ 0 | `1` | Páginas siempre visibles al principio y al final. |
| `data-variant` | `text`, `outlined` | `text` | Variante visual. |
| `data-shape` | `circular`, `rounded` | `circular` | Forma de los ítems. |
| `data-size` | `small`, `medium`, `large` | `medium` | Tamaño de los ítems (26/32/40px). |
| `data-color` | `standard`, `primary`, `secondary` | `standard` | Color de la página seleccionada. |
| `data-show-first-button` | booleano | — | Muestra el botón «primera página». |
| `data-show-last-button` | booleano | — | Muestra el botón «última página». |
| `data-hide-prev-button` | booleano | — | Oculta el botón «página anterior». |
| `data-hide-next-button` | booleano | — | Oculta el botón «página siguiente». |
| `data-disabled` | booleano | — | Deshabilita todos los ítems. |
| `data-href-template` | URL con `{page}` | — | Modo enlaces: pinta `<a href>` en lugar de `<button>`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-pagination` | `<nav>` raíz. |
| `mtx-pagination--text` / `mtx-pagination--outlined` | Variante. |
| `mtx-pagination--circular` / `mtx-pagination--rounded` | Forma. |
| `mtx-pagination--small` / `mtx-pagination--medium` / `mtx-pagination--large` | Tamaño. |
| `mtx-pagination--color-standard` / `--color-primary` / `--color-secondary` | Color de la página seleccionada. |
| `mtx-pagination--disabled` | Componente completo deshabilitado. |
| `mtx-pagination__ul` | Lista flex con salto de línea. |
| `mtx-pagination__item` | Ítem interactivo (`<button>` o `<a>`). |
| `mtx-pagination__item--page` | Ítem de número de página. |
| `mtx-pagination__item--selected` | Página actual (`aria-current="page"`). |
| `mtx-pagination__item--nav` | Botón de navegación, junto con `--first`, `--previous`, `--next` o `--last`. |
| `mtx-pagination__icon` | Icono SVG de los botones de navegación (se refleja en RTL). |
| `mtx-pagination__ellipsis` | Elipsis no interactiva («…»). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `page` (getter/setter) | `number` | Página actual. El setter ajusta a `[1, count]` y no emite evento. |
| `count` (getter/setter) | `number` | Número total de páginas. El setter ajusta la página actual si queda fuera. |
| `goTo(page)` | `boolean` | Va a una página y emite `mtx:pagination:change` si cambió. |
| `next()` / `previous()` | `boolean` | Va a la página siguiente o anterior (emite el evento). |
| `disable()` / `enable()` | `void` | Deshabilita o habilita todos los ítems. |
| `disabled` (getter) | `boolean` | Estado deshabilitado. |
| `destroy()` | `void` | Elimina los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

La función pura `getPaginationItems(options)` (exportada por `src/components/pagination/pagination.js`) devuelve la lista de ítems (`'previous'`, `1`, `'start-ellipsis'`…) con el algoritmo `usePagination` de MUI.

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:pagination:change` | `{ page, previousPage }` (+ `href` en modo enlaces) | La página cambia por interacción, `goTo()`, `next()` o `previous()`. En modo enlaces se emite antes de navegar y es cancelable. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-pagination-size`, `--mtx-pagination-radius`, `--mtx-pagination-padding`, `--mtx-pagination-gap`, `--mtx-pagination-font-size`, `--mtx-pagination-icon-size` | Geometría de los ítems por tamaño. |
| `--mtx-pagination-accent`, `--mtx-pagination-accent-dark`, `--mtx-pagination-accent-contrast` | Color de la página seleccionada (primary o secondary). |
| `--mtx-pagination-outlined-border` | Borde de la variante `outlined`. |
| `--mtx-pagination-selected-mix`, `--mtx-pagination-selected-hover-mix` | Opacidad del fondo seleccionado en `outlined` (8%/12% claro, 16%/24% oscuro). |
| `--mtx-color-action-hover`, `--mtx-color-action-selected`, `--mtx-color-action-focus`, `--mtx-disabled-opacity` | Estados de interacción. |

## Accesibilidad

- Landmark `<nav>` con `aria-label` traducido (i18n `pagination.label`: «pagination navigation» / «navegación de paginación»); se respeta tu propio `aria-label`. Da un `aria-label` distinto a cada paginación de una misma página.
- Cada página es un `<button>` real (o `<a href>` en modo enlaces) con `aria-label` «Ir a la página N»; la actual lleva `aria-current="page"` y la etiqueta «página N».
- Botones de navegación: «Ir a la primera/anterior/siguiente/última página»; su icono SVG es `aria-hidden`.
- En los extremos se deshabilitan con `disabled` (o `aria-disabled` en modo enlaces). Si el botón enfocado queda deshabilitado tras un cambio, el foco pasa a la página actual.
- El foco se conserva en el mismo ítem tras cada repintado.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre páginas y botones de navegación. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la página o el botón enfocado (solo <kbd>Enter</kbd> en modo enlaces). |
