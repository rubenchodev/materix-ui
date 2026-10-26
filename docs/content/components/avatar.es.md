---
title: "Avatar"
description: "Representa a una persona o entidad con una imagen, sus iniciales o un icono; AvatarGroup apila varios y resume el excedente."
group: "data-display"
icon: "account_circle"
weight: 10
example: "avatar"
import: "Avatar, AvatarGroup"
mui: "https://mui.com/material-ui/react-avatar/"
---

`Avatar` muestra la identidad de una persona o entidad en un espacio compacto: una foto, sus iniciales o un icono. Úsalo en listas de usuarios, cabeceras de tarjetas, comentarios o barras de aplicación. Si necesitas una etiqueta con texto que se pueda eliminar o pulsar, usa [Chip](../chip/); para un indicador numérico sobre un icono, usa [Badge](../badge/).

```tsx
import { Avatar, AvatarGroup } from '@rubenchodev/materix-react';
// o solo este componente:
import { Avatar, AvatarGroup } from '@rubenchodev/materix-react/components/avatar';
```

## Uso básico

Las iniciales van como hijos, `src` genera la imagen e `icon` inserta un icono de Material (una cadena es el nombre del icono; también se acepta cualquier nodo, como un SVG).

{{< react-demo "avatar/01-basic" >}}

## Variantes

`variant` define la forma: `circular` (por defecto), `rounded` (radio de 4px) o `square`.

{{< react-demo id="avatar/02-variants" layout="block" >}}

## Tamaños

Tamaños canónicos de 24, 40 (por defecto) y 56px con `size="small|medium|large"`. Un número fija un tamaño personalizado en píxeles (ancho, alto y un tamaño de letra del 45 %).

{{< react-demo id="avatar/03-sizes" layout="block" >}}

## Imagen, letras e icono

El contenido se resuelve en orden: `src` (con `srcSet`, `sizes` e `imgProps` para el `<img>`), `icon` y, si no hay ninguno, los hijos. Los iconos conservan su cuadrícula nativa de 24px.

{{< react-demo id="avatar/04-content" layout="block" >}}

## Colores

Sin `color` se usa gris 600 con texto blanco (`--mtx-avatar-default-bg` / `--mtx-avatar-default-color`, contraste AA 4.6:1; MUI usa gris 400 con 1.8:1). `color` aplica cualquier color de la paleta con su texto de contraste.

{{< react-demo "avatar/05-colors" >}}

## Estados

Avatar no es interactivo: sus estados son de contenido. Sin imagen ni icono está en modo fallback (`.mtx-avatar--fallback`) y muestra los hijos. Si la imagen no carga, el `<img>` recibe `hidden`, la raíz pasa a modo fallback y, si no hay hijos, se añade un `.mtx-avatar__fallback` con la inicial de `alt` (`●` sin `alt`), igual que en vanilla. Un `src` nuevo reintenta la carga.

{{< react-demo id="avatar/06-states" layout="block" >}}

## Agrupación

`AvatarGroup` solapa sus avatares. `max` (5 por defecto, mínimo 2) cuenta también el indicador `+N`; `total` cuenta usuarios que no se renderizan; `spacing` fija el solapamiento (`medium` = 8px, `small` = 16px, o píxeles). Los avatares excedentes siguen montados con `hidden`. Cada hijo válido cuenta como un elemento (también un Avatar envuelto en Badge o Tooltip), como en MUI; vanilla solo cuenta los hijos `.mtx-avatar`. El indicador `+N` tiene un `aria-label` traducido (`{count} más`) que `surplusLabel` sustituye.

{{< react-demo id="avatar/07-grouping" layout="block" >}}

## Casos de uso

Estado en línea con Badge y autores de comentarios en una lista.

{{< react-demo id="avatar/08-use-cases" layout="block" >}}

## Maquetación en grilla

Directorio del equipo en [Grid](../grid/): 1 columna en móvil, 2 en `sm` y 3 en `md`.

{{< react-demo id="avatar/09-grid" layout="block" >}}

## Uso controlado

El grupo se recalcula en cada render, así que cambiar `max`, `total` o los hijos sustituye a los setters `max`/`total` y a `refresh()` de vanilla.

{{< react-demo id="avatar/10-controlled" layout="block" >}}

## API

### Props de Avatar

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `src` | `string` | — | Origen de la imagen. |
| `alt` | `string` | — | Texto alternativo; su inicial es el fallback si la imagen falla. |
| `srcSet` / `sizes` | `string` | — | Atributos de imagen adaptable. |
| `imgProps` | `ImgHTMLAttributes` | — | Atributos extra del `<img>` (`onError` se sigue llamando). |
| `icon` | `ReactNode` | — | Icono sin imagen: nombre de Material Icons o un nodo. |
| `variant` | `'circular'` \| `'rounded'` \| `'square'` | `'circular'` | Forma. |
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` | — | Color de fondo. |
| `size` | `'small'` \| `'medium'` \| `'large'` \| `number` | — | Tamaño canónico o píxeles. |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz. |
| `className` / `ref` | | — | Se concatena / elemento raíz. |

### Props de AvatarGroup

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `max` | `number` | `5` | Elementos visibles, incluido `+N` (mínimo 2). |
| `total` | `number \| null` | — | Total lógico de usuarios. |
| `spacing` | `'small'` \| `'medium'` \| `number` | `'medium'` | Solapamiento (`--mtx-avatar-group-overlap`). |
| `label` | `string` | — | Nombre accesible del grupo (`aria-label`). |
| `surplusLabel` | `string` | traducido | Plantilla de la etiqueta de `+N`; `{count}` = cantidad. |
| `locale` | `string` | — | Idioma local de los textos. |
| `className` / `ref` | | — | Se concatena / `<div>` raíz. |

El resto de props se reenvía al elemento raíz. También se exportan las utilidades `getAvatarInitial(alt)` y `getAvatarGroupLayout(count, max, total)`.

### Callbacks

Avatar y AvatarGroup no emiten eventos (usa `imgProps.onError` para saber cuándo falla una imagen).

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-avatar` | Raíz (40px, circular). |
| `.mtx-avatar--fallback` | Sin imagen (o imagen rota). |
| `.mtx-avatar__fallback` | Inicial generada cuando falla la imagen. |
| `.mtx-avatar--rounded` / `--square` | Forma. |
| `.mtx-avatar--small` / `--medium` / `--large` | 24 / 40 / 56px. |
| `.mtx-avatar--{color}` | Fondo de la paleta. |
| `.mtx-avatar-group` | Grupo. |
| `.mtx-avatar--surplus` | Indicador `+N`. |

## Accesibilidad

- Con imagen, `alt` describe a la persona; usa `alt=""` cuando el nombre ya aparece al lado.
- Los avatares de icono con significado necesitan `role="img"` y un `aria-label`; el icono generado es `aria-hidden`.
- `AvatarGroup` renderiza `role="group"` y el indicador `+N` `role="img"`, para que su `aria-label` sea válido (mejora sobre vanilla, que no tiene roles).
- Da un `label` a `AvatarGroup` y mantén significativo el `aria-label` de `+N` (`surplusLabel`).
- El fondo por defecto cumple contraste AA (4.6:1).

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<div data-mtx="avatar">RD</div>` | `<Avatar>RD</Avatar>` |
| `data-src` / `data-alt` | `src` / `alt` |
| `data-srcset` / `data-sizes` | `srcSet` / `sizes` |
| `data-icon="folder"` | `icon="folder"` |
| `data-variant="rounded"` | `variant="rounded"` |
| `data-color="primary"` | `color="primary"` |
| `data-size="large"` / `data-size="72"` | `size="large"` / `size={72}` |
| `<div data-mtx="avatar-group">` | `<AvatarGroup>` |
| `data-max` / `data-total` / `data-spacing` | `max` / `total` / `spacing` |
| `data-label` / `data-surplus-label` | `label` / `surplusLabel` |
| `group.max = 3`, `group.refresh()` | `max={3}` (se recalcula en el render) |

El DOM renderizado (clases y atributos) es idéntico al del componente vanilla tras inicializarse.
