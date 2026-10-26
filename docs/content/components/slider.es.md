---
title: "Slider"
description: "Permite elegir un valor o un rango arrastrando sobre una pista, construido sobre inputs range nativos accesibles."
group: "inputs"
icon: "tune"
weight: 57
example: "slider"
import: "Slider"
mui: "https://mui.com/material-ui/react-slider/"
---

**Slider** permite seleccionar un valor (o un rango) dentro de una escala continua o por pasos: volumen, brillo, filtros de precio, temperaturas. Como en MUI, cada thumb se apoya en un `<input type="range">` nativo visualmente oculto, así que el teclado, los lectores de pantalla y el envío de formularios funcionan sin código extra. Para un número exacto que el usuario deba escribir, usa un campo de texto con `type="number"`; para pocas opciones discretas, usa [Radio](../radio/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Slider } from '@rubenchodev/materix-react';

<Slider aria-label="Volumen" name="volume" defaultValue={30} />
```

## Uso básico

Basta un elemento: el componente genera el rail, el track, el thumb con su input nativo y el value label. Dale nombre con `aria-label` (o `aria-labelledby`).

{{< react-demo "slider/01-basic" >}}

## Tamaños

Dos tamaños, como en MUI: medium (rail de 4px, thumb de 20px) y small (rail de 2px, thumb de 12px sin sombra) con `size="small"`.

{{< react-demo "slider/02-sizes" >}}

## Con iconos

El slider ocupa todo el ancho disponible, así que los iconos decorativos van a su lado dentro de un [Stack](../stack/) horizontal (patrón «Volume» de MUI).

{{< react-demo "slider/03-icons" >}}

## Colores

`color` acepta la paleta MUI: `primary` (por defecto), `secondary`, `error`, `warning`, `info` y `success`.

{{< react-demo "slider/04-colors" >}}

## Estados

Al pasar el puntero sobre el thumb aparece un halo de 8px, el foco de teclado muestra el mismo halo y al arrastrar crece a 14px (pressed). `disabled` pinta el slider en gris y bloquea la interacción.

{{< react-demo "slider/05-states" >}}

## Etiqueta de valor

El value label es un globo en forma de gota de Material Design 2. `valueLabelDisplay` es `off` (por defecto), `auto` (en hover, foco y arrastre) u `on` (siempre visible). `valueLabelFormat` acepta una plantilla con `{value}` (el número localizado, que también se usa como `aria-valuetext`) o una función `(value, index) => ReactNode`; `getAriaValueText` define un texto hablado distinto.

{{< react-demo "slider/06-value-label" >}}

## Marcas

`marks` (booleano) añade una marca en cada `step`; un array `[{ value, label }]` añade marcas con etiqueta (que puede ser cualquier nodo), y también funciona la sintaxis de vanilla `"0:0 °C,20:20 °C"`. Con `step={null}` el valor solo puede caer en una marca.

{{< react-demo "slider/07-marks" >}}

## Etiquetas de marcas en los extremos

Cada etiqueta se centra sobre su marca, por lo que las de `min` y `max` sobresalen del rail la mitad de su ancho. En contenedores estrechos añade `marksInset`: la primera etiqueta se alinea al inicio del rail y la última al final (abajo/arriba en vertical, en espejo en RTL).

{{< react-demo "slider/08-marks-inset" >}}

## Rango

Un valor array (`defaultValue={[20, 60]}`) o `range` crea dos thumbs, cada uno con su input nativo llamado `{name}-start` y `{name}-end` y etiquetado «Mínimo» / «Máximo» (con el prefijo de `aria-label` o del texto de `aria-labelledby`). Cuando los thumbs se cruzan se intercambian, como en MUI; `disableSwap` los bloquea y `minDistance` impone una distancia mínima.

{{< react-demo "slider/09-range" >}}

{{< callout type="info" title="Envío de formularios" >}}
Un slider de rango envía dos campos: `price-start` y `price-end` para `name="price"`. `form.reset()` no restaura el slider (igual que en vanilla y MUI): restablece su valor desde el estado.
{{< /callout >}}

## Track

`track` es `normal` (por defecto), `inverted` (resalta la parte posterior al valor) o `false` (sin track, útil con marcas).

{{< react-demo "slider/10-track" >}}

## Vertical

`orientation="vertical"` crece de abajo arriba (200px por defecto; se cambia con `--mtx-slider-vertical-length`). El input nativo recibe `aria-orientation="vertical"`.

{{< react-demo "slider/11-vertical" >}}

## Derecha a izquierda

Dentro de un contenedor `dir="rtl"` el valor crece de derecha a izquierda, el arrastre sigue el eje invertido y la flecha izquierda lo incrementa.

{{< react-demo "slider/12-rtl" >}}

## Ejemplos reales

Un filtro de precio controlado que actualiza un resumen mientras se arrastra y envía los dos inputs nativos.

{{< react-demo "slider/13-use-cases" >}}

## Grilla

Dentro de un [Grid](../grid/) cada slider ocupa su columna: una en móvil, dos desde 600px y tres desde 900px.

{{< react-demo "slider/14-grid" >}}

## Uso controlado

Con `value` + `onChange` el estado lo gestiona el padre. `onChange` se dispara durante el arrastre o con el teclado y `onChangeCommitted` al soltar el puntero (o tras un cambio con teclado). Los setters de vanilla (`value`, `max`, `disable()`) pasan a ser cambios de props y `focus()` usa `inputRef`.

{{< react-demo id="slider/15-controlled" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `number \| number[]` | — | Valor (controlado); un array indica rango. |
| `defaultValue` | `number \| number[]` | punto medio / `[min, max]` | Valor inicial (no controlado). |
| `range` | `boolean` | `false` | Fuerza dos thumbs sin valor inicial. |
| `onChange` | `(event: Event, value, activeThumb: number) => void` | — | Durante el arrastre o con el teclado. |
| `onChangeCommitted` | `(event: Event, value) => void` | — | Al soltar el puntero o tras el teclado, solo si el valor cambió. |
| `min`, `max` | `number` | `0`, `100` | Escala. |
| `step` | `number \| null` | `1` | Incremento; `null` restringe los valores a las marcas. |
| `marks` | `boolean \| { value, label? }[] \| string` | — | Marcas en cada step, listadas (etiquetas como nodos) o en sintaxis de vanilla. |
| `marksInset` | `boolean` | `false` | Mantiene dentro del rail las etiquetas de `min`/`max`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación. |
| `track` | `'normal' \| 'inverted' \| false` | `'normal'` | Modo del track. |
| `valueLabelDisplay` | `'off' \| 'auto' \| 'on'` | `'off'` | Visibilidad del value label. |
| `valueLabelFormat` | `string \| (value, index) => ReactNode` | — | Plantilla con `{value}` o función. |
| `size` | `'medium' \| 'small'` | `'medium'` | Tamaño. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color de la paleta. |
| `disabled` | `boolean` | `false` | Deshabilita el slider. |
| `disableSwap` | `boolean` | `false` | Rango: el thumb activo se detiene en el otro. |
| `minDistance` | `number` | `0` | Rango: distancia mínima entre thumbs. |
| `name` | `string` | — | Nombre del campo (`{name}-start` / `{name}-end` en rango). |
| `getAriaLabel` | `(index) => string` | — | Nombre accesible por thumb. |
| `getAriaValueText` | `(value, index) => string` | — | `aria-valuetext`. |
| `id`, `form`, `autoFocus`, `tabIndex` | | — | Se pasan a los inputs (`id` y `autoFocus` al primero). |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se pasan a los inputs. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref al input del primer thumb. |
| `inputProps` | `InputHTMLAttributes` | — | Atributos extra de cada input. |
| `ref` | `Ref<HTMLSpanElement>` | — | Ref al `<span>` raíz. |

`className`, `style` y cualquier otro atributo van al `<span class="mtx-slider">` raíz.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-slider` | Raíz. |
| `mtx-slider--small` | Tamaño pequeño. |
| `mtx-slider--secondary`, `--error`, `--warning`, `--info`, `--success` | Colores. |
| `mtx-slider--vertical` | Orientación vertical. |
| `mtx-slider--marked` | Tiene marcas con etiqueta (reserva espacio). |
| `mtx-slider--marks-inset` | Etiquetas de los extremos alineadas dentro del rail. |
| `mtx-slider--track-inverted`, `--track-false` | Modos del track. |
| `mtx-slider--label-off`, `--label-auto`, `--label-on` | Modo del value label. |
| `mtx-slider--dragging`, `--disabled` | Estados. |
| `mtx-slider__rail`, `__track` | Rail completo y tramo con valor. |
| `mtx-slider__thumb` | Thumb; `--active` al arrastrar, `--focused` cuando su input tiene el foco. |
| `mtx-slider__input` | Input range nativo visualmente oculto. |
| `mtx-slider__value-label`, `__value-label-text` | Value label en gota (`aria-hidden`). |
| `mtx-slider__mark`, `__mark--active` | Punto de marca; activo dentro del track. |
| `mtx-slider__mark-label`, `--active`, `--start`, `--end` | Etiqueta de marca. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-slider-color`, `--mtx-slider-contrast` | Color principal y color del texto del value label. |
| `--mtx-slider-thickness`, `--mtx-slider-thumb-size` | Grosor del rail y tamaño del thumb. |
| `--mtx-slider-halo` | Color del halo de hover/foco/pressed. |
| `--mtx-slider-vertical-length` | Altura del slider vertical (200px). |
| `--mtx-slider-label-size` | Tamaño mínimo del value label (32px). |
| `--mtx-slider-disabled-color` | Color deshabilitado. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="range" data-mtx="slider" data-label="…">` | `<Slider aria-label="…" />` |
| `value` / `data-value="20,60"` | `defaultValue` (o `value` + `onChange`), `[20, 60]` |
| `data-range` | Valor array o `range` |
| `min`, `max`, `step` | `min`, `max`, `step` |
| `data-marks`, `data-marks-only`, `data-marks-inset` | `marks`, `step={null}`, `marksInset` |
| `data-value-label-display`, `data-value-label-format` | `valueLabelDisplay`, `valueLabelFormat` |
| `data-track`, `data-orientation`, `data-size`, `data-color` | `track`, `orientation`, `size`, `color` |
| `data-disable-swap`, `data-min-distance` | `disableSwap`, `minDistance` |
| `mtx:slider:input` / `mtx:slider:change` | `onChange` / `onChangeCommitted` |
| `slider.value = …`, setters `min`/`max`/`step` | Actualizar las props |
| `disable()` / `enable()` | `disabled` |
| `focus(index)` | `inputRef.current.focus()` (primer thumb) |

## Accesibilidad

- Cada thumb es un `<input type="range">` nativo: el navegador expone `role="slider"`, `aria-valuemin`, `aria-valuemax` y `aria-valuenow`. Con `valueLabelFormat` o `getAriaValueText` el componente añade `aria-valuetext` («21 °C»).
- En rango cada thumb recibe un nombre traducido: «Precio: Mínimo» / «Precio: Máximo» («Price: Minimum» / «Price: Maximum» en inglés). El prefijo tomado del elemento de `aria-labelledby` se lee una sola vez (al montar o cuando cambia `aria-labelledby`); si ese texto cambia después, usa `aria-label` o `getAriaLabel`.
- Los sliders verticales usan `aria-orientation="vertical"`. El value label y las marcas son decorativos (`aria-hidden`).
- El indicador de foco es el halo de 8px alrededor del thumb; las animaciones se desactivan con `prefers-reduced-motion`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Mueve el foco al thumb (cada thumb de un rango es una parada de tabulación). |
| <kbd>→</kbd> / <kbd>↑</kbd> | Incrementa un step (en RTL, <kbd>←</kbd> incrementa). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Decrementa un step. |
| <kbd>Re Pág</kbd> / <kbd>Av Pág</kbd> | Incrementa / decrementa un 10 % del rango. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Fija el mínimo / máximo. |
