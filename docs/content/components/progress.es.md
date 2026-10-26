---
title: "Progress"
description: "Indicadores circulares y lineales que comunican que una operación está en curso o cuánto falta para terminarla."
group: "feedback"
icon: "donut_large"
weight: 25
example: "progress"
import: "CircularProgress, LinearProgress"
mui: "https://mui.com/material-ui/react-progress/"
---

**Progress** indica al usuario que una operación está en marcha. `CircularProgress` encaja en espacios pequeños (botones, tarjetas, una página cargando) y `LinearProgress` se coloca en el borde de un contenedor o junto a la tarea que mide. Usa la variante **indeterminate** cuando no se conoce el tiempo restante y **determinate** cuando conoces el porcentaje.

## Importación

```tsx
import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react';
```

## Uso básico

Un único `<CircularProgress />` o `<LinearProgress />` renderiza el SVG o las barras, `role="progressbar"` y el nombre accesible. Sin `value` es indeterminado; con `value` pasa a determinado.

{{< react-demo id="progress/01-basic" layout="block" >}}

## Variantes

### Circular

Como en MUI: `indeterminate` (gira con un trazo que crece y se encoge), `determinate` (un arco proporcional a `value`) y `disableShrink` (solo gira, útil cuando el hilo principal está muy ocupado). `track` añade el anillo de fondo.

{{< react-demo id="progress/02-circular" layout="block" >}}

### Lineal

Cuatro variantes: `indeterminate`, `determinate`, `buffer` (se infiere de `valueBuffer`) y `query` (indeterminado invertido, para la fase previa a la carga). 4px de alto, como en MUI; `rounded` redondea los extremos.

{{< react-demo id="progress/03-linear" layout="block" >}}

## Tamaños

`size` fija el diámetro en px (40 por defecto) y `thickness` el grosor del trazo (3.6). La altura de la barra lineal se cambia con la variable `--mtx-linear-progress-height`.

{{< react-demo id="progress/04-sizes" layout="column" >}}

## Con etiqueta

`showLabel` muestra el porcentaje redondeado: centrado en el círculo y a la derecha de la barra. La cifra visual es `aria-hidden`; los lectores de pantalla obtienen el valor de `aria-valuenow`.

{{< react-demo id="progress/05-with-label" layout="block" >}}

## Colores

`color` acepta los colores de la paleta e `inherit` (toma el color del texto del contenedor). La pista lineal se aclara en el tema claro y se oscurece en el oscuro.

{{< react-demo id="progress/06-colors" layout="block" >}}

## Escala propia

`min` y `max` cambian la escala (0–100 por defecto): `<LinearProgress max={10} value={7} />` expone `aria-valuemax="10"` y llena el 70%. Si `max <= min`, `max` pasa a ser `min + 100`. El valor se acota al rango.

## Estados

El nombre accesible por defecto es "Loading" / "Cargando" según el idioma (`I18nProvider`, `<html lang>` o la prop `locale`). Personalízalo con `label`, `aria-label` o `aria-labelledby`. Marca la región que se actualiza con `aria-busy="true"` mientras carga.

{{< react-demo id="progress/07-states" layout="block" >}}

## Ejemplos reales

Subida de archivos con valor y buffer, uso de plazas y almacenamiento en una escala propia, y un [Button](../button/) con `loading`, que usa por dentro un `CircularProgress` decorativo.

{{< react-demo id="progress/08-real-world" layout="block" >}}

## Maquetación en grilla

La barra lineal ocupa el ancho de su columna; el indicador circular se centra con flex.

{{< react-demo id="progress/09-grid" layout="block" >}}

## Uso programático

Progress es un componente controlado: actualiza `value`, `valueBuffer`, `color` o `variant` desde tu estado. Pasar `value={undefined}` vuelve al modo indeterminado.

{{< react-demo id="progress/10-programmatic" layout="block" >}}

## Referencia de la API

### Props de CircularProgress

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'indeterminate' \| 'determinate'` | inferida | `determinate` si hay `value`. |
| `value` | `number` | — | Valor actual dentro de [`min`, `max`]. |
| `min` / `max` | `number` | `0` / `100` | Escala. |
| `size` | `number` | `40` | Diámetro en px. |
| `thickness` | `number` | `3.6` | Grosor del trazo. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success' \| 'inherit'` | `'primary'` | Color de la paleta. |
| `disableShrink` | `boolean` | `false` | Gira sin encoger el trazo. |
| `track` | `boolean` | `false` | Anillo de fondo. |
| `showLabel` | `boolean` | `false` | Porcentaje centrado. |
| `label` | `string` | "Cargando" | Nombre accesible. |
| `decorative` | `boolean` | `false` | Oculto a lectores de pantalla (`aria-hidden`). |
| `locale` | `string` | contexto | Idioma del nombre por defecto. |
| `component` | `ElementType` | `'span'` | Elemento raíz. |

### Props de LinearProgress

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'indeterminate' \| 'determinate' \| 'buffer' \| 'query'` | inferida | `buffer` con `valueBuffer`, `determinate` con `value`. |
| `value` | `number` | — | Valor actual. |
| `valueBuffer` | `number` | `max` | Valor del buffer. |
| `min` / `max` | `number` | `0` / `100` | Escala. |
| `color` | igual que el circular | `'primary'` | Color de la paleta. |
| `rounded` | `boolean` | `false` | Extremos redondeados. |
| `showLabel` | `boolean` | `false` | Porcentaje a la derecha. |
| `label` · `decorative` · `locale` · `component` | — | — | Como en CircularProgress. |

El resto de props van a la raíz; `className` se concatena, `style` se combina y `ref` apunta a la raíz.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-circular-progress` · `--{indeterminate,determinate}` · `--{color}` | Raíz circular. |
| `mtx-circular-progress--disable-shrink` · `--track` · `--with-label` | Modificadores. |
| `mtx-circular-progress__svg` · `__track` · `__circle` · `__label` | SVG, anillo, arco y etiqueta. |
| `mtx-linear-progress` · `--{indeterminate,determinate,buffer,query}` · `--{color}` | Raíz lineal. |
| `mtx-linear-progress--rounded` · `--with-label` | Modificadores. |
| `mtx-linear-progress__track` · `__dashed` · `__bar` · `__bar1` · `__bar2` · `__label` | Pista, patrón de buffer, barras y etiqueta. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-{color}` | Color del arco y de la barra. |
| `--mtx-circular-progress-size` | Diámetro (lo fija `size`). |
| `--mtx-circular-progress-duration` | Duración del giro. |
| `--mtx-linear-progress-height` | Altura de la barra (4px). |
| `--mtx-linear-progress-radius` | Radio de la barra. |

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `data-mtx="circular-progress"` / `"linear-progress"` | `<CircularProgress />` / `<LinearProgress />` |
| `data-value` · `data-value-buffer` · `data-min` · `data-max` | `value` · `valueBuffer` · `min` · `max` |
| `data-variant` · `data-color` | `variant` · `color` |
| `data-size` · `data-thickness` · `data-disable-shrink` · `data-track` | `size` · `thickness` · `disableShrink` · `track` |
| `data-show-label` · `data-rounded` | `showLabel` · `rounded` |
| `data-label` · `data-decorative` | `label` · `decorative` |
| `setValue()` · `setBuffer()` · `color =` · `variant =` | props (controlado) |
| `Materix.createCircularProgress({ decorative: true })` | `<CircularProgress decorative />` |

No hay sección de "Uso manual BEM": los componentes siempre renderizan la estructura completa del SVG o de las barras, así que no hace falta escribirla a mano.

## Accesibilidad

- La raíz tiene `role="progressbar"` y un nombre accesible: `label`, `aria-label` o `aria-labelledby`; si no hay ninguno, "Loading" / "Cargando".
- `aria-valuenow`, `aria-valuemin` y `aria-valuemax` solo se exponen en `determinate` y `buffer`, como recomienda WAI-ARIA.
- El SVG y la etiqueta de porcentaje llevan `aria-hidden="true"`, así que el valor se anuncia una sola vez.
- Dentro de un control que ya comunica la carga (`aria-busy`), usa `decorative` para evitar un anuncio duplicado.
- Respeta `prefers-reduced-motion`. No es interactivo: no recibe el foco.
