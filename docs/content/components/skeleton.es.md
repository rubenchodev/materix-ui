---
title: "Skeleton"
description: "Placeholders con la forma del contenido mientras se cargan los datos, con animación pulse o wave."
group: "feedback"
icon: "view_day"
weight: 28
example: "skeleton"
import: "Skeleton, SkeletonRegion"
mui: "https://mui.com/material-ui/react-skeleton/"
---

**Skeleton** muestra un bloque gris con la forma del contenido que todavía no ha llegado (texto, avatar, imagen, tarjeta). Reduce la espera percibida y evita saltos de maquetación cuando aparecen los datos. Úsalo en cargas cortas de contenido con estructura conocida; si no sabes qué forma tendrá el resultado, o la operación no carga contenido (guardar, enviar), usa [Progress](../progress/).

```tsx
import { Skeleton, SkeletonRegion } from '@rubenchodev/materix-react';
// o solo este componente:
import { Skeleton, SkeletonRegion } from '@rubenchodev/materix-react/components/skeleton';
```

## Uso básico

Sin variante, `<Skeleton />` es una línea de texto que ocupa el ancho disponible y toma la altura de la tipografía. `width` y `height` aceptan números (px) o cualquier unidad CSS.

{{< react-demo id="skeleton/01-basic" layout="block" >}}

## Variantes

Cuatro formas, como en MUI: `text` (por defecto, reducida al 60 % de la altura de línea), `circular`, `rectangular` (sin radio) y `rounded` (radio de 4px).

{{< react-demo id="skeleton/02-variants" layout="block" >}}

## Animaciones

`animation="pulse"` (por defecto), `"wave"` o `false` (estático; también se acepta la cadena `"false"`). Con `prefers-reduced-motion: reduce` la animación se desactiva automáticamente.

{{< react-demo id="skeleton/03-animations" layout="block" >}}

## Tamaños

La variante `text` hereda el tamaño de la tipografía que la contiene: colócala dentro del mismo elemento que tendrá el texto real. Las formas circulares siguen los tamaños canónicos de Avatar (24, 40 y 56px).

{{< react-demo id="skeleton/04-sizes" layout="block" >}}

## Párrafos

`lines={3}` genera un bloque `.mtx-skeleton-lines` con varias líneas de texto; la última es más corta (60 % por defecto, configurable con `lastWidth`). Con `lines`, `variant` y `height` no tienen efecto.

{{< react-demo id="skeleton/05-paragraphs" layout="block" >}}

## Con hijos

Cuando el skeleton envuelve contenido, toma su tamaño exacto y lo oculta (`visibility: hidden`, clase `.mtx-skeleton--with-children`). El texto directo se envuelve en `.mtx-skeleton__text` para ocultarlo también, en lugar de dejar texto transparente que falla las comprobaciones de contraste.

{{< react-demo "skeleton/06-with-children" >}}

## Estados

### Región de carga

`SkeletonRegion` es el equivalente React de `Materix.skeleton.set()`. Mientras `loading` es `true` pone `data-loading` y `aria-busy="true"` en la raíz, muestra el `placeholder` (dentro de `[data-skeleton-placeholder]`, siempre `aria-hidden`) y oculta los hijos (dentro de `[data-skeleton-content]`). Ambos contenedores siguen montados y el CSS oculta el inactivo, así que el contenido conserva su estado. Con `aria-live="polite"` el contenido se anuncia al terminar la carga. Usa `placeholderProps` y `contentProps` para dar estilo a los contenedores.

{{< react-demo id="skeleton/07-states" layout="block" >}}

Si prefieres desmontar el contenido durante la carga, también sirve el patrón de MUI: `loading ? <Skeleton /> : <Contenido />`.

## Ejemplos reales

Una tarjeta de vídeo y una lista de mensajes mientras cargan.

{{< react-demo id="skeleton/08-real-world" layout="block" >}}

## Grilla

Los bloques sin ancho fijo llenan su columna.

{{< react-demo id="skeleton/09-grid" layout="block" >}}

## Uso controlado

`variant` y `animation` son props normales (sustituyen a `setVariant()` y `setAnimation()`); `SkeletonRegion` llama a `onChange({ loading })` cada vez que cambia `loading` tras el montaje.

{{< react-demo id="skeleton/10-controlled" layout="block" >}}

## API

### Props de Skeleton

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `variant` | `'text'` \| `'circular'` \| `'rectangular'` \| `'rounded'` | `'text'` | Forma (los valores desconocidos vuelven a `text`). |
| `animation` | `'pulse'` \| `'wave'` \| `false` \| `'false'` | `'pulse'` | Animación. |
| `width` | `number \| string` | — | Ancho (número = px). |
| `height` | `number \| string` | — | Alto (número = px). |
| `lines` | `number` | — | Número de líneas de texto (> 1). |
| `lastWidth` | `number \| string` | `'60%'` | Ancho de la última línea. |
| `component` | `ElementType` | `'span'` (`'div'` con `lines`) | Elemento o componente raíz. |
| `className` / `ref` | | — | Se concatena / elemento raíz. |

### Props de SkeletonRegion

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `loading` | `boolean` | `true` | Estado de carga. |
| `placeholder` | `ReactNode` | — | Visible durante la carga. |
| `children` | `ReactNode` | — | Contenido real. |
| `placeholderProps` / `contentProps` | `HTMLAttributes<HTMLDivElement>` | — | Atributos de los contenedores. |
| `onChange` | `(detail: { loading: boolean }) => void` | — | Se llama cuando cambia `loading`. |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz. |

El resto de props se reenvía al elemento raíz.

### Callbacks

| Callback | Evento vanilla | Detalle |
|---|---|---|
| `SkeletonRegion.onChange` | `mtx:skeleton:change` | `{ loading }` |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-skeleton` | Bloque. |
| `.mtx-skeleton--text` / `--circular` / `--rectangular` / `--rounded` | Forma. |
| `.mtx-skeleton--pulse` / `--wave` / `--no-animation` | Animación. |
| `.mtx-skeleton--with-children` | Toma el tamaño de sus hijos. |
| `.mtx-skeleton__text` | Texto directo envuelto. |
| `.mtx-skeleton-lines` | Contenedor de párrafo. |

## Accesibilidad

- Todos los skeletons son decorativos (`aria-hidden="true"`).
- Anuncia el estado de carga en el contenedor: `SkeletonRegion` fija `aria-busy` y, con `aria-live="polite"`, el contenido se lee al llegar.
- Las animaciones respetan `prefers-reduced-motion`.

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<span data-mtx="skeleton">` | `<Skeleton />` |
| `data-variant="circular"` | `variant="circular"` |
| `data-animation="wave"` / `"false"` | `animation="wave"` / `animation={false}` |
| `data-width="40"` / `data-height="3rem"` | `width={40}` / `height="3rem"` |
| `data-lines="3"` / `data-last-width="30%"` | `lines={3}` / `lastWidth="30%"` |
| `setVariant()` / `setAnimation()` | props `variant` / `animation` |
| `[data-loading]` + `[data-skeleton-placeholder]` + `[data-skeleton-content]` | `<SkeletonRegion loading placeholder={…}>…</SkeletonRegion>` |
| `Materix.skeleton.set(el, false)` / `toggle()` | `loading={false}` (tu estado) |
| `mtx:skeleton:change` | `onChange` |

El DOM renderizado (clases y atributos) es idéntico al del componente vanilla tras inicializarse.
