---
title: "Autocomplete"
description: "Campo de texto con sugerencias filtrables: selección única o múltiple con chips, valores libres, grupos y carga asíncrona."
group: "inputs"
icon: "manage_search"
weight: 95
example: "autocomplete"
mui: "https://mui.com/material-ui/react-autocomplete/"
---

`Autocomplete` es un campo de texto enriquecido con una lista de sugerencias: el usuario escribe, la lista se filtra (sin distinguir mayúsculas ni tildes) y elige con el ratón o el teclado. Sigue el patrón WAI-ARIA 1.2 **combobox con listbox**. Úsalo cuando la lista es larga y buscar es más rápido que desplazarse, cuando los valores vienen de un servidor o cuando se admiten valores libres. Para listas cortas sin búsqueda usa [Select](../select/) o [NativeSelect](../native-select/); para texto libre sin sugerencias, [TextField](../text-field/).

{{< callout type="info" title="¿Select, NativeSelect o Autocomplete?" >}}
| Necesidad | NativeSelect | Select | Autocomplete |
| :--- | :--- | :--- | :--- |
| Lista corta (≤ 10 opciones), prioridad móvil | La mejor opción | Bien | Excesivo |
| Escribir para filtrar (sin tildes ni mayúsculas) | No | Caja de búsqueda dentro del menú (`data-search`) | Sí, en el propio campo |
| Listas largas (países, usuarios, productos) | Mala | Aceptable con búsqueda | La mejor opción |
| Selección múltiple | Lista nativa (Ctrl/Cmd) | Casillas y «Seleccionar todo» | Chips eliminables |
| Valores fuera de la lista | No | No | Sí (`data-free-solo`) |
| Opciones cargadas del servidor al escribir | No | No | Sí (`mtx:autocomplete:input` + `setOptions()`) |
| Valor del formulario | `<select>` nativo | `<select>` nativo (oculto) | Inputs ocultos con `name` |

Regla práctica: **NativeSelect** para formularios simples, **Select** para elegir de una lista conocida con estética MUI, **Autocomplete** cuando el usuario necesita *buscar* o *escribir*.
{{< /callout >}}

## Uso básico

Un único `<input>` con `data-mtx="autocomplete"`, `data-label` y `data-options` apuntando a un `<datalist>`. El JavaScript construye el TextField, los botones, el listbox y el input oculto que envía el `value` de la opción con el `name` del campo.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<input data-mtx="autocomplete" data-label="País" data-options="#doc-ac-countries" name="country">
<datalist id="doc-ac-countries">
  <option value="ar">Argentina</option>
  <option value="br">Brasil</option>
  <option value="cl">Chile</option>
  <option value="co">Colombia</option>
  <option value="mx">México</option>
  <option value="pe">Perú</option>
  <option value="es">España</option>
  <option value="uy">Uruguay</option>
</datalist>
{{< /mtx-demo >}}

Fuentes de opciones, por orden de prioridad:

- Un `<select data-mtx="autocomplete">` con `<option>` y `<optgroup>` (se sustituye por el campo; las opciones `selected` son el valor inicial y `multiple` activa la selección múltiple).
- `data-options="#id"`: selector de un `<datalist>` (o `<select>`) en cualquier parte de la página.
- `data-options='[...]'`: JSON con textos u objetos `{value, label, group, disabled, icon, description}`.
- El atributo nativo `list="id"` del `<input>` (se retira para que el navegador no muestre su propio desplegable).
- El método `setOptions()`, para datos cargados en tiempo de ejecución.

## Variantes

Las mismas de TextField con `data-variant`: `outlined` (predeterminada), `filled` y `standard`.

{{< mtx-demo title="Variantes" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Outlined" data-options='["Bogotá","Lima","Madrid","Ciudad de México","Santiago"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Filled" data-variant="filled" data-options='["Bogotá","Lima","Madrid","Ciudad de México","Santiago"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Standard" data-variant="standard" data-options='["Bogotá","Lima","Madrid","Ciudad de México","Santiago"]'>
  </div>
</div>
{{< /mtx-demo >}}

## Tamaños

Medium 56px (predeterminado) y small 40px con `data-size="small"`, las mismas alturas que TextField, Select y un Button medium. El campo crece en altura cuando los chips ocupan varias líneas.

{{< mtx-demo title="Medium 56px y small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Medium · 56px" data-options='["Diseño","Ingeniería","Marketing","Ventas"]' data-value="Diseño">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Small · 40px" data-size="small" data-options='["Diseño","Ingeniería","Marketing","Ventas"]' data-value="Ventas">
  </div>
</div>
{{< /mtx-demo >}}

## Con iconos

`data-start-icon` añade un icono inicial (el label se alinea con el texto). En cada opción, `data-icon` muestra un icono de Material y `data-description` una línea secundaria. La flecha final es el indicador de apertura y la ✕ (visible al pasar el cursor o con foco) es el botón limpiar.

{{< mtx-demo title="Icono inicial, iconos y descripciones" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Buscar película" data-start-icon="search" data-options="#doc-ac-films">
    <datalist id="doc-ac-films">
      <option value="godfather" data-description="1972">El padrino</option>
      <option value="dark-knight" data-description="2008">El caballero oscuro</option>
      <option value="pulp-fiction" data-description="1994">Pulp Fiction</option>
      <option value="matrix" data-description="1999">Matrix</option>
    </datalist>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="autocomplete" data-label="Acción">
      <option value="edit" data-icon="edit" data-description="Modifica el documento">Editar</option>
      <option value="share" data-icon="share" data-description="Envía un enlace">Compartir</option>
      <option value="archive" data-icon="archive" data-description="Lo oculta de la bandeja">Archivar</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Colores

`data-color` cambia el color de foco del campo (como en TextField) y el fondo de las opciones seleccionadas: `primary` (predeterminado), `secondary`, `success`, `warning`, `info`.

{{< mtx-demo title="Colores" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Primary" data-options='["Alfa","Beta","Gamma"]' data-value="Beta">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Secondary" data-color="secondary" data-options='["Alfa","Beta","Gamma"]' data-value="Beta">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Success" data-color="success" data-options='["Alfa","Beta","Gamma"]' data-value="Beta">
  </div>
</div>
{{< /mtx-demo >}}

## Estados

`disabled`, `readonly`, `required`, `data-error` con `data-helper-text`, `data-loading` (CircularProgress en el campo y «Cargando…» en la lista) y el mensaje «Sin opciones» (personalizable con `data-no-options-text`).

{{< mtx-demo title="Estados" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Deshabilitado" data-options='["Alfa","Beta"]' data-value="Alfa" disabled>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Solo lectura" data-options='["Alfa","Beta"]' data-value="Beta" readonly>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Requerido" data-options='["Alfa","Beta"]' required>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Error" data-options='["Alfa","Beta"]' data-error="Elige una opción de la lista">
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Cargando" data-loading>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <input data-mtx="autocomplete" data-label="Sin opciones" data-options="[]" data-no-options-text="Aún no hay nada">
  </div>
</div>
{{< /mtx-demo >}}

## Agrupación

Con un `<select>` como fuente, cada `<optgroup>` es un grupo con subheader fijo. En un `<datalist>` o JSON usa `data-group` / `group` en cada opción; se agrupan las opciones consecutivas con el mismo grupo (ordénalas antes, como en MUI). Las opciones `disabled` se muestran atenuadas y el teclado las salta.

{{< mtx-demo title="Grupos y opciones deshabilitadas" layout="block" >}}
<select data-mtx="autocomplete" data-label="Zona horaria" name="tz">
  <optgroup label="América">
    <option value="America/Bogota">Bogotá (GMT-5)</option>
    <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
    <option value="America/Santiago">Santiago (GMT-4)</option>
  </optgroup>
  <optgroup label="Europa">
    <option value="Europe/Madrid">Madrid (GMT+1)</option>
    <option value="Europe/Paris" disabled>París (no disponible)</option>
  </optgroup>
</select>
{{< /mtx-demo >}}

## Valores múltiples

`data-multiple` muestra cada valor como un [Chip](../chip/) eliminable: con un clic en su icono de borrar, con <kbd>Retroceso</kbd> y el campo vacío, o con <kbd>←</kbd>/<kbd>→</kbd> para moverse entre chips y <kbd>Retroceso</kbd>/<kbd>Supr</kbd> sobre el chip enfocado. `data-limit-tags="N"` muestra solo N chips mientras el campo no tiene foco (más «+X»); `data-disable-close-on-select` mantiene la lista abierta; `data-filter-selected-options` oculta las opciones ya elegidas.

{{< mtx-demo title="Chips, límite y lista abierta" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Habilidades" data-multiple data-disable-close-on-select data-options="#doc-ac-skills" data-value="js,css" name="skills">
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Habilidades (límite 2)" data-multiple data-limit-tags="2" data-options="#doc-ac-skills" data-value="html,css,js,ts">
  </div>
</div>
<datalist id="doc-ac-skills">
  <option value="html" data-group="Frontend">HTML</option>
  <option value="css" data-group="Frontend">CSS</option>
  <option value="js" data-group="Frontend">JavaScript</option>
  <option value="ts" data-group="Frontend">TypeScript</option>
  <option value="node" data-group="Backend">Node.js</option>
  <option value="python" data-group="Backend">Python</option>
</datalist>
{{< /mtx-demo >}}

## Free solo

`data-free-solo` acepta valores que no están en la lista (cajas de búsqueda, etiquetas libres). <kbd>Enter</kbd> confirma el texto; en selección única el texto también se confirma al salir del campo, para que se envíe con el formulario. Si el texto coincide con la etiqueta de una opción, se usa esa opción. El indicador de apertura se oculta (fuérzalo con `data-force-popup-icon`) y no se muestra «Sin opciones».

{{< mtx-demo title="Valores libres" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Buscar" data-free-solo data-start-icon="search" data-options='["materix ui","material design","mui autocomplete"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <input data-mtx="autocomplete" data-label="Palabras clave" data-free-solo data-multiple data-options='["vanilla","css","a11y"]' data-value="vanilla">
  </div>
</div>
{{< /mtx-demo >}}

## Opciones de comportamiento

| Atributo | Efecto (equivalente MUI) |
| :--- | :--- |
| `data-auto-highlight` | Activa la primera opción al filtrar (`autoHighlight`). |
| `data-auto-select` | <kbd>Tab</kbd> o salir del campo selecciona la opción activa (`autoSelect`). |
| `data-clear-on-escape` | <kbd>Esc</kbd> con la lista cerrada limpia el valor (`clearOnEscape`). |
| `data-open-on-focus` | Abre la lista al recibir el foco (`openOnFocus`). |
| `data-disable-clearable` | Sin botón limpiar; borrar el texto no borra el valor (`disableClearable`). |
| `data-match-from="start"` | Solo opciones que **empiezan** por el texto (`createFilterOptions({ matchFrom: 'start' })`). |
| `data-filter="false"` | No filtra en local: decide el servidor (`filterOptions={(x) => x}`). |

{{< mtx-demo title="auto-highlight + auto-select y clear-on-escape" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Escribe y pulsa Tab" data-auto-highlight data-auto-select data-options='["Manzana","Banano","Cereza","Uva","Mango"]'>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <input data-mtx="autocomplete" data-label="Esc limpia" data-clear-on-escape data-options='["Manzana","Banano","Cereza"]' data-value="Cereza">
  </div>
</div>
{{< /mtx-demo >}}

## Carga asíncrona

Para buscar en un servidor, escucha `mtx:autocomplete:input` (se emite al escribir con `{inputValue, reason}`), activa `loading`, pide los datos y llama a `setOptions()`. `data-debounce="300"` retrasa el evento `input` hasta que el usuario deja de escribir 300 ms (no hace falta un debounce propio) y `data-filter="false"` evita filtrar en local lo que el servidor ya filtró. Descarta respuestas obsoletas comparándolas con la última búsqueda.

{{< mtx-demo title="Búsqueda remota (simulada, 800 ms)" layout="block" >}}
<input id="doc-ac-async" data-mtx="autocomplete" data-label="Repositorio" data-start-icon="search" data-debounce="300" data-filter="false" name="repo">
{{< /mtx-demo >}}

```javascript
const field = document.getElementById('doc-ac-async');
const ac = Materix.getInstance(field);
let latest = '';

ac.element.addEventListener('mtx:autocomplete:input', async (event) => {
  if (event.detail.reason !== 'input') return;   // ignora 'reset' y 'clear'
  const query = event.detail.inputValue.trim();
  latest = query;
  if (!query) { ac.setOptions([]); return; }
  ac.loading = true;
  const response = await fetch(`/api/repos?q=${encodeURIComponent(query)}`);
  const repos = await response.json();
  if (query !== latest) return;                   // respuesta obsoleta
  ac.setOptions(repos.map((r) => ({ value: r.id, label: r.name, description: r.stars + ' estrellas' })));
  ac.loading = false;
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const field = document.getElementById('doc-ac-async');
  if (!field || !window.Materix) return;
  const ac = Materix.getInstance(field);
  if (!ac) return;
  const repos = ['materix-ui', 'material-ui', 'mui-x', 'vite', 'vitest', 'hugo', 'react', 'vue', 'svelte', 'lit', 'preact', 'htmx'];
  let latest = '';
  ac.element.addEventListener('mtx:autocomplete:input', (event) => {
    if (event.detail.reason !== 'input') return;
    const query = event.detail.inputValue.trim().toLowerCase();
    latest = query;
    if (!query) { ac.setOptions([]); ac.loading = false; return; }
    ac.loading = true;
    setTimeout(() => {
      if (query !== latest) return;
      ac.setOptions(repos.filter((name) => name.includes(query)).map((name, i) => ({ value: name, label: name, description: (1200 - i * 57) + ' estrellas' })));
      ac.loading = false;
    }, 800);
  });
});
</script>

## Formularios

El `name` del campo pasa a inputs ocultos (el texto visible no se envía):

- **Selección única**: un `<input type="hidden">` con el `value` de la opción (vacío si no hay selección).
- **Selección múltiple**: un input oculto por valor con el mismo `name`, como `<select multiple>` (`FormData.getAll(name)`), o un único campo con los valores separados por comas con `data-value-format="csv"` (separador configurable con `data-separator`).

`required` usa la validación nativa: el campo es inválido mientras no hay valor y, si el usuario escribió un texto que no coincide con ninguna opción, muestra «Selecciona una opción de la lista.» (i18n). El `reset` del formulario restaura el valor inicial.

{{< mtx-demo title="Formulario con requerido, múltiple y CSV" layout="block" >}}
<form id="doc-ac-form" class="mtx-d-flex mtx-flex-column mtx-gap-2">
  <input data-mtx="autocomplete" data-label="País de residencia" name="country" required data-options='[{"value":"co","label":"Colombia"},{"value":"mx","label":"México"},{"value":"es","label":"España"}]'>
  <input data-mtx="autocomplete" data-label="Idiomas" name="languages" data-multiple data-value="es" data-options='[{"value":"es","label":"Español"},{"value":"en","label":"Inglés"},{"value":"pt","label":"Portugués"}]'>
  <input data-mtx="autocomplete" data-label="Intereses (CSV)" name="interests" data-multiple data-free-solo data-value-format="csv" data-options='["diseño","música","viajes"]'>
  <div class="mtx-d-flex mtx-gap-2">
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Enviar</button>
    <button class="mtx-button mtx-button--text" data-mtx="button" type="reset">Restablecer</button>
  </div>
  <output id="doc-ac-form-out">Aquí aparecerá el FormData</output>
</form>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('doc-ac-form');
  const out = document.getElementById('doc-ac-form-out');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    out.textContent = Array.from(new FormData(form)).map(([k, v]) => `${k}=${v}`).join('&');
  });
});
</script>

## Casos de uso reales

Un formulario de envíos con el país (único, requerido), las ciudades cubiertas (múltiple con límite) y una transportadora libre.

{{< mtx-demo title="Zona de envío" layout="block" >}}
<div data-mtx="paper" data-variant="outlined" class="mtx-p-3">
  <div data-mtx="grid" data-spacing="2">
    <div data-mtx="grid" data-xs="12" data-md="4">
      <select data-mtx="autocomplete" data-label="País" data-start-icon="public" name="ship-country" required>
        <option value="co">Colombia</option>
        <option value="mx">México</option>
        <option value="pe">Perú</option>
      </select>
    </div>
    <div data-mtx="grid" data-xs="12" data-md="8">
      <input data-mtx="autocomplete" data-label="Ciudades" data-multiple data-limit-tags="3" data-filter-selected-options name="ship-cities" data-options='["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga"]' data-value="Bogotá,Medellín">
    </div>
    <div data-mtx="grid" data-xs="12">
      <input data-mtx="autocomplete" data-label="Transportadora" data-free-solo data-helper-text="Elige una o escribe otra" data-options='["DHL","FedEx","UPS","Servientrega"]'>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino: contenedor `.mtx-autocomplete` con el TextField ya renderizado y un `<datalist>` interno. El componente reutiliza los nodos existentes y solo añade lo que falta (botones, listbox, inputs ocultos).

```html
<div class="mtx-autocomplete" data-mtx="autocomplete">
  <div class="mtx-text-field mtx-text-field--outlined">
    <label class="mtx-text-field__label" for="city">Ciudad</label>
    <div class="mtx-text-field__container">
      <input class="mtx-text-field__input" id="city" name="city">
    </div>
  </div>
  <datalist>
    <option value="bog">Bogotá</option>
    <option value="med">Medellín</option>
  </datalist>
</div>
```

Estructura generada (simplificada):

```html
<div class="mtx-autocomplete mtx-autocomplete--has-popup">
  <div class="mtx-text-field mtx-text-field--outlined mtx-autocomplete__field">
    <label class="mtx-text-field__label" id="city-label" for="city">Ciudad</label>
    <div class="mtx-text-field__container mtx-autocomplete__input-root">
      <!-- múltiple: <div class="mtx-autocomplete__tag mtx-chip">…</div> -->
      <input class="mtx-text-field__input mtx-autocomplete__input" id="city" role="combobox"
             aria-autocomplete="list" aria-expanded="false">
      <span class="mtx-autocomplete__end-adornment">
        <span class="mtx-autocomplete__loading-indicator" hidden></span>
        <button class="mtx-autocomplete__indicator mtx-autocomplete__clear-indicator" aria-label="Borrar" tabindex="-1"></button>
        <button class="mtx-autocomplete__indicator mtx-autocomplete__popup-indicator" aria-label="Abrir" tabindex="-1"></button>
      </span>
      <fieldset class="mtx-text-field__outline">…</fieldset>
    </div>
  </div>
  <span class="mtx-autocomplete__values" hidden><input type="hidden" name="city" value=""></span>
  <div class="mtx-autocomplete__live" role="status" aria-live="polite"></div>
</div>
<!-- En el portal mientras está abierto -->
<div class="mtx-autocomplete__popper">
  <div class="mtx-autocomplete__paper">
    <ul class="mtx-autocomplete__listbox" role="listbox" id="city-listbox">
      <li class="mtx-autocomplete__option" role="option" id="city-option-0" aria-selected="false">…</li>
    </ul>
    <div class="mtx-autocomplete__status" hidden></div>
  </div>
</div>
```

## Uso programático

```javascript
// Instancia existente (desde el <input> original, el input generado o el contenedor)
const ac = Materix.getInstance(document.querySelector('#country'));

// Elementos creados en tiempo de ejecución
const input = document.createElement('input');
input.dataset.label = 'Ciudad';
container.appendChild(input);
const city = new Materix.Autocomplete(input);   // o Materix.init(input, 'autocomplete')

city.setOptions([{ value: 'bog', label: 'Bogotá', group: 'Colombia' }, 'Lima']);
city.value = 'bog';             // no emite change
city.open();
city.close();
city.clear();                   // emite change con reason 'clear'
city.loading = true;            // o city.setLoading(true)
city.setError('Obligatorio');
city.element.addEventListener('mtx:autocomplete:change', (e) => console.log(e.detail));
city.destroy();
```

```javascript
import { Autocomplete, init, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="API en vivo" >}}
<div class="mtx-w-100">
  <input id="doc-ac-api" data-mtx="autocomplete" data-label="Película" data-options='[{"value":"alien","label":"Alien"},{"value":"matrix","label":"Matrix"},{"value":"up","label":"Up"}]'>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="value">value = 'matrix'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="clear">clear()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ac="toggle">disable() / enable()</button>
<output id="doc-ac-api-out">value: ""</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-ac-api');
  const out = document.getElementById('doc-ac-api-out');
  if (!el || !window.Materix) return;
  const ac = Materix.getInstance(el);
  if (!ac) return;
  ac.element.addEventListener('mtx:autocomplete:change', (e) => { out.textContent = 'change → ' + JSON.stringify(e.detail.value) + ' (' + e.detail.reason + ')'; });
  document.querySelectorAll('[data-doc-ac]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-ac');
      if (action === 'value') { ac.value = 'matrix'; out.textContent = 'value: ' + JSON.stringify(ac.value); }
      if (action === 'open') { ac.focus(); ac.open(); }
      if (action === 'clear') ac.clear();
      if (action === 'toggle') { if (ac.disabled) ac.enable(); else ac.disable(); out.textContent = 'disabled: ' + ac.disabled; }
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

Se leen del elemento original (`<input>` o `<select>`) o del contenedor `.mtx-autocomplete`.

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `autocomplete` | — | Inicializa el componente. |
| `data-label` | texto | — | Label flotante (TextField). |
| `data-variant` | `outlined` \| `filled` \| `standard` | `outlined` | Variante visual. |
| `data-size` | `small` \| `medium` | `medium` (56px) | `small` = 40px. También `data-small`. |
| `data-color` | `primary` \| `secondary` \| `success` \| `warning` \| `info` | `primary` | Color de foco y fondo de la opción seleccionada. |
| `data-start-icon` | icono \| URL | — | Icono o imagen inicial. |
| `data-helper-text` | texto | — | Texto de ayuda. |
| `data-error` | texto \| booleano | — | Estado de error (con mensaje o conservando la ayuda). |
| `data-options` | `#selector` \| JSON | — | Opciones: `<datalist>`/`<select>` o array de textos/objetos. |
| `data-value` | texto \| CSV \| JSON | — | Valor inicial (`value` de la opción; en múltiple, CSV con `data-separator` o array JSON). Si no, se usa el `value` del input o las `<option selected>`. |
| `data-multiple` | booleano | — | Selección múltiple con chips (también `multiple` en un `<select>`). |
| `data-free-solo` | booleano | — | Acepta valores fuera de la lista. |
| `data-limit-tags` | número | todos | Chips visibles sin foco (el resto como «+N»). |
| `data-disable-close-on-select` | booleano | — | Mantiene la lista abierta al seleccionar (múltiple). |
| `data-filter-selected-options` | booleano | — | Oculta las opciones seleccionadas (múltiple). |
| `data-clear-on-escape` | booleano | — | <kbd>Esc</kbd> con la lista cerrada limpia el valor. |
| `data-disable-clearable` | booleano | — | Sin botón limpiar. |
| `data-auto-highlight` | booleano | — | Activa la primera opción al filtrar. |
| `data-auto-select` | booleano | — | <kbd>Tab</kbd>/salir acepta la opción activa. |
| `data-open-on-focus` | booleano | — | Abre al recibir el foco. |
| `data-force-popup-icon` | booleano | `!free-solo` | Muestra u oculta el indicador de apertura. |
| `data-match-from` | `any` \| `start` | `any` | Dónde debe coincidir el texto. |
| `data-filter` | `false` | — | Desactiva el filtrado local (filtrado en servidor). |
| `data-debounce` | ms | `0` | Retrasa `mtx:autocomplete:input` al escribir. |
| `data-loading` | booleano | — | Estado de carga inicial. |
| `data-loading-text` | texto | i18n «Cargando…» | Texto mientras carga sin opciones. |
| `data-no-options-text` | texto | i18n «Sin opciones» | Texto cuando nada coincide. |
| `data-value-format` | `multiple` \| `csv` | `multiple` | Cómo se envían los valores múltiples. |
| `data-separator` | texto | `,` | Separador de `data-value` y CSV. |
| `name`, `required`, `disabled`, `readonly`, `placeholder` | nativos | — | Atributos nativos del `<input>`/`<select>` original. |
| `data-icon`, `data-description`, `data-group`, `disabled` *(en `<option>`)* | — | — | Icono, texto secundario, grupo y opción deshabilitada. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-autocomplete` | Contenedor raíz. |
| `mtx-autocomplete--open` / `--focused` | Lista abierta / foco dentro del componente. |
| `mtx-autocomplete--multiple` / `--loading` / `--disabled` / `--readonly` / `--required` | Estados. |
| `mtx-autocomplete--has-clear` / `--has-popup` / `--has-end` | Reservan espacio para los botones finales. |
| `mtx-autocomplete__field` | TextField interno (aplican las clases `mtx-text-field--*`). |
| `mtx-autocomplete__input-root` | Caja del campo (envuelve chips e input). |
| `mtx-autocomplete__input` | `<input>` combobox. |
| `mtx-autocomplete__tag` / `__tag-more` | Chip de cada valor / indicador «+N». |
| `mtx-autocomplete__end-adornment` | Contenedor de los botones finales. |
| `mtx-autocomplete__loading-indicator` | CircularProgress (20px). |
| `mtx-autocomplete__indicator` / `__clear-indicator` / `__popup-indicator` | Botones limpiar y abrir/cerrar. |
| `mtx-autocomplete__values` | Inputs ocultos con `name`. |
| `mtx-autocomplete__live` | Región viva (visualmente oculta). |
| `mtx-autocomplete__popper` / `--{color}` / `__paper` | Superficie flotante (portal) y su Paper. |
| `mtx-autocomplete__listbox` | `role="listbox"`. |
| `mtx-autocomplete__group` / `__group-label` / `__group-list` | Grupo, subheader fijo y lista `role="group"`. |
| `mtx-autocomplete__option` / `--focused` / `--disabled` | Opción y sus estados (`aria-selected` da estilo a la selección). |
| `mtx-autocomplete__option-icon` / `__option-content` / `__option-label` / `__option-description` | Contenido de la opción. |
| `mtx-autocomplete__highlight` | `<mark>` con el fragmento coincidente (negrita). |
| `mtx-autocomplete__status` | Mensaje «Cargando…» / «Sin opciones». |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | `value` de la opción (`''` sin selección; array en múltiple). Acepta valores, etiquetas u objetos `{value}`. Asignarlo no emite `change`. |
| `selectedOption` (get) | `Object \| null` | Opción seleccionada (única). |
| `selectedOptions` (get) | `Object[]` | Opciones seleccionadas. |
| `inputValue` (get/set) | `string` | Texto visible; asignarlo vuelve a filtrar (sin eventos). |
| `options` (get) | `Object[]` | Copia de las opciones. |
| `setOptions(options)` | `void` | Sustituye las opciones (textos u objetos `{value, label, group?, disabled?, icon?, description?}`; se conservan las propiedades extra). El valor actual mantiene su selección y refresca su etiqueta. |
| `loading` (get/set) / `setLoading(bool)` | `boolean` / `void` | Estado de carga. |
| `isOpen` (get) | `boolean` | Si la lista está abierta. |
| `open()` / `close()` | `void` | Abre o cierra la lista. |
| `clear()` | `void` | Vacía valor y texto (emite `change` con `reason: 'clear'`). |
| `focus()` / `blur()` | `void` | Foco en el input. |
| `disable()` / `enable()` / `disabled` (get) | `void` / `boolean` | Estado deshabilitado. |
| `setError(message)` / `clearError()` | `void` | Estado de error (delegado en TextField). |
| `destroy()` | `void` | Retira listeners, temporizadores, chips y el popup, y restaura el `name` en el input. |

Propiedades útiles: `element` (contenedor), `input`, `field`, `textField`, `listbox`, `popper`.

### Eventos

Se emiten sobre el contenedor (`instance.element`) y burbujean.

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:autocomplete:change` | `{value, option, reason}` (única) · `{value, options, option, reason}` (múltiple) | El valor cambia por acción del usuario. `reason`: `selectOption`, `removeOption`, `createOption`, `clear`, `blur`. |
| `mtx:autocomplete:input` | `{inputValue, reason}` | Cambia el texto: `input` (escritura, con `data-debounce`), `reset` (texto sincronizado con el valor), `clear`. |
| `mtx:autocomplete:open` | `{reason}` | Se abre la lista (`keyboard`, `toggleInput`, `input`, `focus`, `api`). |
| `mtx:autocomplete:close` | `{reason}` | Se cierra la lista (`escape`, `blur`, `selectOption`, `createOption`, `toggleInput`, `api`…). |
| `mtx:autocomplete:highlight` | `{option, reason}` | Cambia la opción activa (`keyboard`, `mouse`, `auto`). |

Escucha `mtx:localechange` para traducir sus textos al cambiar el idioma.

### Variables CSS

| Variable | Predeterminado | Descripción |
| :--- | :--- | :--- |
| `--mtx-ac-end-offset` | `9px` (`0` en standard) | Distancia de los botones finales al borde. |
| `--mtx-ac-accent` | `--mtx-color-primary` | Color de fondo de las opciones seleccionadas (popper). |

Usa además `--mtx-field-height-medium|small`, `--mtx-elevation-8`, `--mtx-overlay-elevation-8` (tema oscuro), `--mtx-color-background-paper`, `--mtx-color-action-hover|focus|active` y `--mtx-z-index-modal`.

## Accesibilidad

- Patrón WAI-ARIA 1.2 *combobox con listbox*: el foco permanece en el `<input role="combobox">` con `aria-autocomplete="list"`, `aria-expanded` (true cuando hay opciones visibles), `aria-controls` (el listbox mientras está abierto) y `aria-activedescendant` (la opción activa).
- La lista es un `role="listbox"` etiquetado por el label (`aria-labelledby`), con `aria-multiselectable` en múltiple y `aria-busy` mientras carga; cada opción es un `role="option"` con `aria-selected` y `aria-disabled`. Los grupos usan `role="group"` etiquetado por su subheader.
- Una región viva `role="status"` anuncia «N resultados disponibles», «Sin opciones» o «Cargando…» tras filtrar.
- Los botones limpiar y abrir/cerrar tienen `aria-label` traducido y quedan fuera del orden de tabulación (`tabindex="-1"`), como en MUI: todo se puede hacer desde el teclado en el campo.
- Se sincronizan `aria-required`, `aria-readonly`, `aria-invalid` y `aria-describedby` (ayuda/error); `required` usa la validación nativa.
- Los chips se enfocan con las flechas desde el campo (`tabindex="-1"`, fuera del orden de tabulación, como en MUI) y se eliminan con <kbd>Retroceso</kbd>/<kbd>Supr</kbd>; su icono de borrar no es un control enfocable anidado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Abre la lista; abierta, mueve la opción activa (envuelve y salta las deshabilitadas). |
| <kbd>Av Pág</kbd> / <kbd>Re Pág</kbd> | Salta 5 opciones. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última opción (con la lista abierta; no en free solo). |
| <kbd>Enter</kbd> | Selecciona la opción activa (en free solo, confirma el texto). |
| <kbd>Esc</kbd> | Cierra la lista; cerrada y con `data-clear-on-escape`, limpia. |
| <kbd>Tab</kbd> | Sale del campo (con `data-auto-select`, acepta la opción activa). |
| <kbd>Retroceso</kbd> (campo vacío, múltiple) | Elimina el último chip. |
| <kbd>←</kbd> / <kbd>→</kbd> (múltiple) | Recorre los chips y vuelve al campo. |
