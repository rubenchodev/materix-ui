---
title: "Rating"
description: "Valoración con estrellas para opinar sobre un producto o mostrar una puntuación media, accesible con radios nativos y teclado."
group: "inputs"
icon: "star_half"
weight: 55
example: "rating"
mui: "https://mui.com/material-ui/react-rating/"
---

**Rating** permite elegir una puntuación de 1 a N iconos (estrellas por defecto) o mostrar una media en modo solo lectura. Como en MUI, por debajo hay radios nativos ocultos con etiquetas ("3 estrellas"), así funciona con teclado, lectores de pantalla y formularios sin JavaScript extra. Para una escala numérica larga usa un [Select](../select/) o un campo numérico.

## Uso básico

Un único `<span data-mtx="rating">` genera cinco estrellas. `data-value` fija el valor inicial y `data-name` el `name` de los radios (se envía con el formulario). Un clic sobre el valor actual lo borra.

{{< mtx-demo title="Uso básico" >}}
<span data-mtx="rating" data-value="3" data-name="product-score" aria-label="Valoración del producto"></span>
{{< /mtx-demo >}}

## Precisión

`data-precision="0.5"` admite medias estrellas: cada estrella contiene dos radios y la mitad izquierda elige el valor x.5. También funcionan fracciones como `0.25`.

{{< mtx-demo title="Precisión" layout="column" >}}
<span data-mtx="rating" data-value="4" aria-label="Precisión entera"></span>
<span data-mtx="rating" data-value="2.5" data-precision="0.5" aria-label="Precisión de media estrella"></span>
{{< /mtx-demo >}}

## Tamaños

Tamaños de MUI con `data-size`: small 18px, medium 24px (predeterminado) y large 30px.

{{< callout type="info" title="Iconos y tamaño" >}}
Los iconos integrados (`star`, `star_border`, `star_outline`, `favorite`, `favorite_border`, `thumb_up`, `thumb_up_off_alt`, `circle`, `radio_button_unchecked`) se dibujan como **SVG**, que escala sin perder nitidez. Cualquier otro nombre usa el glifo de Material Icons a su tamaño nativo de 24px en todos los tamaños: nunca se fuerza su `font-size` (regla de iconografía de Materix).
{{< /callout >}}

{{< mtx-demo title="Tamaños" layout="column" >}}
<span data-mtx="rating" data-value="4" data-size="large" aria-label="Grande"></span>
<span data-mtx="rating" data-value="4" aria-label="Mediano"></span>
<span data-mtx="rating" data-value="4" data-size="small" aria-label="Pequeño"></span>
{{< /mtx-demo >}}

## Con iconos

`data-icon` (lleno) y `data-empty-icon` (vacío) aceptan nombres de Material Icons. Si solo indicas `data-icon`, el vacío usa el mismo icono en gris. El color se personaliza con `--mtx-rating-color`.

{{< mtx-demo title="Iconos personalizados" layout="column" >}}
<span data-mtx="rating" data-value="3" data-precision="0.5" data-icon="favorite" data-empty-icon="favorite_border" style="--mtx-rating-color: var(--mtx-color-error);" aria-label="Me gusta"></span>
<span data-mtx="rating" data-value="2" data-empty-icon="star" aria-label="Estrellas grises"></span>
<span data-mtx="rating" data-value="3" data-icon="thumb_up" data-empty-icon="thumb_up_off_alt" aria-label="Aprobación"></span>
{{< /mtx-demo >}}

## Estados

Al pasar el cursor se previsualiza el valor (la estrella activa crece 1.2×); con <kbd>Tab</kbd> y las flechas se cambia con un anillo de foco visible. `data-read-only` muestra una valoración fija y `data-disabled` la atenúa.

{{< mtx-demo title="Interactivo, solo lectura, deshabilitado y sin valor" layout="column" >}}
<span data-mtx="rating" data-value="2" aria-label="Interactivo"></span>
<span data-mtx="rating" data-value="3.5" data-precision="0.5" data-read-only></span>
<span data-mtx="rating" data-value="2" data-disabled aria-label="Deshabilitado"></span>
<span data-mtx="rating" aria-label="Sin valor"></span>
{{< /mtx-demo >}}

## Solo el seleccionado y máximo

`data-highlight-selected-only` resalta únicamente el icono elegido (escalas de satisfacción) y `data-max` cambia el número de iconos.

{{< mtx-demo title="data-highlight-selected-only y data-max" layout="column" >}}
<span data-mtx="rating" data-value="3" data-highlight-selected-only data-icon="circle" data-empty-icon="radio_button_unchecked" aria-label="Satisfacción"></span>
<span data-mtx="rating" data-value="7" data-max="10" data-size="small" aria-label="Puntuación sobre 10"></span>
{{< /mtx-demo >}}

## Feedback al pasar

`mtx:rating:active` informa del valor bajo el cursor (o `null` al salir) para mostrar un texto descriptivo, como el ejemplo *hover feedback* de MUI.

{{< mtx-demo title="Feedback al pasar" >}}
<span data-mtx="rating" data-value="2" data-precision="0.5" id="doc-rating-feedback" aria-label="Calidad"></span>
<span id="doc-rating-feedback-text"></span>
{{< /mtx-demo >}}

```javascript
const labels = { 0.5: 'Inútil', 1: 'Inútil+', 1.5: 'Pobre', 2: 'Pobre+', 2.5: 'Aceptable',
  3: 'Aceptable+', 3.5: 'Buena', 4: 'Buena+', 4.5: 'Excelente', 5: 'Excelente+' };
ratingEl.addEventListener('mtx:rating:active', (event) => {
  text.textContent = labels[event.detail.value ?? rating.value] ?? 'Sin valoración';
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var labels = { 0.5: 'Inútil', 1: 'Inútil+', 1.5: 'Pobre', 2: 'Pobre+', 2.5: 'Aceptable', 3: 'Aceptable+', 3.5: 'Buena', 4: 'Buena+', 4.5: 'Excelente', 5: 'Excelente+' };
  var el = document.getElementById('doc-rating-feedback');
  var rating = Materix.init(el);
  var text = document.getElementById('doc-rating-feedback-text');
  function show(value) { text.textContent = labels[value] || 'Sin valoración'; }
  show(rating.value);
  el.addEventListener('mtx:rating:active', function (event) { show(event.detail.value !== null ? event.detail.value : rating.value); });
  el.addEventListener('mtx:rating:change', function (event) { show(event.detail.value); });
});
</script>

## Casos de uso reales

Ficha de producto con la media en solo lectura y formulario de opinión que envía el valor como un radio más.

{{< mtx-demo title="Producto y opinión" layout="column" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-1">
  <span data-mtx="rating" data-value="4.5" data-precision="0.5" data-size="small" data-read-only></span>
  <span class="mtx-typography--body2 mtx-color-text-secondary">4,5 · 1.284 opiniones</span>
</div>
<form class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2" aria-label="Escribir opinión">
  <span class="mtx-typography--subtitle2" id="doc-review-label">Tu valoración</span>
  <span data-mtx="rating" data-name="review-score" aria-labelledby="doc-review-label"></span>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Enviar</button>
</form>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR puede escribirse la estructura generada: un `.mtx-rating__item` por icono con su radio oculto y su `<label>` con `data-rating-value`. La librería reutiliza los nodos y añade los iconos que falten.

```html
<span class="mtx-rating" data-mtx="rating" role="radiogroup" aria-label="Valoración">
  <span class="mtx-rating__item">
    <input class="mtx-rating__input" type="radio" name="score" id="score-1" value="1" />
    <label class="mtx-rating__label" for="score-1" data-rating-value="1">
      <span class="mtx-rating__visually-hidden">1 estrella</span>
    </label>
  </span>
  <!-- …un .mtx-rating__item por estrella… -->
  <input class="mtx-rating__input mtx-rating__input--empty" type="radio" name="score" id="score-empty" value="" />
  <label class="mtx-rating__visually-hidden" for="score-empty">Sin valoración</label>
</span>
```

## Uso programático

`Materix.getInstance(el)` devuelve el Rating: `value` (número o `null`) se lee y escribe sin emitir eventos y `mtx:rating:change` informa de los cambios del usuario.

```javascript
const ratingEl = document.querySelector('#score');
const rating = Materix.getInstance(ratingEl);

console.log(rating.value);  // 3
rating.value = 4.5;         // se redondea a data-precision; 0 o null lo vacía

ratingEl.addEventListener('mtx:rating:change', (event) => {
  console.log('Nueva valoración:', event.detail.value);
});

rating.disable();
rating.enable();
rating.focus();
```

Con módulos ES:

```javascript
import { init, getInstance, Rating } from 'materix-ui';
const rating = new Rating(document.querySelector('#score'));
```

{{< mtx-demo title="value y mtx:rating:change" >}}
<span data-mtx="rating" data-value="3" id="doc-rating" aria-label="Valoración controlada"></span>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-rating-set">rating.value = 5</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-rating-clear">rating.value = null</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-rating');
  var rating = Materix.init(el);
  var status = el.closest('.doc-demo').querySelector('.doc-demo-status');
  el.addEventListener('mtx:rating:change', function (event) {
    if (status) status.textContent = 'mtx:rating:change → ' + event.detail.value;
  });
  document.getElementById('doc-rating-set').addEventListener('click', function () {
    rating.value = 5;
    if (status) status.textContent = 'value = ' + rating.value;
  });
  document.getElementById('doc-rating-clear').addEventListener('click', function () {
    rating.value = null;
    if (status) status.textContent = 'value = ' + rating.value;
  });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `rating` | — | Inicialización. |
| `data-value` | número de 0 a `data-max` | — (sin valor) | Valor inicial; se redondea a la precisión. `0` = sin valoración. |
| `data-max` | entero | `5` | Número de iconos. |
| `data-precision` | `1` \| `0.5` (o fracciones de 1) | `1` | Paso mínimo. |
| `data-name` | texto | `mtx-rating-N` | `name` de los radios (envío de formularios). |
| `data-read-only` | booleano | — | Solo lectura: sin radios, `role="img"` y `aria-label` "Valoración: X de N". |
| `data-disabled` | booleano | — | Deshabilita los radios y atenúa el componente. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | Iconos SVG de 18 / 24 / 30px. |
| `data-icon` | nombre de Material Icons | `star` | Icono lleno. |
| `data-empty-icon` | nombre de Material Icons | `star_border` (o `data-icon` si se indicó) | Icono vacío. |
| `data-highlight-selected-only` | booleano | — | Resalta solo el icono seleccionado. |
| `data-label` | texto | — | Nombre accesible (`aria-label`). |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-rating` | Contenedor (inline-flex, color `#faaf00`). |
| `mtx-rating--small`, `--large` | Tamaños 18 y 30px. |
| `mtx-rating--read-only`, `--disabled` | Estados (el JS los aplica). |
| `mtx-rating--hovering` | Mientras se previsualiza con el cursor. |
| `mtx-rating__item` | Un icono; `--decimal` cuando la precisión es menor que 1; `--active` el ítem bajo el cursor (escala 1.2). |
| `mtx-rating__label` | `<label>` (o `<span>` en solo lectura) con `data-rating-value`; `--filled` lleno; `--partial` recorte de fracción. |
| `mtx-rating__icon`, `__icon--filled`, `__icon--empty` | Iconos lleno y vacío (se muestra uno según el estado). |
| `mtx-rating__input`, `__input--empty` | Radios nativos ocultos; el vacío representa "sin valoración". |
| `mtx-rating__visually-hidden` | Texto solo para lectores de pantalla. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `number \| null` | Valor actual; el setter redondea, acota y no emite eventos. |
| `max`, `precision`, `readOnly` (propiedades) | `number` / `boolean` | Configuración leída al iniciar. |
| `disable()` / `enable()` / `disabled` | `void` / `boolean` | Estado deshabilitado. |
| `focus()` | `void` | Enfoca el radio seleccionado (o el primero). |
| `destroy()` | `void` | Retira los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:rating:change` (burbujea) | `{ value: number \| null }` | El usuario cambia o borra la valoración. No se emite al asignar `value` por código. |
| `mtx:rating:active` (burbujea) | `{ value: number \| null }` | Cambia el valor bajo el cursor (`null` al salir). |
| `change` (nativo, en el radio) | — | El usuario marca un radio. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-rating-color` | Color de los iconos llenos (`#faaf00`). |
| `--mtx-rating-empty-color` | Color de los iconos vacíos (`--mtx-color-action-disabled`). |
| `--mtx-rating-icon-size` | Tamaño de los iconos SVG (18 / 24 / 30px). |
| `--mtx-disabled-opacity` | Opacidad del estado deshabilitado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |

## Accesibilidad

- Interactivo: radios nativos con el mismo `name`, cada uno con una etiqueta traducida ("1 estrella", "3 estrellas"; en inglés "3 Stars") y un radio "Sin valoración". El navegador gestiona la exclusión mutua y las flechas.
- Si el contenedor tiene nombre (`aria-label`, `aria-labelledby` o `data-label`) recibe `role="radiogroup"`.
- Solo lectura: `role="img"` con `aria-label` traducido ("Valoración: 4 de 5" / "Rated 4 out of 5"); los iconos son decorativos.
- El foco de teclado se marca con un anillo alrededor del icono enfocado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Entra en la valoración (en el valor marcado) o sale. |
| <kbd>→</kbd> / <kbd>↑</kbd> | Aumenta el valor un paso de precisión (invertido en RTL). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Disminuye el valor; tras el mínimo pasa a "Sin valoración". |
