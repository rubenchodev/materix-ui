---
title: "Paper"
description: "Superficie base de Material Design con fondo, radio y sombra que agrupa contenido y expresa elevación."
group: "surfaces"
icon: "layers"
weight: 30
example: "paper"
import: "Paper"
mui: "https://mui.com/material-ui/react-paper/"
---

**Paper** es la superficie física de Material Design: un contenedor con fondo de papel, radio de 4 px y una sombra que indica su elevación. Es la base visual de Card, Dialog, Menu o AppBar. Úsalo para agrupar contenido arbitrario sobre el fondo de la página; si el bloque tiene cabecera, imagen y acciones, usa directamente Card.

```tsx
import { Paper } from '@rubenchodev/materix-react';
// o solo este componente:
import { Paper } from '@rubenchodev/materix-react/components/paper';
```

## Uso básico

`<Paper>` renderiza un `<div class="mtx-paper">` con elevación 1. Cambia la sombra con `elevation`.

{{< react-demo id="paper/01-basic" layout="block" >}}

## Variantes

La variante por defecto (`elevation`) separa la superficie con una sombra. `variant="outlined"` la delimita con un borde de 1 px (`--mtx-color-divider`) y sin sombra; `elevation={0}` la deja plana.

{{< react-demo id="paper/02-variants" layout="block" >}}

## Elevaciones

Solo existen como tokens (`--mtx-elevation-*`) las elevaciones de MUI **0 a 8, 12, 16 y 24**. Cualquier otro valor genera una clase sin estilo y la superficie conserva la elevación base 1.

{{< react-demo id="paper/03-elevations" layout="block" >}}

| Uso típico (MUI) | Elevación |
|---|---|
| Card en reposo, Paper base | 1 |
| AppBar | 4 |
| Card elevada, Menu | 8 |
| Drawer | 16 |
| Dialog | 24 |

## Forma

Las esquinas usan `--mtx-shape-radius` (4 px). `square` las deja rectas, útil para superficies pegadas a los bordes de la ventana.

{{< react-demo id="paper/04-shape" layout="block" >}}

## Tema oscuro

Paper consume `--mtx-color-background-paper` y `--mtx-color-text-primary`, así que sigue al tema. `data-mtx-theme="dark"` también funciona sobre un contenedor concreto. En el tema oscuro, como en MUI, cada elevación añade una capa blanca (`--mtx-overlay-elevation-N`) mediante `background-image`, de modo que las superficies más altas se ven más claras; `outlined` no lleva capa.

{{< react-demo id="paper/05-dark-theme" layout="block" >}}

## Grilla

Paper es el contenedor habitual de los elementos de una grilla: la columna decide el ancho y Paper aporta la superficie.

{{< react-demo id="paper/06-grid" layout="block" >}}

## Uso programático

No hay nada que inicializar: `elevation`, `variant` y `square` son props normales, así que al cambiarlas se actualizan las clases en el siguiente render.

{{< react-demo id="paper/07-programmatic" layout="block" >}}

## Elemento semántico y composición

`component` cambia la etiqueta raíz (`section`, `article`, `aside`…) sin alterar el aspecto. Combínalo con [Typography](../typography/) para el contenido.

{{< react-demo id="paper/08-composition" layout="block" >}}

## API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `elevation` | `0`–`8` \| `12` \| `16` \| `24` | — | Añade `.mtx-paper--elevation-{n}`. Sin ella se aplica la sombra base (elevación 1). |
| `variant` | `'elevation'` \| `'outlined'` | `'elevation'` | `outlined` añade `.mtx-paper--outlined` (borde, sin sombra). |
| `square` | `boolean` | `false` | Añade `.mtx-paper--square` (sin radio). |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz. |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

El resto de props (`id`, `style`, `aria-*`, `data-*`, eventos) se reenvían al elemento raíz.

### Callbacks

Paper no emite eventos.

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-paper` | Fondo de papel, color de texto primario, radio de 4 px y elevación 1. |
| `.mtx-paper--elevation-{n}` | Sombra `--mtx-elevation-{n}` para n = 0–8, 12, 16, 24. |
| `.mtx-paper--outlined` | Borde de 1 px `--mtx-color-divider` y sin sombra (prevalece sobre cualquier elevación). |
| `.mtx-paper--square` | `border-radius: 0`. |

## Accesibilidad

- Paper es puramente visual y no añade roles ni ARIA: elige el elemento semántico con `component` (`section`, `article`, `aside`) y dale un encabezado (`aria-labelledby`) cuando agrupe contenido relevante.
- La elevación no transmite información por sí sola; usa `outlined` o un encabezado cuando la superficie deba quedar claramente delimitada.
- No es interactivo: si toda la superficie debe ser clicable, usa una Card con área de acción.

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="paper">` | `<Paper>` |
| `data-elevation="8"` | `elevation={8}` |
| `data-variant="outlined"` | `variant="outlined"` |
| `data-square` | `square` |
| `Materix.init(el, 'paper')` | No hace falta: renderiza `<Paper>` |

El DOM renderizado (clases y atributos) es idéntico al del componente vanilla tras inicializarse.
