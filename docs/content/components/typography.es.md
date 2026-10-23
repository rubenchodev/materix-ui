---
title: "Typography"
description: "Aplica la escala tipográfica de MUI (h1 a overline) a cualquier elemento, separando la semántica HTML del estilo visual."
group: "data-display"
icon: "text_fields"
weight: 70
example: "typography"
mui: "https://mui.com/material-ui/react-typography/"
---

`Typography` aplica los estilos de texto de MUI (encabezados, subtítulos, cuerpo, botón, caption y overline) con la fuente Roboto y los tokens del tema. Úsalo para que todos los textos de la interfaz compartan una misma escala. No lo necesitas para textos que ya estiliza su componente (botones, campos, listas…).

## Uso básico

Añade `data-mtx="typography"` a un encabezado: `<h1>`–`<h6>` toman automáticamente su variante. En cualquier otra etiqueta, indica la variante con `data-variant`.

{{< mtx-demo title="Encabezado y párrafo" layout="block" >}}
<h4 data-mtx="typography" data-gutter-bottom>Informe mensual</h4>
<p data-mtx="typography" data-variant="body1">Las ventas crecieron un 12% respecto al mes anterior, impulsadas por el canal en línea.</p>
{{< /mtx-demo >}}

## Escala tipográfica

Las 13 variantes de MUI. Los tamaños se expresan en `rem` (base 16px).

{{< mtx-demo title="Encabezados" layout="block" >}}
<h1 data-mtx="typography">h1. Título</h1>
<h2 data-mtx="typography">h2. Título</h2>
<h3 data-mtx="typography">h3. Título</h3>
<h4 data-mtx="typography">h4. Título</h4>
<h5 data-mtx="typography">h5. Título</h5>
<h6 data-mtx="typography">h6. Título</h6>
{{< /mtx-demo >}}

{{< mtx-demo title="Subtítulos, cuerpo y estilos auxiliares" layout="block" >}}
<p data-mtx="typography" data-variant="subtitle1">subtitle1. Texto de apoyo para títulos y secciones.</p>
<p data-mtx="typography" data-variant="subtitle2">subtitle2. Texto de apoyo compacto con más peso.</p>
<p data-mtx="typography" data-variant="body1">body1. Texto principal de la aplicación, pensado para lectura continua.</p>
<p data-mtx="typography" data-variant="body2">body2. Texto secundario para descripciones, notas y metadatos.</p>
<span data-mtx="typography" data-variant="button">button. Texto de botón</span>
<p data-mtx="typography" data-variant="caption">caption. Pie de foto o texto de ayuda.</p>
<p data-mtx="typography" data-variant="overline">overline. Categoría o etiqueta superior</p>
{{< /mtx-demo >}}

| Variante | Tamaño | Peso | Interlineado | Notas |
|---|---|---|---|---|
| `h1` | 6rem (96px) | 300 | 1.167 | letter-spacing −0.01562em |
| `h2` | 3.75rem (60px) | 300 | 1.2 | letter-spacing −0.00833em |
| `h3` | 3rem (48px) | 400 | 1.167 | |
| `h4` | 2.125rem (34px) | 400 | 1.235 | letter-spacing 0.00735em |
| `h5` | 1.5rem (24px) | 400 | 1.334 | |
| `h6` | 1.25rem (20px) | 500 | 1.6 | |
| `subtitle1` | 1rem (16px) | 400 | 1.75 | |
| `subtitle2` | 0.875rem (14px) | 500 | 1.57 | |
| `body1` | 1rem (16px) | 400 | 1.5 | |
| `body2` | 0.875rem (14px) | 400 | 1.43 | |
| `button` | 0.875rem (14px) | 500 | 1.75 | mayúsculas |
| `caption` | 0.75rem (12px) | 400 | 1.66 | |
| `overline` | 0.75rem (12px) | 400 | 2.66 | mayúsculas |

Como en MUI, ninguna variante tiene márgenes (tampoco `h1`–`h6`): añade `data-gutter-bottom` (`0.35em`) o `data-paragraph` (16px) cuando necesites separación, o usa las utilidades de espaciado.

## Semántica frente a estilo

La etiqueta define la estructura del documento y `data-variant` define el aspecto. Así puedes mantener una jerarquía de encabezados correcta sin depender del tamaño visual.

{{< mtx-demo title="h2 con aspecto de h5" layout="block" >}}
<h2 data-mtx="typography" data-variant="h5" data-gutter-bottom>Sección principal (h2 semántico, estilo h5)</h2>
<h3 data-mtx="typography" data-variant="subtitle1">Subsección (h3 semántico, estilo subtitle1)</h3>
<p data-mtx="typography" data-variant="body2">Contenido de la subsección.</p>
{{< /mtx-demo >}}

## Colores

`data-color` acepta los colores de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`), los de texto (`text-primary`, `text-secondary`, `text-disabled` o `disabled`) e `inherit`.

{{< mtx-demo title="Color de paleta y de texto" layout="block" >}}
<p data-mtx="typography" data-variant="body1" data-color="primary">Primary</p>
<p data-mtx="typography" data-variant="body1" data-color="secondary">Secondary</p>
<p data-mtx="typography" data-variant="body1" data-color="text-secondary">Texto secundario</p>
<p data-mtx="typography" data-variant="body1" data-color="disabled" aria-disabled="true">Texto deshabilitado</p>
<p data-mtx="typography" data-variant="body1" data-color="error">Error</p>
<p data-mtx="typography" data-variant="body1" data-color="warning">Warning</p>
<p data-mtx="typography" data-variant="body1" data-color="info">Info</p>
<p data-mtx="typography" data-variant="body1" data-color="success">Success</p>
{{< /mtx-demo >}}

## Alineación

`data-align` acepta `left`, `center`, `right` y `justify`.

{{< mtx-demo title="Alineación" layout="block" >}}
<p data-mtx="typography" data-variant="body1" data-align="left">Alineado a la izquierda</p>
<p data-mtx="typography" data-variant="body1" data-align="center">Centrado</p>
<p data-mtx="typography" data-variant="body1" data-align="right">Alineado a la derecha</p>
{{< /mtx-demo >}}

## Márgenes y truncado

`data-gutter-bottom` añade `0.35em` de margen inferior a cualquier variante; `data-paragraph` (clase `mtx-typography--paragraph`) añade 16px. `data-no-wrap` mantiene el texto en una línea y lo trunca con puntos suspensivos según el ancho del contenedor.

{{< mtx-demo title="gutterBottom, paragraph y noWrap" layout="block" >}}
<p data-mtx="typography" data-variant="subtitle2" data-gutter-bottom>Con data-gutter-bottom</p>
<p data-mtx="typography" data-variant="body2" data-paragraph>Párrafo con margen inferior de 16px (data-paragraph).</p>
<p data-mtx="typography" data-variant="body1" data-no-wrap>Texto muy largo que no cabe en una sola línea y se trunca con puntos suspensivos en lugar de saltar a la siguiente línea, sin importar el ancho de la pantalla.</p>
{{< /mtx-demo >}}

## Tipografía responsive

Dos mecanismos, combinables con la sintaxis simplificada o como clase pura:

- **Variante por breakpoint** (mobile-first, mismos breakpoints que Grid: sm 600px, md 900px, lg 1200px, xl 1536px): `data-variant-{sm|md|lg|xl}="h3"` o la clase `mtx-typography--{bp}-{variante}`. La variante base rige en móvil y cada breakpoint la sustituye hacia arriba.
- **Escala fluida** (equivalente a `responsiveFontSizes` de MUI): `data-responsive` o la clase `mtx-typography--responsive`. h1–h6 escalan con `clamp()` entre su tamaño móvil (≤600px) y el de escritorio (≥1200px): h1 3.5→6rem, h2 2.375→3.75rem, h3 2→3rem, h4 1.5625→2.125rem, h5 1.25→1.5rem, h6 1.125→1.25rem. La clase redefine los tokens `--mtx-type-h1…h6`, así que funciona en el propio elemento o en cualquier ancestro (`<html class="mtx-typography--responsive">` la aplica a toda la página, incluidos los componentes que usan esos tokens).

{{< mtx-demo title="Variante por breakpoint" layout="column" >}}
<h2 data-mtx="typography" data-variant="h5" data-variant-md="h4" data-variant-lg="h3">h5 en móvil, h4 desde 900px, h3 desde 1200px</h2>
<p class="mtx-typography--body2 mtx-typography--md-body1">body2 en móvil y body1 desde 900px (clase pura)</p>
{{< /mtx-demo >}}

{{< mtx-demo title="Escala fluida" layout="column" >}}
<h1 data-mtx="typography" data-variant="h2" data-responsive>Titular fluido</h1>
<h2 data-mtx="typography" data-variant="h4" data-responsive>Subtítulo fluido</h2>
{{< /mtx-demo >}}

## Casos de uso reales

Cabecera de una tarjeta de artículo con overline, título, metadatos y extracto.

{{< mtx-demo title="Cabecera de artículo" layout="block" >}}
<span data-mtx="typography" data-variant="overline" data-color="primary">Guía</span>
<h3 data-mtx="typography" data-variant="h5" data-gutter-bottom>Cómo preparar un presupuesto trimestral</h3>
<p data-mtx="typography" data-variant="caption" data-color="text-secondary" data-gutter-bottom>Por Ana García · 6 min de lectura</p>
<p data-mtx="typography" data-variant="body2">Repasamos los pasos para estimar ingresos y gastos, fijar márgenes de seguridad y revisar el presupuesto cada mes.</p>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases funcionan sin JavaScript.

```html
<h2 class="mtx-typography mtx-typography--h4 mtx-typography--color-primary">Título</h2>
<p class="mtx-typography mtx-typography--body2 mtx-typography--text-secondary mtx-typography--align-center">
  Texto secundario centrado
</p>
<p class="mtx-typography mtx-typography--body1 mtx-typography--no-wrap">Texto truncado…</p>
```

## Uso programático

Typography no tiene métodos ni eventos; solo hay que inicializar los elementos creados dinámicamente.

```javascript
const title = document.createElement('h2');
title.setAttribute('data-variant', 'h5');
title.textContent = 'Nueva sección';
container.append(title);

Materix.init(title, 'typography');   // o new Materix.Typography(title)
Materix.initAll(container);          // todo lo que haya en un contenedor
```

Con ES modules:

```javascript
import { Typography } from '@rubenchodev/materix-ui';
new Typography(document.querySelector('#title'));
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-variant` | `h1`–`h6`, `subtitle1`, `subtitle2`, `body1`, `body2`, `button`, `caption`, `overline` | la etiqueta si es `h1`–`h6`; si no, ninguna | Estilo tipográfico. Tiene prioridad sobre la etiqueta. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `text-primary`, `text-secondary`, `text-disabled`, `disabled`, `inherit` | color de texto principal | Añade `mtx-typography--color-{color}`. |
| `data-align` | `left`, `center`, `right`, `justify` | heredada | Alineación del texto. |
| `data-gutter-bottom` | Booleano (presencia) | ausente | Margen inferior de `0.35em`. |
| `data-no-wrap` | Booleano (presencia) | ausente | Una línea con elipsis. |
| `data-paragraph` | Booleano (presencia) | ausente | Margen inferior de 16px (`mtx-typography--paragraph`). |
| `data-variant-{sm,md,lg,xl}` | Variante | — | Variante desde ese breakpoint (`mtx-typography--{bp}-{variante}`). |
| `data-responsive` | Booleano (presencia; `"false"` lo ignora) | ausente | Escala fluida de h1–h6 (`mtx-typography--responsive`). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-typography` | Base: sin márgenes, fuente del tema, color de texto principal. |
| `mtx-typography--h1` … `--overline` | Una clase por variante, sin márgenes. Funcionan como clase pura, sin `.mtx-typography` ni JavaScript. |
| `mtx-typography--color-{color}` | Los aplica `data-color`: `primary`, `secondary`, `error`, `warning`, `info`, `success`, `text-primary`, `text-secondary`, `text-disabled`, `disabled`, `inherit`. |
| `mtx-typography--text-primary` / `--text-secondary` / `--disabled` | Colores de texto. `--primary` y `--secondary` son alias de los colores de texto principal y secundario. |
| `mtx-typography--error` / `--warning` / `--info` / `--success` | Colores de estado. |
| `mtx-typography--align-left` / `-center` / `-right` / `-justify` | Alineación (alias sin `align-`: `--left`, `--center`…). |
| `mtx-typography--gutter-bottom` | Margen inferior de `0.35em`. |
| `mtx-typography--paragraph` | Margen inferior de 16px. |
| `mtx-typography--{sm,md,lg,xl}-{variante}` | Variante desde ese breakpoint (mobile-first). |
| `mtx-typography--responsive` | Escala fluida de h1–h6 con `clamp()`; en el elemento o en un ancestro. |
| `mtx-typography--no-wrap` | Truncado con elipsis. |

### Métodos

Typography no expone métodos propios.

### Eventos

Typography no emite eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-font-family` | Familia tipográfica (Roboto). |
| `--mtx-type-h1` … `--mtx-type-overline` | Atajo `font` (peso, tamaño, interlineado y familia) de cada variante. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` / `--mtx-color-text-disabled` | Colores de texto. |
| `--mtx-color-primary`, `--mtx-color-secondary`, `--mtx-color-error`, `--mtx-color-warning`, `--mtx-color-info`, `--mtx-color-success` | Colores de paleta y estado. |

## Accesibilidad

- Elige la etiqueta por su función (`<h1>`–`<h6>` para la jerarquía, `<p>` para párrafos) y la variante por su aspecto: los lectores de pantalla navegan por la etiqueta, no por el tamaño.
- No te saltes niveles de encabezado para conseguir un tamaño: usa `data-variant`.
- Los colores de estado y `disabled` no deben ser la única forma de transmitir información; acompáñalos de texto.
- El texto truncado con `data-no-wrap` queda oculto visualmente: si es importante, ofrécelo completo en otro lugar (por ejemplo, en un `title` o en el detalle).
