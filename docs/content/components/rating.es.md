---
title: "Rating"
description: "Valoración con estrellas para opinar sobre un producto o mostrar una puntuación media, accesible con radios nativos y teclado."
group: "inputs"
icon: "star_half"
weight: 55
example: "rating"
import: "Rating"
mui: "https://mui.com/material-ui/react-rating/"
---

**Rating** permite elegir una puntuación de 1 a N iconos (estrellas por defecto) o mostrar una media en modo solo lectura. Como en MUI, por debajo hay radios nativos ocultos con etiquetas ("3 estrellas"), así funciona con teclado, lectores de pantalla y formularios sin código extra. Para una escala numérica larga usa un [Slider](../slider/) o un [Native Select](../native-select/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Rating } from '@rubenchodev/materix-react';

<Rating defaultValue={3} name="product-score" aria-label="Valoración del producto" />
```

## Uso básico

Un único `<Rating />` genera cinco estrellas. `defaultValue` fija el valor inicial y `name` el `name` de los radios (se envía con el formulario; si se omite, se genera). Un clic sobre el valor actual lo borra (`null`).

{{< react-demo "rating/01-basic" >}}

## Precisión

`precision={0.5}` permite medias estrellas: cada estrella contiene dos radios y su mitad izquierda elige el valor x.5. También sirven otras fracciones de 1 como `0.25`; los valores se redondean a la precisión.

{{< react-demo "rating/02-precision" >}}

## Tamaños

Tamaños MUI con `size`: small 18px, medium 24px (por defecto) y large 30px.

{{< callout type="info" title="Iconos y tamaño" >}}
Los iconos incluidos (`star`, `star_border`, `star_outline`, `favorite`, `favorite_border`, `thumb_up`, `thumb_up_off_alt`, `circle`, `radio_button_unchecked`) se dibujan en **SVG**, que escala sin perder nitidez. Cualquier otro nombre usa el glifo de Material Icons a su tamaño nativo de 24px en todos los tamaños: nunca se fuerza su `font-size` (regla de iconografía de Materix). Un SVG propio pasado como nodo escala con `--mtx-rating-icon-size`.
{{< /callout >}}

{{< react-demo "rating/03-sizes" >}}

## Iconos

`icon` (lleno) y `emptyIcon` (vacío) aceptan un nombre de Material Icons o cualquier nodo de React (por ejemplo tu propio `<svg>`). Si solo indicas `icon`, el estado vacío usa el mismo icono en gris. Personaliza el color con `--mtx-rating-color`.

{{< react-demo "rating/04-icons" >}}

## Estados

Al pasar el cursor se previsualiza el valor (la estrella activa crece 1,2×); con <kbd>Tab</kbd> y las flechas cambia con un anillo de foco visible. `readOnly` muestra una valoración fija (`role="img"`) y `disabled` la atenúa.

{{< react-demo "rating/05-states" >}}

## Solo el seleccionado y máximo

`highlightSelectedOnly` resalta solo el icono elegido (escalas de satisfacción) y `max` cambia el número de iconos.

{{< react-demo "rating/06-highlight-max" >}}

## Texto al pasar el cursor

`onChangeActive(event, value)` informa del valor bajo el cursor o del radio enfocado (`null` al salir) para mostrar una etiqueta descriptiva, como la demo *hover feedback* de MUI. `getLabelText` personaliza la etiqueta accesible de cada radio.

{{< react-demo "rating/07-hover-feedback" >}}

## Casos de uso reales

Un resumen de producto con la media en solo lectura y un formulario de reseña que envía el valor como cualquier otro radio.

{{< react-demo id="rating/08-use-cases" layout="block" >}}

## Grilla

Varios criterios de valoración repartidos en columnas responsive de [Grid](../grid/), cada uno nombrado con `aria-labelledby`.

{{< react-demo "rating/09-grid" >}}

## Uso controlado

Con `value` + `onChange` el padre es dueño del valor; los miembros de la instancia vanilla pasan a ser cambios de estado (`rating.value = 5` → `setValue(5)`, `disable()` → `disabled`).

{{< react-demo "rating/10-controlled" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `number \| null` | — | Valor (controlado); `null` = sin valoración. |
| `defaultValue` | `number \| null` | `null` | Valor inicial (no controlado). |
| `onChange` | `(event, value: number \| null) => void` | — | El usuario cambia o borra la valoración. |
| `onChangeActive` | `(event, value: number \| null) => void` | — | Cambia el valor bajo el cursor o el radio enfocado (`null` al salir). |
| `max` | `number` | `5` | Número de iconos. |
| `precision` | `number` | `1` | Paso mínimo (`0.5`, `0.25`…; debe dividir 1). |
| `readOnly` | `boolean` | `false` | Sin radios, `role="img"` y `aria-label` "Valoración: X de N" (un `aria-label` o `label` explícito tiene prioridad). |
| `disabled` | `boolean` | `false` | Deshabilita los radios y atenúa el componente. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Iconos SVG de 18 / 24 / 30px. |
| `icon` | `string \| ReactNode` | `'star'` | Icono lleno. |
| `emptyIcon` | `string \| ReactNode` | `'star_border'` (o `icon` si se indica) | Icono vacío. |
| `highlightSelectedOnly` | `boolean` | `false` | Resalta solo el icono seleccionado. |
| `name` | `string` | generado | `name` de los radios. |
| `label` | `string` | — | Nombre accesible del grupo (`aria-label`). |
| `getLabelText` | `(value: number) => string` | "3 estrellas" (traducido) | Etiqueta accesible de cada valor. |
| `emptyLabelText` | `string` | "Sin valoración" (traducido) | Etiqueta del radio "sin valoración". |
| `locale` | `string` | contexto | Idioma de las etiquetas (prevalece sobre `I18nProvider`). |
| `ref` | `Ref<HTMLSpanElement>` | — | Ref al `<span>` raíz. |

`className`, `style`, `aria-*` y cualquier otro atributo van al `<span>` raíz.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `.mtx-rating` | Contenedor (inline-flex, color `#faaf00`). |
| `.mtx-rating--small`, `--large` | Tamaños de 18 y 30px. |
| `.mtx-rating--read-only`, `--disabled` | Estados. |
| `.mtx-rating--hovering` | Mientras se previsualiza con el cursor. |
| `.mtx-rating__item` | Un icono; `--decimal` con precisión menor que 1; `--active` el ítem bajo el cursor (escala 1,2). |
| `.mtx-rating__label` | `<label>` (o `<span>` en solo lectura) con `data-rating-value`; `--filled` lleno; `--partial` recorte de fracción; `--hover` valor bajo el cursor. |
| `.mtx-rating__icon`, `__icon--filled`, `__icon--empty` | Iconos lleno y vacío (se muestra uno según el estado). |
| `.mtx-rating__input`, `__input--empty` | Radios nativos ocultos; el vacío representa "sin valoración". |
| `.mtx-rating__visually-hidden` | Texto solo para lectores de pantalla. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-rating-color` | Color de los iconos llenos (`#faaf00`). |
| `--mtx-rating-empty-color` | Color de los iconos vacíos (`--mtx-color-action-disabled`). |
| `--mtx-rating-icon-size` | Tamaño de los iconos SVG (18 / 24 / 30px). |
| `--mtx-disabled-opacity` | Opacidad del estado deshabilitado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<span data-mtx="rating" data-value="3">` | `<Rating defaultValue={3} />` |
| `data-max`, `data-precision`, `data-name` | `max`, `precision`, `name` |
| `data-read-only` / `data-disabled` | `readOnly` / `disabled` |
| `data-size="large"` | `size="large"` |
| `data-icon` / `data-empty-icon` | `icon` / `emptyIcon` (también nodos React) |
| `data-highlight-selected-only` | `highlightSelectedOnly` |
| `data-label` | `label` (o `aria-label`) |
| `rating.value = 4` | Actualizar el estado `value` |
| `disable()` / `enable()` | `disabled` |
| `mtx:rating:change` | `onChange(event, value)` |
| `mtx:rating:active` | `onChangeActive(event, value)` (también con el foco de teclado) |

## Accesibilidad

- Interactivo: radios nativos con el mismo `name`, cada uno con su etiqueta traducida ("1 estrella", "3 estrellas"; "3 Stars" en inglés) más un radio "Sin valoración". El navegador gestiona la exclusión mutua y las flechas.
- Cuando el componente tiene nombre (`label`, `aria-label` o `aria-labelledby`) recibe `role="radiogroup"`.
- Solo lectura: `role="img"` con un `aria-label` traducido ("Valoración: 4 de 5" / "Rated 4 out of 5"); los iconos son decorativos.
- El foco de teclado se muestra como un anillo alrededor del icono enfocado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Entra en la valoración (en el valor marcado) o sale de ella. |
| <kbd>←</kbd> / <kbd>→</kbd> (<kbd>↑</kbd> / <kbd>↓</kbd>) | Pasa al valor anterior / siguiente y lo selecciona. |
