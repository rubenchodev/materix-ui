---
title: "Pagination"
description: "Permite elegir una página dentro de un conjunto grande de resultados, con elipsis, botones primera/última y modo enlaces para SSR."
group: "navigation"
icon: "last_page"
weight: 35
example: "pagination"
import: "Pagination, PaginationItem, usePagination"
mui: "https://mui.com/material-ui/react-pagination/"
---

**Pagination** implementa el `Pagination` de MUI: botones de página con elipsis calculadas con el mismo algoritmo que `usePagination`, botones anterior/siguiente y, opcionalmente, primera/última, variantes `text` y `outlined`, formas `circular` y `rounded`, tres tamaños y tres colores. Úsalo para recorrer listas de resultados, artículos de un blog o catálogos.

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Pagination } from '@rubenchodev/materix-react';

<Pagination count={10} />
```

## Uso básico

Basta con `count` (total de páginas). El componente pinta el landmark `<nav>`, la lista, los botones, las elipsis y los `aria-label` traducidos. Por defecto no es controlado (`defaultPage`, base 1); usa `page` + `onChange` para controlarlo.

{{< react-demo id="pagination/01-basic" layout="block" >}}

## Variantes

`variant="text"` (por defecto) u `outlined`.

{{< react-demo id="pagination/02-variants" layout="block" >}}

## Formas

`shape="circular"` (por defecto) o `rounded` (radio de 4px).

{{< react-demo id="pagination/03-shapes" layout="block" >}}

## Tamaños

`size="small" | "medium" | "large"`: ítems de 26px, 32px (por defecto) y 40px, como el `PaginationItem` de MUI.

{{< react-demo id="pagination/04-sizes" layout="block" >}}

## Colores

`color="standard" | "primary" | "secondary"` fija el color de la página seleccionada.

{{< react-demo id="pagination/05-colors" layout="block" >}}

## Botones de navegación

Muestra los botones de primera y última página con `showFirstButton` y `showLastButton`; oculta anterior y siguiente con `hidePrevButton` y `hideNextButton`.

{{< react-demo id="pagination/06-buttons" layout="block" >}}

## Rangos de paginación

`siblingCount` (1) fija cuántas páginas se ven a cada lado de la actual, y `boundaryCount` (1) cuántas al principio y al final.

{{< react-demo id="pagination/07-ranges" layout="block" >}}

## Estados

Los ítems tienen hover, focus-visible (<kbd>Tab</kbd>) y ripple al pulsar (`disableRipple` lo desactiva). Anterior/siguiente se deshabilitan solos en los extremos; `disabled` deshabilita todo el componente. Si el botón enfocado queda deshabilitado (por ejemplo «siguiente» en la última página), el foco pasa a la página actual.

{{< react-demo id="pagination/08-states" layout="block" >}}

## Modo enlaces (SSR)

Con `getItemHref(page)` cada ítem es un `<a href>`: funciona con renderizado en servidor, se puede abrir en otra pestaña y no necesita JavaScript para navegar. Los ítems que no pueden navegar llevan `aria-disabled="true"` y no tienen `href`.

{{< react-demo id="pagination/09-links" layout="block" >}}

{{< callout type="info" title="Navegación cancelable" >}}
En modo enlaces, al pulsar una página se llama a `onChange(event, page)` **antes** de navegar. Si llamas a `event.preventDefault()`, se cancela la navegación nativa y la página cambia en el cliente (útil para cargar los resultados con `fetch` y conservar los enlaces para los buscadores). Es el equivalente del evento cancelable `mtx:pagination:change` de vanilla.
{{< /callout >}}

## Ejemplo real

Lista de artículos paginada en el cliente, construida con [List](../list/) dentro de un [Paper](../paper/).

{{< react-demo id="pagination/10-use-cases" layout="block" >}}

## Maquetación en grilla

{{< react-demo id="pagination/11-grid" layout="block" >}}

## Uso controlado y `usePagination`

En modo controlado el padre es dueño de `page`, así que puede cambiarse desde fuera (botones, URL, store). `usePagination` expone la misma lógica que el hook de MUI para construir tu propia interfaz: devuelve `items` (`{ type, page, selected, disabled, onClick }`), `page` y `goTo`.

{{< react-demo id="pagination/12-programmatic" layout="block" >}}

```tsx
const [page, setPage] = useState(1);
<Pagination count={25} page={page} onChange={(event, next) => setPage(next)} />;

// Pintado propio
<Pagination count={10} renderItem={(item) => <PaginationItem {...item} />} />;

// Sin interfaz
const { items } = usePagination({ count: 10 });
```

## Referencia de la API

### Props de Pagination

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `1` | Total de páginas (`0` solo pinta la navegación deshabilitada). |
| `page` | `number` | — | Página actual, base 1 (controlado). Se ajusta a `[1, count]`. |
| `defaultPage` | `number` | `1` | Página inicial (no controlado). |
| `onChange` | `(event, page: number) => void` | — | Se invoca al cambiar de página por interacción (`mtx:pagination:change`). En modo enlaces, `event.preventDefault()` cancela la navegación. |
| `siblingCount` | `number` | `1` | Páginas a cada lado de la actual. |
| `boundaryCount` | `number` | `1` | Páginas siempre visibles al principio y al final. |
| `variant` | `'text' \| 'outlined'` | `'text'` | Variante visual. |
| `shape` | `'circular' \| 'rounded'` | `'circular'` | Forma de los ítems. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño de los ítems (26/32/40px). |
| `color` | `'standard' \| 'primary' \| 'secondary'` | `'standard'` | Color de la página seleccionada. |
| `showFirstButton` / `showLastButton` | `boolean` | `false` | Muestra los botones de primera / última página. |
| `hidePrevButton` / `hideNextButton` | `boolean` | `false` | Oculta los botones de página anterior / siguiente. |
| `disabled` | `boolean` | `false` | Deshabilita todos los ítems. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `getItemHref` | `(page: number) => string` | — | Modo enlaces: pinta `<a href>` en lugar de `<button>`. |
| `getItemAriaLabel` | `(type, page, selected) => string` | i18n | Etiqueta accesible de cada ítem. |
| `renderItem` | `(item) => ReactNode` | `PaginationItem` | Pinta cada ítem. |
| `locale` | `string` | contexto | Idioma de las etiquetas (prevalece sobre `I18nProvider`). |
| `ref` | `Ref<HTMLElement>` | — | Ref al `<nav>`. |

`className`, `style`, `aria-label` y el resto de atributos van al `<nav>`.

### Props de PaginationItem

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `type` | `'page' \| 'first' \| 'previous' \| 'next' \| 'last' \| 'start-ellipsis' \| 'end-ellipsis'` | Tipo de ítem. |
| `page` | `number \| null` | Página destino. |
| `selected` | `boolean` | Página actual (`aria-current="page"`). |
| `disabled` | `boolean` | `disabled` (botón) o `aria-disabled` (enlace). |
| `href` | `string` | Pinta un `<a>`. |
| `disableRipple` | `boolean` | Desactiva el ripple. |

### usePagination

`usePagination({ count, page, defaultPage, onChange, siblingCount, boundaryCount, showFirstButton, showLastButton, hidePrevButton, hideNextButton, disabled })` devuelve `{ items, page, count, goTo, setPage }`. La función pura `getPaginationItems(options)` (`import { getPaginationItems } from '@rubenchodev/materix-react'`) devuelve la lista sin procesar (`'previous'`, `1`, `'start-ellipsis'`…), con el tipo `PaginationItemEntry[]`.

{{< callout type="warning" title="Enlaces de router" >}}
En modo enlaces, si un `Link` de router pintado con `renderItem` cancela la navegación por su cuenta, el componente no controlado también lo detecta (vuelve a comprobar `defaultPrevented` en un microtask). Con un router, es preferible el modo controlado: deriva `page` de la URL.
{{< /callout >}}

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-pagination` | `<nav>` raíz. |
| `.mtx-pagination--text` / `--outlined` | Variante. |
| `.mtx-pagination--circular` / `--rounded` | Forma. |
| `.mtx-pagination--small` / `--medium` / `--large` | Tamaño. |
| `.mtx-pagination--color-standard` / `--color-primary` / `--color-secondary` | Color de la página seleccionada. |
| `.mtx-pagination--disabled` | Componente deshabilitado. |
| `.mtx-pagination__ul` | Lista flex con salto de línea. |
| `.mtx-pagination__item` (`--page`, `--selected`, `--nav`, `--first`, `--previous`, `--next`, `--last`) | Ítem interactivo. |
| `.mtx-pagination__icon` | Icono SVG de los botones de navegación (se refleja en RTL). |
| `.mtx-pagination__ellipsis` | Elipsis no interactiva. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-pagination-size`, `--mtx-pagination-radius`, `--mtx-pagination-padding`, `--mtx-pagination-gap`, `--mtx-pagination-font-size`, `--mtx-pagination-icon-size` | Geometría de los ítems por tamaño. |
| `--mtx-pagination-accent`, `--mtx-pagination-accent-dark`, `--mtx-pagination-accent-contrast` | Color de la página seleccionada. |
| `--mtx-pagination-outlined-border` | Borde de la variante `outlined`. |
| `--mtx-pagination-selected-mix`, `--mtx-pagination-selected-hover-mix` | Opacidad del fondo seleccionado en `outlined`. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<nav data-mtx="pagination" data-count="10" data-page="3">` | `<Pagination count={10} defaultPage={3} />` |
| `data-sibling-count`, `data-boundary-count` | `siblingCount`, `boundaryCount` |
| `data-variant`, `data-shape`, `data-size`, `data-color` | `variant`, `shape`, `size`, `color` |
| `data-show-first-button`, `data-hide-prev-button`… | `showFirstButton`, `hidePrevButton`… |
| `data-disabled` / `disable()` / `enable()` | `disabled` |
| `data-href-template="?page={page}"` | `getItemHref={(p) => '?page=' + p}` |
| setters `page` / `count`, `goTo()`, `next()`, `previous()` | props `page` / `count` (controlado) |
| `mtx:pagination:change` `{ page, previousPage, href }` (cancelable en modo enlaces) | `onChange(event, page)`; `event.preventDefault()` en modo enlaces. No se entregan `previousPage` ni `href`: conserva la página anterior en tu estado (modo controlado) y calcula la URL con tu propio `getItemHref(page)`. |
| `getPaginationItems()` | `getPaginationItems()` y `usePagination()` |

## Accesibilidad

- Landmark `<nav>` con `aria-label="pagination navigation"` (traducido con la clave i18n `pagination.label`; tu propio `aria-label` o `aria-labelledby` prevalece). Da a cada paginación de la misma página su propia etiqueta.
- Cada página es un `<button>` real (o `<a href>` en modo enlaces) con la etiqueta «Ir a la página N»; la actual lleva `aria-current="page"` y la etiqueta «página N».
- Botones de navegación: «Ir a la primera/anterior/siguiente/última página»; su icono SVG es `aria-hidden`.
- Los ítems de los extremos se deshabilitan con `disabled` (o `aria-disabled` en modo enlaces); el foco nunca se pierde.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre páginas y botones de navegación. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa el ítem enfocado (solo <kbd>Enter</kbd> en modo enlaces). |
