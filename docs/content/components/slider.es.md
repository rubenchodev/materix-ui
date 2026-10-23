---
title: "Slider"
description: "Permite elegir un valor o un rango deslizando sobre una pista, basado en inputs range nativos accesibles."
group: "inputs"
icon: "tune"
weight: 57
example: "slider"
mui: "https://mui.com/material-ui/react-slider/"
---

**Slider** permite seleccionar un valor (o un rango) dentro de una escala continua o por pasos: volumen, brillo, filtros de precio, temperaturas. Como en MUI, cada thumb se apoya en un `<input type="range">` nativo visualmente oculto, así que el teclado, los lectores de pantalla y el envío de formularios funcionan sin código adicional. Para un número exacto que el usuario deba escribir, usa un [Text Field](../text-field/) con `type="number"`; para pocas opciones discretas, un grupo de [Toggle Button](../toggle-button/) o [Radio](../radio/).

## Uso básico

Un único `<input type="range" data-mtx="slider">` genera rail, track, thumb y value label. `min`, `max`, `step`, `value` y `name` se conservan en el input nativo, y `data-label` da el nombre accesible.

{{< mtx-demo title="Uso básico" layout="column" >}}
<input type="range" data-mtx="slider" name="volume" min="0" max="100" value="30" data-label="Volumen">
{{< /mtx-demo >}}

## Tamaños

Dos tamaños, como en MUI: medium (rail de 4px, thumb de 20px) y small (rail de 2px, thumb de 12px sin sombra).

{{< mtx-demo title="Tamaños" layout="column" >}}
<input type="range" data-mtx="slider" value="50" data-value-label-display="auto" data-label="Slider mediano">
<input type="range" data-mtx="slider" value="50" data-size="small" data-value-label-display="auto" data-label="Slider pequeño">
{{< /mtx-demo >}}

## Con iconos

El slider ocupa el ancho disponible, así que los iconos decorativos se colocan a su lado dentro de un [Stack](../stack/) horizontal (patrón "Volumen" de MUI).

{{< mtx-demo title="Iconos en ambos extremos" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="2" data-align="center">
  <span class="material-icons mtx-color-text-secondary" aria-hidden="true">volume_down</span>
  <input type="range" data-mtx="slider" value="60" data-label="Volumen">
  <span class="material-icons mtx-color-text-secondary" aria-hidden="true">volume_up</span>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` admite la paleta MUI: `primary`, `secondary`, `error`, `warning`, `info` y `success`.

{{< mtx-demo title="Colores" layout="column" >}}
<input type="range" data-mtx="slider" value="60" data-label="Primary">
<input type="range" data-mtx="slider" value="60" data-color="secondary" data-label="Secondary">
<input type="range" data-mtx="slider" value="60" data-color="error" data-label="Error">
<input type="range" data-mtx="slider" value="60" data-color="warning" data-label="Warning">
<input type="range" data-mtx="slider" value="60" data-color="info" data-label="Info">
<input type="range" data-mtx="slider" value="60" data-color="success" data-label="Success">
{{< /mtx-demo >}}

## Estados

Al pasar el cursor sobre el thumb aparece un halo de 8px, el foco de teclado muestra el mismo halo y al arrastrar crece a 14px (pressed). `data-disabled` pinta el slider en gris y bloquea la interacción.

{{< mtx-demo title="Habilitado y deshabilitado" layout="column" >}}
<input type="range" data-mtx="slider" value="35" data-value-label-display="auto" data-label="Habilitado">
<input type="range" data-mtx="slider" value="35" data-disabled data-label="Deshabilitado">
<input type="range" data-mtx="slider" data-range data-value="20,70" data-disabled data-label="Rango deshabilitado">
{{< /mtx-demo >}}

## Value label

La etiqueta de valor es un globo en forma de gota de Material Design 2. `data-value-label-display` puede ser `off` (predeterminado), `auto` (en hover, foco y arrastre) u `on` (siempre visible). `data-value-label-format` sustituye `{value}` por el número localizado y también se usa como `aria-valuetext`.

{{< mtx-demo title="Value label" layout="column" >}}
<div class="mtx-pt-5">
  <input type="range" data-mtx="slider" value="30" data-value-label-display="auto" data-label="Etiqueta auto">
</div>
<div class="mtx-pt-5">
  <input type="range" data-mtx="slider" min="-10" max="40" value="21" data-value-label-display="on" data-value-label-format="{value} °C" data-label="Temperatura">
</div>
{{< /mtx-demo >}}

## Marcas

`data-marks="true"` añade una marca en cada `step`; una lista `"valor:etiqueta,…"` añade marcas con texto (también se admite un array JSON `[{"value":0,"label":"0 °C"}]`). Con `data-marks-only` el valor solo puede caer en una marca, como `step={null}` en MUI.

{{< mtx-demo title="Marcas" layout="column" >}}
<input type="range" data-mtx="slider" value="30" step="10" data-marks="true" data-value-label-display="auto" data-label="Pasos de 10">
<input type="range" data-mtx="slider" value="20" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-value-label-display="auto" data-value-label-format="{value} °C" data-label="Temperatura con marcas">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-marks-only data-value-label-display="auto" data-value-label-format="{value} °C" data-label="Temperatura restringida">
{{< /mtx-demo >}}

## Etiquetas de marcas en los extremos

Como en MUI, cada etiqueta se centra en su marca, así que las de `min` y `max` sobresalen del rail la mitad de su ancho. En contenedores estrechos (tarjetas, paneles laterales, móviles de 390px) añade `data-marks-inset`: la primera etiqueta se alinea al inicio del rail y la última al final (abajo/arriba en vertical, en espejo en RTL), y las intermedias siguen centradas.

{{< mtx-demo title="Etiquetas de marcas en los extremos" layout="column" >}}
<div data-mtx="container" data-max-width="xs" data-disable-gutters>
<div data-mtx="card" data-variant="outlined">
<div data-mtx="card-content">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="Temperatura, etiquetas centradas">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-marks-inset data-label="Temperatura, etiquetas hacia dentro">
<input type="range" data-mtx="slider" value="2" min="1" max="3" data-marks="1:Mínima,2:Media,3:Máxima" data-marks-only data-marks-inset data-label="Calidad">
</div>
</div>
</div>
{{< /mtx-demo >}}

## Rango

`data-range` con `data-value="20,60"` crea dos thumbs, cada uno con su input nativo llamado `{name}-start` y `{name}-end` y etiquetado "Mínimo" / "Máximo". Cuando los thumbs se cruzan se intercambian, como en MUI; `data-disable-swap` los bloquea y `data-min-distance` impone una separación mínima.

{{< mtx-demo title="Rango" layout="column" >}}
<input type="range" data-mtx="slider" name="price" data-range data-value="20,60" data-value-label-display="auto" data-label="Precio">
<input type="range" data-mtx="slider" data-range data-value="30,50" data-disable-swap data-value-label-display="auto" data-label="Sin intercambio">
<input type="range" data-mtx="slider" data-range data-value="30,50" data-min-distance="10" data-value-label-display="auto" data-label="Distancia mínima">
{{< /mtx-demo >}}

{{< callout type="info" title="Envío de formularios" >}}
Un slider de rango envía dos campos: `price-start` y `price-end` para `name="price"`. En la sintaxis BEM completa escribes tú los dos inputs y se conservan sus nombres.
{{< /callout >}}

## Track

`data-track` puede ser `normal` (predeterminado), `inverted` (resalta la parte posterior al valor) o `false` (sin track, útil con marcas).

{{< mtx-demo title="Track" layout="column" >}}
<input type="range" data-mtx="slider" value="30" data-track="inverted" data-marks="0:0,25:25,50:50,75:75,100:100" data-label="Track invertido">
<input type="range" data-mtx="slider" value="37" data-track="false" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="Sin track">
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` crece de abajo arriba (200px por defecto; ajustable con `--mtx-slider-vertical-length`). El input nativo recibe `aria-orientation="vertical"`.

{{< mtx-demo title="Vertical" >}}
<input type="range" data-mtx="slider" data-orientation="vertical" value="30" data-value-label-display="auto" data-label="Vertical">
<input type="range" data-mtx="slider" data-orientation="vertical" data-range data-value="20,70" data-value-label-display="auto" data-label="Rango vertical">
<input type="range" data-mtx="slider" data-orientation="vertical" value="37" data-color="secondary" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="Temperatura vertical">
{{< /mtx-demo >}}

## Derecha a izquierda

Dentro de un contenedor `dir="rtl"` el valor crece de derecha a izquierda y la flecha izquierda lo incrementa.

{{< mtx-demo title="RTL" layout="column" >}}
<div dir="rtl">
  <input type="range" data-mtx="slider" value="30" data-marks="0:0,50:50,100:100" data-value-label-display="auto" data-label="Slider RTL">
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Un filtro de precio que actualiza un resumen mientras se arrastra (`mtx:slider:input`) y envía ambos inputs nativos.

{{< mtx-demo title="Filtro de precio" layout="column" >}}
<form class="mtx-d-flex mtx-flex-column mtx-gap-2" id="doc-slider-filter-form" aria-label="Filtro de productos">
  <span class="mtx-typography--subtitle2" id="doc-slider-filter-label">Precio (USD)</span>
  <input type="range" data-mtx="slider" id="doc-slider-filter" name="price" min="0" max="1000" step="10" data-range data-value="200,700" data-min-distance="50" data-value-label-display="auto" data-value-label-format="${value}" aria-labelledby="doc-slider-filter-label">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span class="mtx-typography--body2" id="doc-slider-filter-range" aria-live="polite">$200 – $700</span>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Aplicar filtro</button>
  </div>
</form>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-slider-filter');
  var slider = Materix.init(el);
  var text = document.getElementById('doc-slider-filter-range');
  var form = document.getElementById('doc-slider-filter-form');
  slider.element.addEventListener('mtx:slider:input', function (event) {
    text.textContent = '$' + event.detail.value[0] + ' – $' + event.detail.value[1];
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(form);
    text.textContent = 'Aplicado: price-start=' + data.get('price-start') + ', price-end=' + data.get('price-end');
  });
});
</script>

## Sintaxis BEM completa

Para SSR se puede escribir la estructura completa: contenedor `.mtx-slider`, rail, track y un `.mtx-slider__thumb` por input (dos en un rango). La librería reutiliza los nodos y añade los value labels y las marcas que falten.

```html
<span class="mtx-slider" data-mtx="slider" data-value-label-display="auto">
  <span class="mtx-slider__rail"></span>
  <span class="mtx-slider__track"></span>
  <span class="mtx-slider__thumb">
    <input type="range" class="mtx-slider__input" name="brightness" min="0" max="10" value="4" aria-label="Brillo">
  </span>
</span>
```

## Uso programático

`Materix.getInstance(el)` funciona con el input original o con el contenedor `.mtx-slider` generado. `value` es un número (o `[inicio, fin]` en modo rango) y se puede fijar sin emitir eventos.

```javascript
const input = document.querySelector('#volume');
const slider = Materix.getInstance(input);

console.log(slider.value);   // 30
slider.value = 75;           // se redondea al step y se acota a [min, max]
slider.max = 200;            // los setters min / max / step re-acotan el valor

slider.element.addEventListener('mtx:slider:input', (event) => {
  console.log('Arrastrando:', event.detail.value);
});
slider.element.addEventListener('mtx:slider:change', (event) => {
  console.log('Confirmado:', event.detail.value);
});

slider.disable();
slider.enable();
slider.focus(1);             // enfoca el segundo thumb de un rango
slider.destroy();            // retira listeners y restaura el <input> original
```

Con ES modules:

```javascript
import { Slider } from '@rubenchodev/materix-ui';
const price = new Slider(document.querySelector('#price'));
price.value = [100, 400];
```

{{< mtx-demo title="value y eventos" layout="column" >}}
<input type="range" data-mtx="slider" id="doc-slider" value="40" data-value-label-display="auto" data-label="Slider controlado">
<div class="mtx-d-flex mtx-gap-1 mtx-flex-wrap">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-set">slider.value = 75</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-disable">disable()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-enable">enable()</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-slider');
  var slider = Materix.init(el);
  var status = el.closest('.doc-demo') && el.closest('.doc-demo').querySelector('.doc-demo-status');
  function show(message) { if (status) status.textContent = message; }
  slider.element.addEventListener('mtx:slider:input', function (event) { show('mtx:slider:input → ' + event.detail.value); });
  slider.element.addEventListener('mtx:slider:change', function (event) { show('mtx:slider:change → ' + event.detail.value); });
  document.getElementById('doc-slider-set').addEventListener('click', function () { slider.value = 75; show('value = ' + slider.value); });
  document.getElementById('doc-slider-disable').addEventListener('click', function () { slider.disable(); show('deshabilitado'); });
  document.getElementById('doc-slider-enable').addEventListener('click', function () { slider.enable(); show('habilitado'); });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `slider` | — | Inicialización (en el `<input type="range">` o en un contenedor `.mtx-slider`). |
| `min`, `max`, `step` (o `data-min`, `data-max`, `data-step`) | número | `0`, `100`, `1` | Escala e incremento. Prevalecen los atributos nativos. |
| `value` / `data-value` | número, o `"inicio,fin"` en rango | punto medio (simple), `min,max` (rango) | Valor inicial, redondeado al step. |
| `data-label` | texto | — | Nombre accesible (`aria-label`); en rango antecede a "Mínimo" / "Máximo". |
| `data-size` | `small` \| `medium` | `medium` | Rail de 2px / 4px, thumb de 12px / 20px. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `primary` | Color de la paleta. |
| `data-orientation` | `horizontal` \| `vertical` | `horizontal` | Orientación. |
| `data-range` | booleano | — | Dos thumbs (`{name}-start` / `{name}-end`). |
| `data-disable-swap` | booleano | — | Rango: el thumb activo se detiene en el otro en lugar de intercambiarse. |
| `data-min-distance` | número | `0` | Rango: distancia mínima entre thumbs. |
| `data-marks` | `true` \| `"valor:etiqueta,…"` \| JSON | — | Marcas en cada step o en los valores indicados. |
| `data-marks-only` | booleano | — | Restringe los valores a las marcas (`step={null}` de MUI). |
| `data-marks-inset` | booleano | — | Mantiene dentro del rail las etiquetas de `min`/`max` (la primera alineada al inicio y la última al final). |
| `data-value-label-display` | `off` \| `auto` \| `on` | `off` | Visibilidad del value label. |
| `data-value-label-format` | texto con `{value}` | — | Formato de la etiqueta; también se usa como `aria-valuetext`. |
| `data-track` | `normal` \| `inverted` \| `false` | `normal` | Modo del track. |
| `data-disabled` (o `disabled`) | booleano | — | Deshabilita el slider. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-slider` | Contenedor raíz (generado alrededor del input). |
| `mtx-slider--small` | Tamaño pequeño. |
| `mtx-slider--secondary`, `--error`, `--warning`, `--info`, `--success` | Colores. |
| `mtx-slider--vertical` | Orientación vertical. |
| `mtx-slider--marked` | Tiene marcas con etiqueta (reserva espacio para ellas). |
| `mtx-slider--marks-inset` | Etiquetas de los extremos alineadas dentro del rail (`data-marks-inset`). |
| `mtx-slider--track-inverted`, `--track-false` | Modos del track. |
| `mtx-slider--label-off`, `--label-auto`, `--label-on` | Modo del value label. |
| `mtx-slider--dragging`, `--disabled` | Estados aplicados por el JS. |
| `mtx-slider__rail` | Pista completa (opacidad 38 %). |
| `mtx-slider__track` | Parte rellena de la pista. |
| `mtx-slider__thumb` | Thumb; `--active` durante el arrastre, `--focused` cuando su input tiene el foco. |
| `mtx-slider__input` | Input range nativo visualmente oculto. |
| `mtx-slider__value-label`, `__value-label-text` | Value label en forma de gota (`aria-hidden`). |
| `mtx-slider__mark`, `__mark--active` | Punto de marca; activo dentro del track. |
| `mtx-slider__mark-label`, `__mark-label--active` | Etiqueta de la marca. |
| `mtx-slider__mark-label--start`, `--end` | Etiquetas de las marcas en `min` y `max` (solo cambian la alineación con `--marks-inset`). |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `number \| number[]` | Valor actual (`[inicio, fin]` en rango). El setter acepta número, array o `"a,b"`, redondea, acota y no emite eventos. |
| `min`, `max`, `step` (get/set) | `number` | Escala; los setters actualizan los inputs, regeneran las marcas por step y re-acotan el valor. |
| `range`, `orientation`, `inputs` (propiedades) | `boolean` / `string` / `HTMLInputElement[]` | Leídas al iniciar. |
| `formatValue(value)` | `string` | Texto usado por el value label y `aria-valuetext`. |
| `disable()` / `enable()` / `disabled` | `void` / `boolean` | Estado deshabilitado. |
| `focus(index = 0)` | `void` | Enfoca un thumb. |
| `destroy()` | `void` | Retira listeners y, en la sintaxis de un solo elemento, restaura el `<input>` original. |

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:slider:input` (burbujea) | `{ value, activeThumb }` | El valor cambia durante el arrastre o con el teclado. |
| `mtx:slider:change` (burbujea) | `{ value }` | Se suelta el puntero con un valor nuevo, o tras un cambio con el teclado. No se emite al fijar `value` por código. |
| `input` / `change` (nativos, en el input activo) | — | Reflejan los anteriores para formularios y frameworks. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-slider-color`, `--mtx-slider-contrast` | Color principal y color del texto del value label (los fija `data-color`). |
| `--mtx-slider-thickness`, `--mtx-slider-thumb-size` | Grosor del rail y tamaño del thumb. |
| `--mtx-slider-halo` | Color del halo de hover/foco/pressed (alpha 16 %). |
| `--mtx-slider-vertical-length` | Altura del slider vertical (200px). |
| `--mtx-slider-label-size` | Tamaño mínimo del value label (32px). |
| `--mtx-slider-disabled-color` | Color deshabilitado (grey 400 / grey 600 en tema oscuro). |

## Accesibilidad

- Cada thumb es un `<input type="range">` nativo: el navegador expone `role="slider"`, `aria-valuemin`, `aria-valuemax` y `aria-valuenow`. Con `data-value-label-format` el componente añade `aria-valuetext` ("21 °C").
- Nómbralo con `data-label`, `aria-label` o `aria-labelledby`. En rango cada thumb recibe un nombre traducido: "Precio: Mínimo" / "Precio: Máximo" ("Price: Minimum" / "Price: Maximum" en inglés).
- Los sliders verticales fijan `aria-orientation="vertical"`. El value label y las marcas son decorativos (`aria-hidden`).
- El indicador de foco es el halo de 8px alrededor del thumb; las animaciones se desactivan con `prefers-reduced-motion`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Lleva el foco al thumb (cada thumb de un rango es una parada de tabulación). |
| <kbd>→</kbd> / <kbd>↑</kbd> | Incrementa un step (en RTL, <kbd>←</kbd> incrementa). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Decrementa un step. |
| <kbd>Re Pág</kbd> / <kbd>Av Pág</kbd> | Incrementa / decrementa un 10 % del rango. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Fija el mínimo / máximo. |
