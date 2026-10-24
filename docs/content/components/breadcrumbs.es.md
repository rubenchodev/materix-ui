---
title: "Breadcrumbs"
description: "Ruta de navegación jerárquica que muestra dónde está el usuario y le permite volver a cualquier nivel superior."
group: "navigation"
icon: "more_horiz"
weight: 5
example: "breadcrumbs"
import: "Breadcrumbs, Link"
mui: "https://mui.com/material-ui/react-breadcrumbs/"
---

`Breadcrumbs` pinta la ruta desde la raíz del sitio o la app hasta la página actual, como el `Breadcrumbs` de MUI: un `<nav>` con una lista ordenada, separadores ocultos a las tecnologías de asistencia y el último ítem marcado con `aria-current="page"`. Úsalo en jerarquías de tres o más niveles (catálogos, documentación, gestores de archivos). No lo uses como navegación principal ni para flujos lineales.

## Importación

```tsx
import { Breadcrumbs, Link } from '@rubenchodev/materix-react';
```

## Uso básico

Pasa [Links](../link/) y la página actual como hijos. Cada hijo va en un `<li>`, los enlaces reciben `color="inherit"` y subrayado en hover (salvo que fijen los suyos), el texto suelto pasa a ser un `<span class="mtx-breadcrumbs__text">` y el último ítem se marca como página actual. Los hijos `<a>` y `<button>` nativos se convierten en Link.

{{< react-demo "breadcrumbs/01-basic" >}}

## Página actual como enlace

Si el último ítem debe seguir siendo un enlace, pon tú mismo `aria-current="page"`: el componente lo respeta y no marca ningún otro ítem.

{{< react-demo "breadcrumbs/02-current-link" >}}

## Separadores

`separator` acepta cualquier texto (por defecto `/`), cualquier nodo o el nombre de un icono Material: un string de minúsculas, dígitos y guiones bajos, de tres o más caracteres (`navigate_next`, `chevron_right`), se pinta como icono.

{{< react-demo id="breadcrumbs/03-separators" layout="block" >}}

## Con iconos

`data-icon` en un hijo (o `icon` en `items`) añade un icono Material decorativo antes del texto. Como en MUI, el icono queda fuera del flujo del texto: en hover solo se subraya la etiqueta.

{{< react-demo id="breadcrumbs/04-icons" layout="block" >}}

## Ruta colapsada

Cuando hay más ítems que `maxItems` (8 por defecto), solo se muestran `itemsBeforeCollapse` (1) e `itemsAfterCollapse` (1), separados por un botón "Mostrar ruta". Al activarlo se revelan los ítems ocultos, el foco pasa al primero y se llama a `onExpand`. La ruta vuelve a colapsarse cuando cambian sus ítems.

{{< react-demo id="breadcrumbs/05-collapsed" layout="block" >}}

## Tipografía

Como MUI, usa `body1` en `text.secondary` y la página actual en `text.primary`. Para una ruta más compacta, usa `variant="body2"` (añade la clase de Typography `mtx-typography--body2`).

{{< react-demo id="breadcrumbs/06-typography" layout="block" >}}

## Estados

Los enlaces mantienen los estados de Link (subrayado en hover, anillo de foco con <kbd>Tab</kbd>). Un enlace de la ruta puede deshabilitarse con `disabled`, y su propio `color` lo cambia.

{{< react-demo id="breadcrumbs/07-states" layout="block" >}}

## Desde una lista de ítems

`items` describe la ruta como datos (`{ label, href?, icon?, current?, disabled?, data? }`), equivalente a `setItems()` de vanilla. Los ítems con `href` son Link; la página actual (la última, salvo que un ítem indique `current`) es texto; el resto, Link sobre un `<button>`. `data` se convierte en atributos `data-*`.

{{< react-demo id="breadcrumbs/08-items" layout="block" >}}

## Ejemplo real

Cabecera de página de un panel de administración: ruta, título y acción principal.

{{< react-demo id="breadcrumbs/09-use-cases" layout="block" >}}

## Maquetación en grilla

La lista se ajusta en varias líneas dentro de su columna.

{{< react-demo id="breadcrumbs/10-grid" layout="block" >}}

## Uso programático

`onNavigate(event, detail)` se dispara al activar un enlace o botón de la ruta, con `{ index, href, label, current, item }`. Devuelve `false` o llama a `event.preventDefault()` para cancelar la navegación nativa y gestionarla tú (routers SPA, navegación de carpetas).

{{< react-demo id="breadcrumbs/11-programmatic" layout="block" >}}

```tsx
<Breadcrumbs
  items={folders.map((name, index) => ({ label: name, data: { depth: index } }))}
  onNavigate={(event, detail) => {
    event.preventDefault();
    openFolder(detail.index);
  }}
/>
```

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | — | Links, `<a>`, `<button>`, texto u otros elementos; `data-icon` añade un icono. |
| `items` | `BreadcrumbItem[]` | — | Ruta como datos; prevalece sobre `children`. |
| `separator` | `ReactNode` | `'/'` | Texto, nodo o nombre de icono Material. |
| `maxItems` | `number` | `8` | Máximo de ítems visibles antes de colapsar; `0` desactiva el colapso. |
| `itemsBeforeCollapse` | `number` | `1` | Ítems antes del botón de colapso. |
| `itemsAfterCollapse` | `number` | `1` | Ítems después del botón de colapso. |
| `expandText` | `string` | i18n `breadcrumbs.showPath` | Etiqueta accesible del botón de colapso. |
| `expanded` | `boolean` | — | Ruta expandida (controlado). |
| `onExpand` | `() => void` | — | Se revelan los ítems colapsados. |
| `onNavigate` | `(event, detail) => boolean \| void` | — | Se activa un ítem; `false` o `preventDefault()` cancelan la navegación. |
| `variant` | `TypographyVariant` | `'body1'` | Escala tipográfica de la ruta (`body2` para una compacta). |
| `locale` | `string` | proveedor | Idioma de los textos propios. |
| `aria-label` | `string` | i18n `breadcrumbs.label` | Nombre del landmark `<nav>` (también se respeta `aria-labelledby`). |

El resto de props va al `<nav>` raíz; `ref` apunta a él.

`BreadcrumbItem`: `{ label: ReactNode; href?: string; icon?: ReactNode; current?: boolean; disabled?: boolean; data?: Record<string, string | number | boolean>; key?: string | number }`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-breadcrumbs` | `<nav>` raíz: `body1` en `text.secondary` (especificidad cero, para que `mtx-typography--*` pueda cambiarla). |
| `mtx-breadcrumbs--collapsed` | Mientras hay ítems ocultos. |
| `mtx-breadcrumbs__ol` · `__li` | Lista flex con salto de línea · ítem. |
| `mtx-breadcrumbs__link` · `__text` | Enlace del ítem (un Link de Materix) · ítem sin enlace. |
| `mtx-breadcrumbs__item--with-icon` · `__icon` | Ítem con icono · icono decorativo de 24px fuera del flujo del texto. |
| `mtx-breadcrumbs__separator` | Separador `<li aria-hidden="true">` con margen horizontal de 8px. |
| `mtx-breadcrumbs__collapsed` · `__collapse-button` | `<li>` del colapso · botón "Mostrar ruta" (MoreHoriz 24×16). |

Variables CSS: `--mtx-breadcrumbs-separator-gap`, `--mtx-breadcrumbs-collapse-bg`, `--mtx-breadcrumbs-collapse-bg-hover` y `--mtx-breadcrumbs-collapse-color`.

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `<ol data-mtx="breadcrumbs">` con `<li><a>` | `<Breadcrumbs>` con hijos `<Link>` / `<a>` |
| `data-separator` · `data-max-items` | `separator` · `maxItems` |
| `data-items-before-collapse` · `data-items-after-collapse` | `itemsBeforeCollapse` · `itemsAfterCollapse` |
| `data-expand-label` | `expandText` |
| `class="mtx-typography--body2"` | `variant="body2"` |
| `data-icon` en `<a>` / `<span>` | `data-icon` en el hijo · `icon` en `items` |
| `setItems(items)` · `getItems()` | prop `items` (tu propio estado) |
| `expand()` · `collapse()` · `expanded` | botón de colapso · prop `expanded` |
| `mtx:breadcrumbs:expand` | `onExpand()` |
| `mtx:breadcrumbs:navigate` (cancelable) | `onNavigate(event, detail)` (devolver `false` o `preventDefault()`) |

## Accesibilidad

- Landmark `<nav>` con `aria-label="breadcrumb"` (traducido con i18n `breadcrumbs.label`; se conserva tu propio `aria-label` o `aria-labelledby`).
- Lista ordenada (`<ol>`): los lectores de pantalla anuncian el número de niveles.
- Los separadores son `<li aria-hidden="true">` y no se leen.
- La página actual tiene `aria-current="page"`.
- El botón de colapso es un `<button>` real con la etiqueta traducida "Mostrar ruta"; tras expandir, el foco pasa al primer ítem revelado para no perderse.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los enlaces de la ruta y el botón de colapso. |
| <kbd>Enter</kbd> | Sigue el enlace o expande la ruta. |
| <kbd>Espacio</kbd> | Expande la ruta (botón de colapso) o activa un ítem pintado como botón. |
