---
title: "Progress"
description: "Indicadores circulares y lineales que comunican que una operación está en curso o cuánto falta para terminarla."
group: "feedback"
icon: "donut_large"
weight: 25
example: "progress"
mui: "https://mui.com/material-ui/react-progress/"
---

**Progress** agrupa los dos indicadores de MUI: **CircularProgress** (`data-mtx="circular-progress"`) y **LinearProgress** (`data-mtx="linear-progress"`). Úsalos para indicar que algo se está cargando o procesando: indeterminados cuando no sabes cuánto falta y determinados cuando conoces el porcentaje. No los uses para mostrar métricas estáticas que no avanzan (un gráfico o un texto son más claros) ni para bloquear toda la pantalla sin explicación (acompáñalos de un texto o usa [Dialog]({{< relref "/components/dialog" >}})).

## Uso básico

Un único elemento basta: el componente genera el SVG o las barras, `role="progressbar"` y el nombre accesible. Sin `data-value` el indicador es **indeterminado**; con `data-value` (0–100) pasa a **determinado**.

{{< mtx-demo title="Sintaxis simplificada" >}}
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-value="75"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Lineal" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="linear-progress"></div>
  <div data-mtx="linear-progress" data-value="40"></div>
</div>
{{< /mtx-demo >}}

## Variantes

### Circular

`indeterminate` gira mientras el trazo crece y se encoge (animación de MUI); `determinate` dibuja un arco proporcional al valor, empezando arriba. `data-disable-shrink` mantiene el trazo fijo y solo gira, útil cuando el hilo principal está muy cargado. `data-track` añade el anillo de fondo.

{{< mtx-demo title="Indeterminate, disable shrink, determinate y con pista" >}}
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-disable-shrink></div>
<div data-mtx="circular-progress" data-value="25"></div>
<div data-mtx="circular-progress" data-value="50"></div>
<div data-mtx="circular-progress" data-value="100"></div>
<div data-mtx="circular-progress" data-value="65" data-track></div>
{{< /mtx-demo >}}

### Lineal

Cuatro variantes como MUI: `indeterminate`, `determinate`, `buffer` (se deduce de `data-value-buffer`: muestra el valor, la parte ya precargada y un patrón punteado animado) y `query` (indeterminada en sentido inverso, para la fase previa a la carga). La barra mide 4 px; `data-rounded` redondea sus extremos.

{{< mtx-demo title="Variantes lineales" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="linear-progress"></div>
  <div data-mtx="linear-progress" data-value="60"></div>
  <div data-mtx="linear-progress" data-value="30" data-value-buffer="55"></div>
  <div data-mtx="linear-progress" data-variant="query"></div>
  <div data-mtx="linear-progress" data-value="70" data-rounded></div>
</div>
{{< /mtx-demo >}}

## Tamaños

`data-size` fija el diámetro en px (40 por defecto) y `data-thickness` el grosor del trazo dentro del viewBox de 44 unidades (3.6 por defecto). Para la barra lineal cambia la variable `--mtx-linear-progress-height`.

{{< mtx-demo title="16, 24, 40, 56 y 80 px" >}}
<div data-mtx="circular-progress" data-size="16"></div>
<div data-mtx="circular-progress" data-size="24"></div>
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-size="56"></div>
<div data-mtx="circular-progress" data-size="80" data-value="60"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Grosor 2, 3.6 y 6" >}}
<div data-mtx="circular-progress" data-thickness="2" data-value="70"></div>
<div data-mtx="circular-progress" data-value="70"></div>
<div data-mtx="circular-progress" data-thickness="6" data-value="70"></div>
{{< /mtx-demo >}}

## Con etiqueta

`data-show-label` muestra el porcentaje redondeado: centrado dentro del círculo (patrón «CircularProgress with label» de MUI) o a la derecha de la barra («LinearProgress with label»). La cifra es decorativa (`aria-hidden`); el lector de pantalla lee el valor de `aria-valuenow`.

{{< mtx-demo title="Porcentaje visible" >}}
<div data-mtx="circular-progress" data-value="10" data-show-label></div>
<div data-mtx="circular-progress" data-value="48" data-show-label data-track></div>
<div data-mtx="circular-progress" data-value="100" data-show-label data-color="success"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Barra con valor" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div data-mtx="linear-progress" data-value="35" data-show-label></div>
  <div data-mtx="linear-progress" data-value="82" data-show-label data-color="secondary"></div>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` acepta `primary` (por defecto), `secondary`, `error`, `warning`, `info`, `success` e `inherit` (usa el color de texto del contenedor). La pista lineal es el mismo color aclarado un 62 % en tema claro y oscurecido un 50 % en tema oscuro, como MUI.

{{< mtx-demo title="Paleta" >}}
<div data-mtx="circular-progress" data-color="primary"></div>
<div data-mtx="circular-progress" data-color="secondary"></div>
<div data-mtx="circular-progress" data-color="error"></div>
<div data-mtx="circular-progress" data-color="warning"></div>
<div data-mtx="circular-progress" data-color="info"></div>
<div data-mtx="circular-progress" data-color="success"></div>
<div class="mtx-color-text-secondary">
  <div data-mtx="circular-progress" data-color="inherit"></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Barras de color" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div data-mtx="linear-progress" data-value="50" data-color="secondary"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="error"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="warning"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="info"></div>
  <div data-mtx="linear-progress" data-color="success"></div>
</div>
{{< /mtx-demo >}}

## Escala propia

`data-min` y `data-max` (0 y 100 por defecto) permiten expresar el valor en tus unidades: `aria-valuenow` y `aria-valuemax` reflejan esas unidades y el componente calcula el porcentaje para dibujar.

{{< mtx-demo title="7 de 10 asientos" layout="block" >}}
<div data-mtx="stack" data-spacing="1">
  <span class="mtx-typography--body2" id="doc-progress-seats">Asientos del equipo · 7 de 10</span>
  <div data-mtx="linear-progress" data-max="10" data-value="7" data-rounded aria-labelledby="doc-progress-seats"></div>
</div>
{{< /mtx-demo >}}

## Estados

- **Cargando una región:** marca el contenedor que se actualiza con `aria-busy="true"` y quítalo al terminar; así los lectores de pantalla esperan al contenido final.
- **Botón en carga:** inserta un indicador decorativo con `Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true })`, pon `aria-busy="true"` y `disabled` en el botón y cambia su texto.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` el círculo gira más despacio sin encoger el trazo, las barras indeterminadas se ralentizan y el patrón de buffer se detiene.

{{< mtx-demo title="Región ocupada" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-2" aria-busy="true" aria-live="polite">
  <div data-mtx="circular-progress" data-size="24" data-label="Cargando comentarios"></div>
  <span class="mtx-typography--body2">Cargando comentarios…</span>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

### Subida de archivos

{{< mtx-demo title="Subida con buffer" layout="block" >}}
<div class="mtx-card" data-mtx="card">
  <div class="mtx-card__content">
    <div data-mtx="stack" data-spacing="1">
      <span class="mtx-typography--subtitle2">Subiendo 3 archivos</span>
      <div data-mtx="linear-progress" id="doc-progress-upload" data-value="0" data-value-buffer="10" data-show-label data-label="Subida de archivos"></div>
      <span class="mtx-typography--caption mtx-color-text-secondary" id="doc-progress-upload-status">Preparando…</span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-progress-upload');
  if (!el) return;
  var upload = Materix.getInstance(el);
  var status = document.getElementById('doc-progress-upload-status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setInterval(function () {
    var next = upload.value >= 100 ? 0 : upload.value + Math.round(Math.random() * 8);
    upload.setValue(Math.min(100, next));
    upload.setBuffer(Math.min(100, upload.value + 10 + Math.round(Math.random() * 10)));
    status.textContent = upload.value >= 100 ? 'Completado' : Math.round(upload.value) + ' % · 3 archivos';
  }, reduce ? 1500 : 600);
});
</script>

### Botón Guardar con indicador

{{< mtx-demo title="Botón en carga" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-progress-save">Guardar</button>
{{< /mtx-demo >}}

```javascript
const button = document.getElementById('doc-progress-save');
button.addEventListener('click', () => {
  const spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
  button.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = 'Guardando…';
  button.prepend(spinner);
  saveChanges().finally(() => {
    button.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = 'Guardar';
  });
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var save = document.getElementById('doc-progress-save');
  if (!save) return;
  save.addEventListener('click', function () {
    if (save.getAttribute('aria-busy') === 'true') return;
    var spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
    save.setAttribute('aria-busy', 'true');
    save.disabled = true;
    save.textContent = 'Guardando…';
    save.prepend(spinner);
    setTimeout(function () {
      save.removeAttribute('aria-busy');
      save.disabled = false;
      save.textContent = 'Guardar';
    }, 2000);
  });
});
</script>

## Sintaxis BEM completa

Para SSR puedes renderizar la estructura completa; el componente la reutiliza sin duplicar nodos y solo calcula el radio, el arco, las transformaciones y los atributos ARIA.

```html
<span class="mtx-circular-progress" data-mtx="circular-progress" data-value="60">
  <svg class="mtx-circular-progress__svg" viewBox="22 22 44 44" aria-hidden="true" focusable="false">
    <circle class="mtx-circular-progress__track"></circle>   <!-- opcional -->
    <circle class="mtx-circular-progress__circle"></circle>
  </svg>
  <span class="mtx-circular-progress__label"></span>          <!-- opcional -->
</span>

<div class="mtx-linear-progress" data-mtx="linear-progress" data-value="60">
  <span class="mtx-linear-progress__track">
    <span class="mtx-linear-progress__dashed"></span>
    <span class="mtx-linear-progress__bar mtx-linear-progress__bar1"></span>
    <span class="mtx-linear-progress__bar mtx-linear-progress__bar2"></span>
  </span>
  <span class="mtx-linear-progress__label"></span>            <!-- opcional -->
</div>
```

## Uso programático

Los elementos `[data-mtx="circular-progress"]` y `[data-mtx="linear-progress"]` se inicializan solos. Para contenido dinámico usa `Materix.init(el)` o las clases; `Materix.getInstance(el)` devuelve la instancia.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-value', '0');
container.append(el);
const linear = Materix.init(el, 'linear-progress');   // o: new Materix.LinearProgress(el)

linear.setValue(40);          // acota a [min, max] y actualiza aria-valuenow
linear.value += 10;           // getter/setter equivalente
linear.setBuffer(70);         // activa la variante buffer
linear.color = 'success';
linear.variant = 'indeterminate';

// Indicador circular listo para insertar (p. ej. en un botón)
const spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
```

```javascript
// ES modules
import { CircularProgress, createCircularProgress } from '@rubenchodev/materix-ui';

const circular = new CircularProgress(document.querySelector('#avance'));
circular.setValue(80);
```

{{< mtx-demo title="setValue(), color y variant" >}}
<div data-mtx="circular-progress" id="doc-progress-api-circular" data-value="30" data-show-label data-size="56"></div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-dec">-10</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-inc">+10</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-color">Cambiar color</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-indet">Indeterminado</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-progress-api-circular');
  if (!el) return;
  var p = Materix.getInstance(el);
  var colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
  var i = 0;
  document.getElementById('doc-progress-dec').addEventListener('click', function () { p.setValue(p.value - 10); });
  document.getElementById('doc-progress-inc').addEventListener('click', function () { p.setValue(p.value + 10); });
  document.getElementById('doc-progress-color').addEventListener('click', function () { i = (i + 1) % colors.length; p.color = colors[i]; });
  document.getElementById('doc-progress-indet').addEventListener('click', function () { p.variant = 'indeterminate'; });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `circular-progress` \| `linear-progress` | — | Inicializa el componente. |
| `data-variant` | circular: `indeterminate` \| `determinate`; lineal: además `buffer` \| `query` | deducida | Sin valor explícito: `buffer` si hay `data-value-buffer` (lineal), `determinate` si hay `data-value`, si no `indeterminate`. |
| `data-value` | número | `data-min` | Valor actual, acotado a `[data-min, data-max]`. |
| `data-value-buffer` | número | `data-max` | Solo lineal: valor del buffer. |
| `data-min` / `data-max` | número | `0` / `100` | Rango de la escala; se reflejan en `aria-valuemin` / `aria-valuemax`. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` \| `inherit` | `primary` | Color de la paleta. |
| `data-size` | número (px) | `40` | Solo circular: diámetro. |
| `data-thickness` | número | `3.6` | Solo circular: grosor del trazo (unidades del viewBox de 44). |
| `data-disable-shrink` | booleano (presencia) | ausente | Solo circular: desactiva el encogimiento del trazo. |
| `data-track` | booleano (presencia) | ausente | Solo circular: anillo de fondo `.mtx-circular-progress__track`. |
| `data-rounded` | booleano (presencia) | ausente | Solo lineal: extremos redondeados. |
| `data-show-label` | booleano (presencia) | ausente | Muestra el porcentaje redondeado (centrado o a la derecha). |
| `data-label` | texto | i18n `progress.loading` (`Loading` / `Cargando`) | Nombre accesible (`aria-label`). Se ignora si hay `aria-labelledby`; un `aria-label` propio se respeta. |
| `data-decorative` | booleano (presencia) | ausente | Quita `role` y `aria-*` y pone `aria-hidden="true"` (indicador dentro de un control que ya anuncia la carga). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-circular-progress` | Raíz circular (`inline-flex`, tamaño `--mtx-circular-progress-size`). |
| `.mtx-circular-progress--indeterminate` / `--determinate` | Variante activa. |
| `.mtx-circular-progress--disable-shrink` | Sin animación del trazo. |
| `.mtx-circular-progress--track` / `--with-label` | Con anillo de fondo / con etiqueta. |
| `.mtx-circular-progress--{color}` | Color de la paleta o `inherit`. |
| `.mtx-circular-progress__svg` | SVG (`viewBox="22 22 44 44"`), gira en indeterminate. |
| `.mtx-circular-progress__circle` | Arco de progreso (`stroke: currentColor`). |
| `.mtx-circular-progress__track` | Anillo de fondo (`--mtx-color-action-selected`). |
| `.mtx-circular-progress__label` | Porcentaje centrado (caption, `text-secondary`). |
| `.mtx-linear-progress` | Raíz lineal (bloque de ancho completo). |
| `.mtx-linear-progress--indeterminate` / `--determinate` / `--buffer` / `--query` | Variante activa. |
| `.mtx-linear-progress--rounded` / `--with-label` | Extremos redondeados / con etiqueta (flex). |
| `.mtx-linear-progress--{color}` | Color de la paleta o `inherit`. |
| `.mtx-linear-progress__track` | Pista de 4 px con `overflow: hidden`. |
| `.mtx-linear-progress__bar` / `__bar1` / `__bar2` | Barras: valor (1) y buffer o segunda barra indeterminada (2). |
| `.mtx-linear-progress__dashed` | Patrón punteado de la variante buffer. |
| `.mtx-linear-progress__label` | Porcentaje a la derecha (body2, `text-secondary`). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `setValue(n)` | instancia | Fija el valor acotado; si la variante era `indeterminate`/`query` pasa a `determinate`. |
| `value` (get/set) | `number` | Valor actual en unidades de `[min, max]`. |
| `percent` (get) | `number` | Valor en porcentaje 0–100. |
| `variant` (get/set) | `string` | Variante actual; los valores no admitidos se ignoran. |
| `color` (get/set) | `string` | Color de la paleta; un valor no válido aplica `primary`. |
| `size` (get, circular) | `number` | Diámetro en px. |
| `setBuffer(n)` (lineal) | instancia | Fija el buffer y activa la variante `buffer`. |
| `valueBuffer` (get/set, lineal) | `number` | Valor del buffer. |
| `Materix.createCircularProgress(options)` | `HTMLElement` | Crea un `<span>` circular ya inicializado. Opciones: `size` (40), `thickness` (3.6), `color` (`primary`), `value`, `label`, `decorative` (false), `disableShrink` (false), `className`, `tagName` (`span`). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-{color}` | Color del arco y de la barra. |
| `--mtx-circular-progress-size` | Diámetro (lo fija `data-size`). |
| `--mtx-circular-progress-duration` | Duración del giro (1.4 s; 4 s con movimiento reducido). |
| `--mtx-linear-progress-height` | Altura de la barra (4 px). |
| `--mtx-linear-progress-radius` | Radio de la barra (0; mitad de la altura con `data-rounded`). |
| `--mtx-linear-progress-duration` | Duración de la animación indeterminada (2.1 s; 6 s con movimiento reducido). |
| `--mtx-progress-track-mix` / `--mtx-progress-track-amount` | Mezcla de la pista: 38 % del color con `#fff` (claro) o 50 % con `#000` (oscuro). |
| `--mtx-color-action-selected` | Anillo de fondo de `data-track`. |

## Accesibilidad

- La raíz recibe `role="progressbar"` y un nombre accesible: `data-label`, `aria-label` o `aria-labelledby`; si no hay ninguno, i18n `progress.loading` («Loading» / «Cargando» según el idioma del documento o `data-locale`).
- `aria-valuenow`, `aria-valuemin` y `aria-valuemax` solo se exponen en `determinate` y `buffer`; en `indeterminate` y `query` se eliminan, como indica WAI-ARIA.
- El SVG y la etiqueta de porcentaje llevan `aria-hidden="true"`: el valor se anuncia una sola vez.
- Marca la región que se está cargando con `aria-busy="true"` y, si quieres anunciar el resultado, con `aria-live="polite"`.
- Dentro de un botón u otro control que ya comunica la carga (`aria-busy`, texto «Guardando…»), usa `data-decorative` o `createCircularProgress({ decorative: true })` para no duplicar el anuncio.
- Respeta `prefers-reduced-motion`: giro más lento sin encogimiento, barras más lentas y patrón de buffer estático.
- No es interactivo: no recibe foco ni responde al teclado.
