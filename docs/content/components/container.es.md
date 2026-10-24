---
title: "Container"
description: "Centra el contenido de la página con un ancho máximo por breakpoint y márgenes laterales responsive (16px en móvil, 24px desde 600px)."
group: "layout"
icon: "crop_free"
weight: 30
example: "container"
import: "Container"
mui: "https://mui.com/material-ui/react-container/"
---

`Container` es el bloque de maquetación más básico: centra su contenido en horizontal, lo limita a un ancho máximo y añade un relleno lateral (gutters) que crece con la pantalla, igual que el `Container` de MUI. Úsalo para envolver `<main>`, secciones de una landing o una barra de herramientas. Para repartir columnas dentro usa [Grid]({{< relref "/components/grid" >}}); para apilar bloques, [Stack]({{< relref "/components/stack" >}}).

```tsx
import { Container } from '@rubenchodev/materix-react';
// o solo este componente
import { Container } from '@rubenchodev/materix-react/components/container';
```

## Uso básico

Un único `<Container>`. Sin `maxWidth` el tope es `lg` (1200px), como en MUI. La zona sombreada es el contenedor; la franja interior, sus gutters.

{{< react-demo id="container/01-basic" layout="block" >}}

## Ancho máximo

`maxWidth` fija el tope: `xs` 444px, `sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px o `false` para ocupar todo el ancho.

{{< react-demo id="container/02-max-width" layout="block" >}}

## Ancho fijo

`fixed` hace que el ancho máximo salte al mínimo de cada breakpoint (600, 900, 1200, 1536px) en lugar de crecer de forma fluida. Útil cuando el diseño apunta a anchos concretos. Redimensiona la ventana para verlo.

{{< react-demo id="container/03-fixed" layout="block" >}}

## Márgenes laterales

Por defecto el contenedor añade 16px de relleno lateral en móvil y 24px desde 600px. `disableGutters` los elimina, por ejemplo para que una imagen o una tabla toque los bordes.

{{< react-demo id="container/04-gutters" layout="block" >}}

## Grilla

Container limita el ancho y Grid reparte las columnas dentro. No hace falta un envoltorio con `overflow`: Grid separa los ítems con `gap`.

{{< react-demo id="container/05-grid" layout="block" >}}

## Casos de uso reales

Una página de artículo: una cabecera a todo el ancho y un cuerpo de lectura limitado a `sm` para mantener una longitud de línea cómoda. `component` renderiza el elemento semántico adecuado (`<main>`, `<article>`, `<section>`).

{{< react-demo id="container/06-real-world" layout="block" >}}

## Props controladas

En vanilla, `setMaxWidth()`, `setGutters()` y `setFixed()` cambian las clases de un elemento existente. En React las props son la API: cámbialas desde el estado y el componente se vuelve a renderizar con las clases correspondientes.

{{< react-demo id="container/07-controlled" layout="block" >}}

## Sintaxis BEM completa

Las clases funcionan sin el componente (por ejemplo, en marcado generado en el servidor).

{{< react-demo id="container/08-bem" layout="block" >}}

## Referencia de API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | — (`lg` en CSS) | Tope de ancho. `false` ocupa todo el ancho (`mtx-container--fluid`). |
| `fixed` | `boolean` | `false` | El ancho máximo salta al mínimo de cada breakpoint. |
| `disableGutters` | `boolean` | `false` | Quita el relleno lateral de 16px / 24px. |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz (`main`, `section`, `article`…). |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

Cualquier otra prop (`id`, `aria-*`, `data-*`, eventos, `style`) se reenvía al elemento raíz.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="container"` | `<Container>` |
| `data-max-width="md"` | `maxWidth="md"` |
| `data-max-width="false"` | `maxWidth={false}` |
| `data-fixed` | `fixed` |
| `data-disable-gutters` | `disableGutters` |
| `setMaxWidth(v)`, `setFixed(b)`, `setGutters(b)` | Cambia la prop correspondiente. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-container` | Bloque base: centrado, `width: 100%`, gutters. |
| `mtx-container--{xs\|sm\|md\|lg\|xl}` | Tope de ancho. |
| `mtx-container--fluid` | Sin tope (`maxWidth={false}`). |
| `mtx-container--fixed` | Ancho fijo por breakpoint. |
| `mtx-container--disable-gutters` | Sin relleno lateral. |

### Callbacks

`Container` no tiene eventos propios.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-container-max` | Tope de ancho actual (lo fijan los modificadores `mtx-container--*`). |
| `--mtx-container-fixed` | Ancho fijo del breakpoint actual. |
| `--mtx-spacing-2`, `--mtx-spacing-3` | Gutters en móvil y desde 600px. |

## Accesibilidad

- Container es puramente visual: no añade roles. Usa `component` para renderizar el elemento semántico adecuado (`<main>`, `<header>`, `<section>`, `<footer>`) en lugar de añadir un `<div>` extra.
- Los gutters evitan que el texto toque los bordes de la pantalla en móvil; no los desactives en bloques de texto.
- Limitar el ancho de lectura (`sm` o `md`) mejora la legibilidad: líneas de 60–80 caracteres.
