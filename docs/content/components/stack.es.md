---
title: "Stack"
description: "Apila elementos en una dirección (columna o fila) con una separación uniforme, alineación, ajuste de línea, divisores y cambios por breakpoint."
group: "layout"
icon: "view_agenda"
weight: 40
example: "stack"
mui: "https://mui.com/material-ui/react-stack/"
---

`Stack` coloca sus hijos uno tras otro en una sola dirección y los separa con `gap`, como el `Stack` de MUI. Úsalo para formularios, barras de acciones, listas de tarjetas o cualquier bloque que se apile en móvil y se ponga en fila en escritorio. Cuando el contenido necesita columnas que se alinean entre filas usa [Grid]({{< relref "/components/grid" >}}); para utilidades sueltas de flex, consulta la [guía de utilidades]({{< relref "/guide/utilities" >}}).

## Uso básico

Un único elemento `data-mtx="stack"`. La dirección por defecto es columna (como MUI) y `data-spacing` fija la separación en múltiplos de 8px.

{{< mtx-demo title="Columna con 16px de separación" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Elemento 1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Elemento 2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Elemento 3</div>
</div>
{{< /mtx-demo >}}

## Dirección

`data-direction`: `column` (predeterminado), `row`, `column-reverse` o `row-reverse`.

{{< mtx-demo title="row y row-reverse" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
<div data-mtx="stack" data-direction="row-reverse" data-spacing="1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
{{< /mtx-demo >}}

## Espaciado

Escala `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10` (× 8px). Los decimales también se escriben con guion bajo en las clases (`mtx-stack--spacing-1_5`).

{{< mtx-demo title="0.5, 2 y 4" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="0.5">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">4px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">4px</div>
</div>
<div data-mtx="stack" data-direction="row" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">16px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">16px</div>
</div>
<div data-mtx="stack" data-direction="row" data-spacing="4">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">32px</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">32px</div>
</div>
{{< /mtx-demo >}}

## Responsive

`data-direction-{bp}` y `data-spacing-{bp}` (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) cambian la dirección y la separación desde ese ancho, mobile-first.

{{< mtx-demo title="Columna en móvil, fila desde 600px" layout="block" >}}
<div data-mtx="stack" data-spacing="1" data-direction-sm="row" data-spacing-sm="2" data-spacing-md="4">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Uno</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Dos</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">Tres</div>
</div>
{{< /mtx-demo >}}

## Alineación

`data-align` alinea en el eje cruzado (`start`, `center`, `end`, `stretch`, `baseline`) y `data-justify` distribuye en el principal (`start`, `center`, `end`, `between`, `around`, `evenly`). También acepta los valores CSS (`flex-start`, `space-between`…).

{{< mtx-demo title="center + between" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-align="center" data-justify="between" class="mtx-border mtx-rounded mtx-p-1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">bajo</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-4">alto</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-1">bajo</div>
</div>
{{< /mtx-demo >}}

## Divisores

`data-divider` inserta un `Divider` entre cada par de hijos: horizontal en columna, vertical en fila (también al cambiar de dirección por breakpoint).

{{< mtx-demo title="Fila con divisores" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="2" data-divider>
  <span class="mtx-typography--body2">Bandeja</span>
  <span class="mtx-typography--body2">Enviados</span>
  <span class="mtx-typography--body2">Spam</span>
</div>
{{< /mtx-demo >}}

## Wrap

`data-wrap` permite que los hijos pasen a la línea siguiente; el gap separa también las líneas.

{{< mtx-demo title="Chips con wrap" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1" data-wrap>
  <div data-mtx="chip" data-label="JavaScript"></div>
  <div data-mtx="chip" data-label="CSS"></div>
  <div data-mtx="chip" data-label="Accesibilidad"></div>
  <div data-mtx="chip" data-label="Material UI"></div>
  <div data-mtx="chip" data-label="Design tokens"></div>
  <div data-mtx="chip" data-label="Vanilla"></div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Formulario con acciones alineadas a la derecha y tarjeta de perfil, solo con Stack, utilidades y componentes.

{{< mtx-demo title="Formulario y perfil" layout="block" >}}
<div data-mtx="stack" data-spacing="3" data-direction-md="row">
  <form data-mtx="stack" data-spacing="2" class="mtx-flex-1">
    <input data-mtx="text-field" data-label="Nombre" data-variant="outlined" type="text">
    <input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" type="email">
    <div data-mtx="stack" data-direction="row" data-spacing="1" data-justify="end">
      <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Cancelar</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Guardar</button>
    </div>
  </form>
  <div data-mtx="stack" data-direction="row" data-spacing="2" data-align="center" class="mtx-flex-1 mtx-mw-100 mtx-align-self-md-start mtx-paper mtx-paper--outlined mtx-p-2">
    <div data-mtx="avatar">LH</div>
    <div data-mtx="stack" class="mtx-flex-1 mtx-min-w-0">
      <span class="mtx-typography--subtitle1 mtx-text-truncate">Lucía Herrera</span>
      <span class="mtx-typography--body2 mtx-color-text-secondary mtx-text-truncate">Diseñadora de producto · Madrid</span>
    </div>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button">Seguir</button>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases funcionan sin JavaScript. Los divisores automáticos necesitan JS; sin él, escríbelos a mano:

```html
<div class="mtx-stack mtx-stack--column mtx-stack--sm-row mtx-stack--spacing-1 mtx-stack--sm-spacing-3 mtx-stack--align-center">
  <div>…</div>
  <hr class="mtx-divider mtx-stack__divider" aria-hidden="true">
  <div>…</div>
</div>
```

## Uso programático

```javascript
const stack = Materix.getInstance(document.getElementById('acciones'));
stack.setDirection('column');
stack.setDirection('row', 'md');   // desde 900px
stack.setSpacing(1.5);
stack.setAlign('center');
stack.setJustify('between');
stack.setWrap(true);
stack.setDivider(true);

// Tras añadir o quitar hijos, regenera los divisores
stack.element.append(nuevoHijo);
stack.refresh();
```

Con ES modules:

```javascript
import { Stack } from '@rubenchodev/materix-ui';
const stack = new Stack(document.getElementById('acciones'));
```

{{< mtx-demo title="Dirección y divisores por API" layout="block" >}}
<div data-mtx="stack" data-direction="row" data-spacing="1" class="mtx-mb-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-stack="direction">Alternar dirección</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-stack="divider">Alternar divisores</button>
</div>
<div id="doc-stack-api" data-mtx="stack" data-direction="row" data-spacing="2">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">1</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">2</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2">3</div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const stack = Materix.getInstance(document.getElementById('doc-stack-api'));
  let row = true;
  let divider = false;
  document.querySelector('[data-doc-stack="direction"]').addEventListener('click', () => {
    row = !row;
    stack.setDirection(row ? 'row' : 'column');
  });
  document.querySelector('[data-doc-stack="divider"]').addEventListener('click', () => {
    divider = !divider;
    stack.setDivider(divider);
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `stack` | — | Inicializa el componente. |
| `data-direction` | `column`, `row`, `column-reverse`, `row-reverse` | `column` | Dirección del flujo. |
| `data-direction-{bp}` | ídem | — | Dirección desde el breakpoint `sm`, `md`, `lg` o `xl`. |
| `data-spacing` | `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10` | — | Separación `n × 8px` con `gap`. |
| `data-spacing-{bp}` | ídem | — | Separación desde el breakpoint. |
| `data-align` | `start`, `center`, `end`, `stretch`, `baseline` | `stretch` | `align-items`. |
| `data-justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | `start` | `justify-content`. |
| `data-wrap` | booleano | — | `flex-wrap: wrap`. |
| `data-divider` | booleano | — | Inserta un divisor entre cada par de hijos. |

Los valores no válidos de `data-direction` y `data-spacing` se ignoran con un aviso en consola.

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-stack` | Flex en columna (`min-width: 0`). |
| `mtx-stack--{row,column,row-reverse,column-reverse}` | Dirección. `mtx-stack--col` se mantiene como alias de `column`. |
| `mtx-stack--{bp}-{dirección}` | Dirección desde `sm`, `md`, `lg` o `xl`. |
| `mtx-stack--spacing-{n}` · `mtx-stack--{bp}-spacing-{n}` | Separación (`n` = `0`, `0_5`, `1`, `1_5`, `2`, `2_5`, `3`, `4`, `5`, `6`, `8`, `10`). |
| `mtx-stack--align-{start,center,end,stretch,baseline}` | `align-items`. |
| `mtx-stack--justify-{start,center,end,between,around,evenly}` | `justify-content`. |
| `mtx-stack--wrap` | Ajuste de línea. |
| `mtx-stack__divider` | Divisor entre hijos: horizontal en columna, vertical en fila. |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setDirection(dir, bp?)` | `void` | Sustituye la dirección (de `bp` si se indica). Lanza `RangeError` si no es válida. |
| `setSpacing(n, bp?)` | `void` | Sustituye la separación. Lanza `RangeError` fuera de la escala. |
| `setAlign(valor)` | `void` | Sustituye la alineación; un valor desconocido la elimina. |
| `setJustify(valor)` | `void` | Sustituye la distribución; un valor desconocido la elimina. |
| `setWrap(bool)` | `void` | Activa o desactiva el wrap. |
| `setDivider(bool)` | `void` | Activa o desactiva los divisores y los regenera. |
| `refresh()` | `void` | Regenera los divisores tras cambiar los hijos (idempotente). |

### Eventos

`Stack` no emite eventos.

### Variables CSS

| Variable | Descripción |
|---|---|
| `--mtx-spacing-{n}` | Tokens de la escala de separación. |
| `--mtx-color-divider` | Color de los divisores (heredado de `Divider`). |

## Accesibilidad

- Stack no añade roles: usa el elemento semántico adecuado (`<form>`, `<nav>`, `<ul>` con `<li>`…).
- Los divisores generados son decorativos (`aria-hidden="true"`): la estructura del HTML ya comunica la agrupación.
- Con `row-reverse` / `column-reverse` el orden visual se invierte pero el de lectura y tabulación sigue el HTML: úsalos solo cuando el orden no importe.
