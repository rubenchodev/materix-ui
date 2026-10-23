---
title: "Paper"
description: "Superficie base de Material Design con fondo, radio y sombra que agrupa contenido y expresa elevación."
group: "surfaces"
icon: "layers"
weight: 30
example: "paper"
mui: "https://mui.com/material-ui/react-paper/"
---

**Paper** es la superficie física de Material Design: un contenedor con fondo de papel, radio de 4 px y una sombra que indica su elevación. Es la base visual de [Card](../card/), [Dialog](../dialog/), [Menu](../menu/) o [AppBar](../app-bar/). Úsalo para agrupar contenido arbitrario sobre el fondo de la página; si el bloque tiene cabecera, imagen y acciones, usa directamente [Card](../card/).

## Uso básico

Un `<div data-mtx="paper">` recibe la clase `.mtx-paper` con elevación 1. Cambia la sombra con `data-elevation`.

{{< mtx-demo title="Paper simple" >}}
<div data-mtx="paper" class="mtx-p-3">Elevación 1 (predeterminada)</div>
<div data-mtx="paper" data-elevation="8" class="mtx-p-3">Elevación 8</div>
{{< /mtx-demo >}}

## Variantes

La variante por defecto separa la superficie con sombra. `data-variant="outlined"` la delimita con un borde de 1 px (`--mtx-color-divider`) y sin sombra; `data-elevation="0"` la deja plana.

{{< mtx-demo title="Elevation, outlined y plana" >}}
<div data-mtx="paper" class="mtx-p-3">Sombra</div>
<div data-mtx="paper" data-variant="outlined" class="mtx-p-3">Borde</div>
<div data-mtx="paper" data-elevation="0" class="mtx-p-3">Plano</div>
{{< /mtx-demo >}}

## Elevaciones

Solo existen como token las elevaciones de MUI **0 a 8, 12, 16 y 24** (`--mtx-elevation-*`). Cualquier otro valor de `data-elevation` genera una clase sin estilo y la superficie conserva la elevación 1.

{{< mtx-demo title="Escala de elevación" >}}
<div data-mtx="paper" data-elevation="0" class="mtx-p-3">0</div>
<div data-mtx="paper" data-elevation="1" class="mtx-p-3">1</div>
<div data-mtx="paper" data-elevation="2" class="mtx-p-3">2</div>
<div data-mtx="paper" data-elevation="3" class="mtx-p-3">3</div>
<div data-mtx="paper" data-elevation="4" class="mtx-p-3">4</div>
<div data-mtx="paper" data-elevation="6" class="mtx-p-3">6</div>
<div data-mtx="paper" data-elevation="8" class="mtx-p-3">8</div>
<div data-mtx="paper" data-elevation="12" class="mtx-p-3">12</div>
<div data-mtx="paper" data-elevation="16" class="mtx-p-3">16</div>
<div data-mtx="paper" data-elevation="24" class="mtx-p-3">24</div>
{{< /mtx-demo >}}

| Uso habitual (MUI) | Elevación |
|---|---|
| Card en reposo, Paper base | 1 |
| Card elevada (`raised`), Menu | 8 |
| AppBar | 4 |
| Drawer | 16 |
| Dialog | 24 |

## Forma

Las esquinas usan `--mtx-shape-radius` (4 px). `data-square` las deja rectas, útil para superficies pegadas a los bordes de la ventana.

{{< mtx-demo title="Redondeado y square" >}}
<div data-mtx="paper" data-elevation="3" class="mtx-p-3">Redondeado</div>
<div data-mtx="paper" data-elevation="3" data-square class="mtx-p-3">Square</div>
<div data-mtx="paper" data-variant="outlined" data-square class="mtx-p-3">Outlined square</div>
{{< /mtx-demo >}}

## Tema oscuro

Paper consume `--mtx-color-background-paper` y `--mtx-color-text-primary`, por lo que cambia con el tema sin tocar el componente. El atributo `data-mtx-theme="dark"` también funciona en un contenedor concreto. En tema oscuro, como en MUI, cada elevación añade una capa blanca (`--mtx-overlay-elevation-N`, alfa = (4,5·ln(N+1) + 2) / 100) mediante `background-image`, así que las superficies más altas se ven más claras aunque la sombra apenas se perciba. `outlined` no lleva capa.

{{< mtx-demo title="Superficies dentro de un contenedor oscuro" layout="block" >}}
<div data-mtx-theme="dark" class="mtx-stack mtx-stack--row mtx-stack--spacing-2 mtx-p-3" style="flex-wrap: wrap; background: var(--mtx-color-background-default);">
  <div data-mtx="paper" data-elevation="0" class="mtx-p-3">Elevación 0</div>
  <div data-mtx="paper" data-elevation="1" class="mtx-p-3">Elevación 1</div>
  <div data-mtx="paper" data-elevation="4" class="mtx-p-3">Elevación 4</div>
  <div data-mtx="paper" data-elevation="8" class="mtx-p-3">Elevación 8</div>
  <div data-mtx="paper" data-elevation="24" class="mtx-p-3">Elevación 24</div>
  <div data-mtx="paper" data-variant="outlined" class="mtx-p-3">Outlined</div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

### Panel de resumen en una grilla

Paper es el contenedor habitual de los ítems de [Grid](../grid/): la columna decide el ancho y Paper aporta la superficie.

{{< mtx-demo title="Indicadores" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Ventas</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">12 480 €</div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Pedidos</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">326</div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <div data-mtx="paper" data-variant="outlined" class="mtx-p-3">
      <div class="mtx-typography mtx-typography--overline">Devoluciones</div>
      <div class="mtx-typography mtx-typography--h5 mtx-typography--gutter-bottom">4</div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Las clases pueden escribirse directamente (SSR o plantillas); el componente no duplica las que ya existen.

```html
<div class="mtx-paper mtx-paper--elevation-2" data-mtx="paper">...</div>
<div class="mtx-paper mtx-paper--outlined mtx-paper--square" data-mtx="paper">...</div>
```

## Uso programático

Paper no tiene métodos ni eventos propios: solo traduce sus atributos `data-*` a clases al inicializarse (una única vez). Para cambiar la elevación después, alterna las clases `mtx-paper--elevation-*`.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-elevation', '4');
container.append(el);

const paper = Materix.init(el, 'paper');   // o: new Materix.Paper(el)
Materix.getInstance(el) === paper;         // true
el.className;                              // "mtx-paper mtx-paper--elevation-4"
```

```javascript
// ES modules
import { Paper } from '@rubenchodev/materix-ui';
new Paper(document.querySelector('#panel'));
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `paper` | — | Inicializa el componente y añade `.mtx-paper`. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | — (sombra de elevación 1) | Añade `.mtx-paper--elevation-{n}`. |
| `data-variant` | `outlined` | — | Añade `.mtx-paper--outlined` (borde sin sombra). |
| `data-square` | booleano (presencia) | ausente | Añade `.mtx-paper--square` (sin radio). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-paper` | Fondo de papel, color de texto primario, radio de 4 px y elevación 1. |
| `.mtx-paper--elevation-{n}` | Sombra `--mtx-elevation-{n}` para n = 0–8, 12, 16, 24. |
| `.mtx-paper--outlined` | Borde de 1 px `--mtx-color-divider` y sin sombra. |
| `.mtx-paper--square` | `border-radius: 0`. |

{{< callout type="info" >}}
Las clases de elevación se declaran después de `--outlined` en la hoja de estilos: si combinas `data-variant="outlined"` con `data-elevation`, la sombra vuelve a aparecer. Usa una u otra.
{{< /callout >}}

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo. |
| `--mtx-color-text-primary` | Color del texto. |
| `--mtx-color-divider` | Borde de `outlined`. |
| `--mtx-shape-radius` | Radio de las esquinas. |
| `--mtx-elevation-0` … `--mtx-elevation-8`, `--mtx-elevation-12`, `--mtx-elevation-16`, `--mtx-elevation-24` | Sombras. |
| `--mtx-overlay-elevation-{n}` | Capa blanca por elevación en tema oscuro (`background-image`); `none` en claro y en `outlined`. |
| `--mtx-duration-short` / `--mtx-easing-standard` | Transición de la sombra. |

## Accesibilidad

- Paper es puramente visual y no añade roles ni ARIA: usa el elemento semántico adecuado (`<section>`, `<article>`, `<aside>`) y dale un encabezado si agrupa contenido relevante.
- La elevación no comunica información por sí sola; en tema oscuro la capa blanca ayuda, pero usa `outlined` o un encabezado cuando la superficie deba quedar claramente delimitada.
- No es interactivo: si toda la superficie debe ser clicable, usa una [Card](../card/) con `data-clickable` o un `CardActionArea`.
