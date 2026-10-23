---
title: "Container"
description: "Centra el contenido de la página con un ancho máximo por breakpoint y márgenes laterales responsive (16px en móvil, 24px desde 600px)."
group: "layout"
icon: "crop_free"
weight: 30
example: "container"
mui: "https://mui.com/material-ui/react-container/"
---

`Container` es el bloque más básico de maquetación: centra horizontalmente su contenido, lo limita a un ancho máximo y añade un relleno lateral (gutter) que crece con la pantalla, igual que el `Container` de MUI. Úsalo como envoltorio de `<main>`, de secciones de una landing o de la barra de herramientas. Para repartir columnas dentro usa [Grid]({{< relref "/components/grid" >}}); para apilar bloques, [Stack]({{< relref "/components/stack" >}}).

## Uso básico

Un único elemento con `data-mtx="container"`. Sin `data-max-width`, el tope es `lg` (1200px), el valor por defecto de MUI.

{{< mtx-demo title="Contenedor predeterminado (lg)" layout="block" >}}
<div data-mtx="container" class="mtx-bg-action-selected mtx-py-2">
  <div class="mtx-bg-paper mtx-rounded mtx-p-2 mtx-text-center">Contenido centrado · máx. 1200px</div>
</div>
{{< /mtx-demo >}}

## Ancho máximo

`data-max-width` fija el tope: `xs` (444px), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px) o `false` para ocupar todo el ancho disponible.

{{< mtx-demo title="xs, sm, md y false" layout="column" >}}
<div data-mtx="container" data-max-width="xs" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">xs · 444px</div>
</div>
<div data-mtx="container" data-max-width="sm" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">sm · 600px</div>
</div>
<div data-mtx="container" data-max-width="md" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">md · 900px</div>
</div>
<div data-mtx="container" data-max-width="false" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">false · fluido</div>
</div>
{{< /mtx-demo >}}

## Fijo

Con `data-fixed` el ancho máximo salta al mínimo de cada breakpoint (600, 900, 1200 y 1536px) en vez de crecer de forma continua. Se combina con `data-max-width`: se aplica el menor de los dos.

{{< mtx-demo title="Ancho fijo por breakpoint" layout="block" >}}
<div data-mtx="container" data-fixed class="mtx-bg-action-selected mtx-py-2">
  <div class="mtx-bg-paper mtx-rounded mtx-p-2 mtx-text-center">data-fixed · cambia el ancho de la ventana</div>
</div>
{{< /mtx-demo >}}

## Gutters

Por defecto el contenedor tiene 16px de relleno lateral en móvil y 24px desde 600px. `data-disable-gutters` lo elimina, por ejemplo para pegar una imagen o una tabla a los bordes.

{{< mtx-demo title="Con y sin gutters" layout="column" >}}
<div data-mtx="container" data-max-width="sm" class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">Con gutters</div>
</div>
<div data-mtx="container" data-max-width="sm" data-disable-gutters class="mtx-bg-action-selected mtx-py-1">
  <div class="mtx-bg-paper mtx-rounded mtx-p-1 mtx-text-center">data-disable-gutters</div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Página de artículo: cabecera a todo el ancho con el título en un contenedor `md` y el cuerpo de lectura en `sm` para mantener una longitud de línea cómoda.

{{< mtx-demo title="Artículo" layout="block" >}}
<header class="mtx-bg-primary mtx-py-4">
  <div data-mtx="container" data-max-width="md">
    <h2 class="mtx-typography--h5 mtx-mt-0 mtx-color-inherit">Novedades de la versión 0.1</h2>
    <p class="mtx-typography--body2">Utilidades de layout, Container y Stack.</p>
  </div>
</header>
<article data-mtx="container" data-max-width="sm" class="mtx-py-3">
  <p class="mtx-typography--body1 mtx-mb-2">Materix incorpora utilidades mobile-first para maquetar sin CSS propio. Container centra el contenido y Stack apila bloques con separación uniforme.</p>
  <div data-mtx="stack" data-direction="row" data-spacing="1">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Leer más</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" type="button">Compartir</button>
  </div>
</article>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases funcionan sin JavaScript:

```html
<main class="mtx-container mtx-container--md mtx-container--fixed">…</main>
<section class="mtx-container mtx-container--fluid mtx-container--disable-gutters">…</section>
```

## Uso programático

```javascript
const container = Materix.getInstance(document.querySelector('main'));
container.setMaxWidth('md');   // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
container.setFixed(true);
container.setGutters(false);   // equivale a data-disable-gutters

// Elementos añadidos dinámicamente
Materix.init(nuevoElemento, 'container');
```

Con ES modules:

```javascript
import { Container } from 'materix-ui';
const container = new Container(document.querySelector('main'));
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `container` | — | Inicializa el componente. |
| `data-max-width` | `xs`, `sm`, `md`, `lg`, `xl`, `false` | `lg` | Ancho máximo: 444, 600, 900, 1200, 1536px o sin límite. Un valor no válido se ignora con un aviso. |
| `data-fixed` | booleano | — | El ancho máximo coincide con el mínimo del breakpoint activo. |
| `data-disable-gutters` | booleano | — | Elimina el relleno lateral. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-container` | Bloque centrado (`margin-inline: auto`), ancho 100%, tope `lg` y gutters de 16px / 24px (≥ 600px). |
| `mtx-container--xs` · `--sm` · `--md` · `--lg` · `--xl` | Tope de 444, 600, 900, 1200 o 1536px. |
| `mtx-container--fluid` | Sin tope (`data-max-width="false"`). |
| `mtx-container--fixed` | Tope igual al min-width del breakpoint activo. |
| `mtx-container--disable-gutters` | Sin relleno lateral. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setMaxWidth(valor)` | `void` | Sustituye el tope. Lanza `RangeError` si el valor no es válido. |
| `setFixed(bool)` | `void` | Activa o desactiva el ancho fijo. |
| `setGutters(bool)` | `void` | `false` elimina el relleno lateral. |

### Eventos

`Container` no emite eventos.

### Variables CSS

| Variable | Descripción |
|---|---|
| `--mtx-container-max` | Tope de ancho actual (lo fijan las clases `--xs`…`--fluid`). Puedes sobrescribirlo, p. ej. `--mtx-container-max: 720px`. |
| `--mtx-container-fixed` | Tope por breakpoint de `--fixed` (100% si no aplica). |
| `--mtx-spacing-2` · `--mtx-spacing-3` | Gutters en móvil y desde 600px. |

## Accesibilidad

- Container es puramente visual: no añade roles. Ponlo sobre el elemento semántico adecuado (`<main>`, `<header>`, `<section>`, `<footer>`) en lugar de añadir un `<div>` extra.
- Los gutters evitan que el texto toque los bordes de la pantalla en móvil; no los desactives en bloques de texto.
- Limitar el ancho de lectura (`sm` o `md`) mejora la legibilidad: líneas de 60–80 caracteres.
