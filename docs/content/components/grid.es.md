---
title: "Grid"
description: "Grilla flexbox de 12 columnas con cinco breakpoints (xs–xl), separación con gap en múltiplos de 8px (también por breakpoint) y alineación, para páginas responsivas."
group: "layout"
icon: "grid_view"
weight: 10
example: "grid"
mui: "https://mui.com/material-ui/react-grid/"
---

`Grid` reparte el ancho disponible en 12 columnas y deja que cada ítem declare cuántas ocupa en cada breakpoint, igual que el `Grid` de MUI (v2: flexbox con `gap`, sin márgenes negativos). Úsalo para maquetar páginas, formularios y paneles que cambian de columnas según el ancho de pantalla. Para apilar elementos en una sola dirección con una separación fija no necesitas una grilla: usa [Stack]({{< relref "/components/stack" >}}); para centrar y limitar el ancho de la página, [Container]({{< relref "/components/container" >}}).

## Uso básico

Un contenedor `data-mtx="grid"` con `data-spacing` y, dentro, ítems `data-mtx="grid"` con el número de columnas por breakpoint (`data-xs`, `data-sm`, `data-md`, `data-lg`, `data-xl`). Un elemento con algún `data-{breakpoint}` se convierte en ítem; sin ninguno, en contenedor.

{{< mtx-demo title="Cuatro columnas en escritorio, dos en tablet, una en móvil" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=12 sm=6 md=3</div></div>
</div>
{{< /mtx-demo >}}

## Columnas

Cada ítem ocupa `n/12` del ancho: `data-xs="6"` es la mitad, `data-xs="4"` un tercio. Si la suma de una fila supera 12, los ítems pasan a la línea siguiente.

{{< mtx-demo title="Fracciones de 12" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="8"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=8</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=4</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=4</div></div>
  <div data-mtx="grid" data-xs="8"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=8</div></div>
</div>
{{< /mtx-demo >}}

## Breakpoints

Los breakpoints son *mobile-first*: un valor se aplica desde ese ancho hacia arriba hasta que otro breakpoint mayor lo sustituye. Si solo indicas `data-md="6"`, el ítem no tiene ancho fijo por debajo de 900px (se ajusta a su contenido); declara siempre `data-xs` como base.

| Breakpoint | Atributo | Ancho mínimo | Dispositivo típico |
|---|---|---|---|
| `xs` | `data-xs` | 0px | Móvil |
| `sm` | `data-sm` | 600px | Tablet vertical |
| `md` | `data-md` | 900px | Tablet horizontal y portátil pequeño |
| `lg` | `data-lg` | 1200px | Escritorio |
| `xl` | `data-xl` | 1536px | Monitor amplio |

{{< mtx-demo title="Cambia el ancho de la ventana" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">A</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">B</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">C</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">D</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">E</div></div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4" data-lg="3" data-xl="2"><div class="mtx-paper mtx-paper--outlined mtx-p-2">F</div></div>
</div>
{{< /mtx-demo >}}

## Espaciado

`data-spacing="n"` separa filas y columnas `n × 8px` con `gap` de CSS, como el Grid v2 de MUI. No hay márgenes negativos ni rellenos en los ítems, así que la grilla nunca desborda a su padre ni necesita un envoltorio con `overflow: hidden`. El ancho de cada columna descuenta su parte proporcional del gap (`100% · n/12 − gap · (12 − n)/12`), de modo que 12 columnas siempre suman el 100%.

Vale cualquier entero de `0` a `12` (`n × --mtx-spacing-unit`, 8px por defecto) y los medios pasos de la escala de utilidades `0.5`, `1.5` y `2.5` (4, 12 y 20px; también se escriben `0_5`, `1_5`, `2_5`, que es el sufijo de la clase).

{{< mtx-demo title="spacing 0, 2, 4 y 7" layout="column" >}}
<div data-mtx="grid" data-spacing="0">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">0</div></div>
</div>
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">16px</div></div>
</div>
<div data-mtx="grid" data-spacing="4">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">32px</div></div>
</div>
<div data-mtx="grid" data-spacing="7">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">56px</div></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Medios pasos: 0.5, 1.5 y 2.5" layout="column" >}}
<div data-mtx="grid" data-spacing="0.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4px</div></div>
</div>
<div data-mtx="grid" data-spacing="1.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">12px</div></div>
</div>
<div data-mtx="grid" data-spacing="2.5">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">20px</div></div>
</div>
{{< /mtx-demo >}}

### Espaciado por filas y columnas

`data-row-spacing` y `data-column-spacing` fijan cada eje por separado y sustituyen a `data-spacing` en ese eje.

{{< mtx-demo title="8px entre filas, 32px entre columnas" layout="block" >}}
<div data-mtx="grid" data-row-spacing="1" data-column-spacing="4">
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">A</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">B</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">C</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">D</div></div>
</div>
{{< /mtx-demo >}}

### Espaciado responsive

Añade `-{bp}` a cualquiera de los tres atributos (`data-spacing-md`, `data-row-spacing-lg`, `data-column-spacing-sm`…). Como las columnas, el valor rige desde ese breakpoint hacia arriba.

{{< mtx-demo title="8px en móvil, 24px desde 900px, 40px desde 1200px" layout="block" >}}
<div data-mtx="grid" data-spacing="1" data-spacing-md="3" data-spacing-lg="5">
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
  <div data-mtx="grid" data-xs="6" data-md="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">4</div></div>
</div>
{{< /mtx-demo >}}

## Auto-layout

`true` hace que el ítem crezca para repartirse el espacio sobrante a partes iguales con los demás ítems que crecen. `auto` ajusta el ítem al ancho de su contenido (`flex: 0 0 auto`), como `size="auto"` de MUI. Puedes mezclar ambos con columnas fijas.

{{< mtx-demo title="Columnas que crecen (true)" layout="column" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
</div>
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
  <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">xs=6</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true</div></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Columnas al ancho del contenido (auto)" layout="column" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="auto"><div class="mtx-paper mtx-paper--outlined mtx-p-2">auto: se ajusta al contenido</div></div>
  <div data-mtx="grid" data-xs="true"><div class="mtx-paper mtx-paper--outlined mtx-p-2">true: ocupa el resto</div></div>
  <div data-mtx="grid" data-xs="auto"><div class="mtx-paper mtx-paper--outlined mtx-p-2">auto</div></div>
</div>
{{< /mtx-demo >}}

## Alineación y dirección

En el contenedor, `data-justify` alinea en el eje principal, `data-align` en el eje cruzado y `data-direction` cambia el sentido del flujo.

{{< mtx-demo title="Centrado horizontal y vertical" layout="column" >}}
<div data-mtx="grid" data-spacing="2" data-justify="center">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">center</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">center</div></div>
</div>
<div data-mtx="grid" data-spacing="2" data-justify="space-between" data-align="center">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-1">bajo</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-4">alto</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-1">bajo</div></div>
</div>
<div data-mtx="grid" data-spacing="2" data-direction="row-reverse">
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
</div>
{{< /mtx-demo >}}

`data-justify`: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`. `data-align`: `flex-start`, `center`, `flex-end`, `stretch`, `baseline`. `data-direction`: `row`, `row-reverse`, `column`, `column-reverse`. El ajuste de línea se controla con las clases `mtx-grid--wrap-wrap`, `mtx-grid--wrap-nowrap` y `mtx-grid--wrap-reverse` (sin atributo `data-*`).

{{< callout type="info" title="Sin offsets ni orden" >}}
Materix no incluye desplazamientos (`offset`) ni orden por breakpoint. Para empujar columnas usa `data-justify` en el contenedor o un ítem vacío del ancho deseado; para invertir el orden, `data-direction="row-reverse"`.
{{< /callout >}}

## Grillas anidadas

Un ítem también puede ser contenedor: añade `data-container` junto a sus columnas y define dentro otra grilla de 12 columnas.

{{< mtx-demo title="Ítem que es a la vez contenedor" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="8" data-container data-spacing="1">
    <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">anidado 6</div></div>
    <div data-mtx="grid" data-xs="6"><div class="mtx-paper mtx-paper--outlined mtx-p-2">anidado 6</div></div>
    <div data-mtx="grid" data-xs="12"><div class="mtx-paper mtx-paper--outlined mtx-p-2">anidado 12</div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4"><div class="mtx-paper mtx-paper--outlined mtx-p-2">md=4</div></div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Panel de control: cuatro indicadores que pasan de una a cuatro columnas y, debajo, un bloque principal con barra lateral.

{{< mtx-demo title="Layout de dashboard" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Ventas</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>$ 24.300</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Pedidos</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>1.284</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Clientes</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>312</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-lg="3">
    <div data-mtx="card"><div data-mtx="card-content"><span data-mtx="typography" data-variant="overline">Conversión</span><div data-mtx="typography" data-variant="h5" data-gutter-bottom>3,4 %</div></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="8">
    <div data-mtx="card"><div data-mtx="card-content"><div data-mtx="typography" data-variant="h6" data-gutter-bottom>Actividad reciente</div><p data-mtx="typography" data-variant="body2">Bloque principal: ocupa 8 de 12 columnas desde 900px.</p></div></div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="4">
    <div data-mtx="card"><div data-mtx="card-content"><div data-mtx="typography" data-variant="h6" data-gutter-bottom>Tareas</div><p data-mtx="typography" data-variant="body2">Barra lateral: 4 columnas en escritorio, ancho completo en móvil.</p></div></div>
  </div>
</div>
{{< /mtx-demo >}}

Formulario de dos columnas que se apila en móvil:

{{< mtx-demo title="Formulario responsivo" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Nombre" data-variant="outlined" type="text"></div>
  <div data-mtx="grid" data-xs="12" data-sm="6"><input data-mtx="text-field" data-label="Apellidos" data-variant="outlined" type="text"></div>
  <div data-mtx="grid" data-xs="12" data-md="8"><input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" type="email"></div>
  <div data-mtx="grid" data-xs="12" data-md="4"><input data-mtx="text-field" data-label="Teléfono" data-variant="outlined" type="tel"></div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases funcionan sin JavaScript. El contenedor lleva `mtx-grid--container` y una clase de espaciado; cada ítem `mtx-grid--item` y una clase por breakpoint.

```html
<div class="mtx-grid mtx-grid--container mtx-grid--spacing-2 mtx-grid--justify-center">
  <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">…</div>
  <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6">…</div>
</div>
```

También se aceptan los alias `mtx-grid-container` / `mtx-grid-item` y los valores `data-mtx="grid-container"` / `data-mtx="grid-item"`.

## Uso programático

```javascript
// Recuperar el contenedor y cambiar su configuración
const grid = Materix.getInstance(document.getElementById('productos'));
grid.setSpacing(3);                 // mtx-grid--spacing-3
grid.setJustifyContent('center');   // mtx-grid--justify-center
grid.setAlignItems('stretch');      // mtx-grid--align-stretch
grid.setDirection('row-reverse');   // mtx-grid--direction-row-reverse

// Añadir un ítem dinámico
const item = document.createElement('div');
item.setAttribute('data-xs', '6');
grid.element.append(item);
Materix.init(item, 'grid');
```

Con ES modules:

```javascript
import { Grid, getInstance } from '@rubenchodev/materix-ui';
const grid = new Grid(document.getElementById('productos'));
```

{{< mtx-demo title="Espaciado y alineación por API" layout="block" >}}
<div class="mtx-mb-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="0">spacing 0</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="2">spacing 2</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-spacing="4">spacing 4</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-grid-justify="flex-end">justify flex-end</button>
</div>
<div id="doc-grid-api" data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div></div>
  <div data-mtx="grid" data-xs="3"><div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div></div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const grid = Materix.getInstance(document.getElementById('doc-grid-api'));
  document.querySelectorAll('[data-doc-grid-spacing]').forEach((btn) => {
    btn.addEventListener('click', () => grid.setSpacing(Number(btn.dataset.docGridSpacing)));
  });
  document.querySelectorAll('[data-doc-grid-justify]').forEach((btn) => {
    btn.addEventListener('click', () => grid.setJustifyContent(btn.dataset.docGridJustify));
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `grid`, `grid-container`, `grid-item` | — | Inicializa el componente. `grid-container` / `grid-item` fuerzan el rol. |
| `data-xs` · `data-sm` · `data-md` · `data-lg` · `data-xl` | `1`–`12`, `auto`, `true` | — | Columnas desde ese breakpoint. Su presencia convierte el elemento en ítem. |
| `data-container` | booleano | — | Fuerza el rol de contenedor (necesario para un ítem que también es contenedor). |
| `data-item` | booleano | — | Fuerza el rol de ítem sin indicar columnas. |
| `data-spacing` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | Separación `n × 8px` entre filas y columnas (solo contenedores). |
| `data-row-spacing` · `data-column-spacing` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | Separación de un solo eje; sustituye a `data-spacing` en ese eje. |
| `data-spacing-{bp}` · `data-row-spacing-{bp}` · `data-column-spacing-{bp}` | `0`–`12`, `0.5`, `1.5`, `2.5` | — | Igual, desde el breakpoint `bp` (`sm`, `md`, `lg`, `xl`). |
| `data-justify` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | `flex-start` | `justify-content` del contenedor. |
| `data-align` | `flex-start`, `center`, `flex-end`, `stretch`, `baseline` | `stretch` | `align-items` del contenedor. |
| `data-direction` | `row`, `row-reverse`, `column`, `column-reverse` | `row` | `flex-direction` del contenedor. |

Un elemento sin `data-{breakpoint}`, `data-item` ni `data-container` se trata como contenedor.

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-grid` | Clase base (la añade el JS). |
| `mtx-grid--container` · `mtx-grid-container` | Contenedor flex con `flex-wrap: wrap` y ancho 100%. |
| `mtx-grid--item` · `mtx-grid-item` | Ítem (`box-sizing: border-box`). |
| `mtx-grid--{bp}-{1..12}` | Ancho `n/12` desde el breakpoint `bp` (`xs`, `sm`, `md`, `lg`, `xl`). |
| `mtx-grid--{bp}-true` | Ítem que crece para repartir el espacio restante. |
| `mtx-grid--{bp}-auto` | Ítem ajustado al ancho de su contenido (`flex: 0 0 auto`). |
| `mtx-grid--spacing-{n}` | `row-gap` y `column-gap` de `n × 8px` (`0`–`12`, `0_5`, `1_5`, `2_5`). |
| `mtx-grid--row-spacing-{n}` · `mtx-grid--column-spacing-{n}` | Separación de un solo eje. |
| `mtx-grid--{bp}-spacing-{n}` · `mtx-grid--{bp}-row-spacing-{n}` · `mtx-grid--{bp}-column-spacing-{n}` | Variantes responsive (`sm`, `md`, `lg`, `xl`). |
| `mtx-grid--justify-{valor}` | `justify-content`. |
| `mtx-grid--align-{valor}` | `align-items`. |
| `mtx-grid--direction-{valor}` | `flex-direction`. |
| `mtx-grid--wrap-wrap` · `--wrap-nowrap` · `--wrap-reverse` | `flex-wrap` (solo por clase). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setSpacing(n, bp?)` | `void` | Sustituye la clase de espaciado (la del breakpoint `bp` si se indica). Solo actúa en contenedores; acepta `0`–`12` y los medios pasos `0.5`, `1.5`, `2.5`; otros valores se ignoran con un aviso. |
| `setRowSpacing(n, bp?)` · `setColumnSpacing(n, bp?)` | `void` | Igual para un solo eje. |
| `setJustifyContent(valor)` | `void` | Sustituye la clase `mtx-grid--justify-*`. |
| `setAlignItems(valor)` | `void` | Sustituye la clase `mtx-grid--align-*`. |
| `setDirection(valor)` | `void` | Sustituye la clase `mtx-grid--direction-*`. |
| `isContainer` (getter) | `boolean` | `true` si el elemento es contenedor. |
| `isItem` (getter) | `boolean` | `true` si el elemento es ítem. |

### Eventos

`Grid` no emite eventos.

### Variables CSS

| Variable | Descripción |
|---|---|
| `--mtx-spacing-unit` | Unidad de espaciado (8px). `data-spacing="n"` produce un gap de `n × --mtx-spacing-unit`. |
| `--mtx-grid-parent-column-spacing` | Interna: gap horizontal del padre, fijado en cada hijo directo para que el ancho de columna lo descuente. No la asignes a mano. |

## Accesibilidad

- La grilla es puramente visual: no añade roles ni cambia la semántica. Usa elementos con significado (`<main>`, `<section>`, `<form>`) para los bloques que maquetas.
- El orden de lectura y de tabulación sigue al HTML, no a la posición visual. Con `data-direction="row-reverse"` o `column-reverse` el orden visual se invierte pero el del teclado no: úsalos solo cuando el orden no importe.
- Comprueba que el contenido siga siendo legible a 320px de ancho (WCAG 1.4.10): define siempre `data-xs` para que las columnas se apilen en móvil.
