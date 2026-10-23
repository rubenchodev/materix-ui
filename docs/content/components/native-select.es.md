---
title: "Native Select"
description: "El <select> del navegador con estética MUI: ligero, accesible por defecto y con el selector táctil nativo en móviles."
group: "inputs"
icon: "arrow_drop_down_circle"
weight: 90
example: "native-select"
mui: "https://mui.com/material-ui/react-select/#native-select"
---

`NativeSelect` aplica la estética de MUI al `<select>` del navegador sin sustituir su menú: la lista la dibuja el sistema operativo, lo que lo hace el selector más ligero, rápido con listas largas y cómodo en móviles. Úsalo en formularios simples. Si necesitas búsqueda, multiselección con casillas, iconos en las opciones o texto de ayuda, usa [Select](../select/).

{{< callout type="info" title="¿Select o NativeSelect?" >}}
| Necesidad | Select | NativeSelect |
| :--- | :--- | :--- |
| Menú con estética MUI (Paper, marca de verificación) | Sí | No, usa el del sistema |
| Búsqueda dentro del menú | Sí (`data-search`) | No |
| Selección múltiple cómoda | Sí, con casillas y "Seleccionar todo" | Lista nativa (`multiple`, Ctrl/Cmd + clic) |
| Iconos o imágenes en las opciones | Sí (`data-icon`, `data-image`) | No |
| Texto de ayuda, icono inicial, read-only | Sí | No |
| Peso y rendimiento con miles de opciones | Medio | Mínimo |
| Experiencia táctil nativa en móviles | Menú propio | Selector del sistema |

Regla práctica: **NativeSelect** para formularios simples y listas largas en móvil; **Select** cuando necesitas búsqueda, multiselección, iconos o coherencia visual completa.
{{< /callout >}}

## Uso básico

Escribe solo el `<select>` con `data-mtx="native-select"` y `data-label`. El JavaScript lo envuelve, añade el label (asociado con `for`/`id`, así que el select ya tiene nombre accesible) y el chevron. Como en MUI NativeSelect, la variante predeterminada es `standard`; usa `data-variant` para `outlined` o `filled`.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<select data-mtx="native-select" data-variant="outlined" data-label="Edad" name="age">
  <option value="10">Diez</option>
  <option value="20">Veinte</option>
  <option value="30">Treinta</option>
</select>
{{< /mtx-demo >}}

{{< callout type="info" >}}
Sin `data-variant` se aplica `standard`. Si no usas `data-label`, da nombre al select con `aria-label` o un `<label for>` propio.
{{< /callout >}}

## Variantes

`outlined` (borde completo), `filled` (fondo y esquinas superiores redondeadas) y `standard` (línea inferior).

{{< mtx-demo title="Variantes" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="outlined" data-label="Outlined">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="filled" data-label="Filled">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="4">
    <select data-mtx="native-select" data-variant="standard" data-label="Standard">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Tamaños

Medium 56px (predeterminado) y small 40px con `data-size="small"` o `data-small` (también reduce el texto a 14px). Las alturas coinciden con TextField y Select.

{{< mtx-demo title="Medium 56px y small 40px" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Medium · 56px">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Small · 40px" data-size="small">
      <option value="1">Opción 1</option>
      <option value="2">Opción 2</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Estados

`data-error` pinta el borde, el label y el chevron en rojo y marca `aria-invalid="true"`; `disabled` en el `<select>` lo deshabilita. Con foco, el borde y el label pasan al color primario.

{{< mtx-demo title="Error y deshabilitado" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Talla" data-error>
      <option value="">Sin elegir</option>
      <option value="m">M</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Plan" disabled>
      <option value="pro">Profesional</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Grupos y selección múltiple

Los `<optgroup>` y `<option disabled>` funcionan de forma nativa. Con `multiple` (y `size` para fijar las filas visibles) se muestra la lista del navegador con el borde o fondo de su variante (outlined, filled o standard) y sin chevron.

{{< mtx-demo title="Optgroup y multiple" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="filled" data-label="Ciudad">
      <optgroup label="Colombia">
        <option value="bog">Bogotá</option>
        <option value="med">Medellín</option>
      </optgroup>
      <optgroup label="México">
        <option value="cdmx">Ciudad de México</option>
        <option value="gdl" disabled>Guadalajara (sin cobertura)</option>
      </optgroup>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Lenguajes" multiple size="4">
      <option value="js" selected>JavaScript</option>
      <option value="ts">TypeScript</option>
      <option value="py">Python</option>
      <option value="go">Go</option>
    </select>
  </div>
</div>
{{< /mtx-demo >}}

## Casos de uso reales

Formulario de dirección rápido en móvil: el selector del sistema aparece al tocar cada campo.

{{< mtx-demo title="Dirección de envío" layout="block" >}}
<form data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="País" name="country" autocomplete="country">
      <option value="co">Colombia</option>
      <option value="mx">México</option>
      <option value="es">España</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <select data-mtx="native-select" data-variant="outlined" data-label="Tipo de vía" name="street-type">
      <option value="calle">Calle</option>
      <option value="carrera">Carrera</option>
      <option value="avenida">Avenida</option>
    </select>
  </div>
  <div data-mtx="grid" data-xs="12">
    <input data-mtx="text-field" data-label="Dirección" autocomplete="street-address" type="text" />
  </div>
</form>
{{< /mtx-demo >}}

## Sintaxis BEM completa

```html
<div class="mtx-native-select mtx-native-select--outlined" data-mtx="native-select">
  <label class="mtx-native-select__label" for="age">Edad</label>
  <select class="mtx-native-select__input" id="age">
    <option value="10">Diez</option>
    <option value="20">Veinte</option>
  </select>
</div>
```

En marcado manual asocia el label con `for`/`id` (si falta `for`, el JavaScript genera el `id` y lo enlaza). El chevron lo genera el JavaScript; si escribes un `<span class="mtx-native-select__chevron">` vacío, se rellena con el icono.

## Uso programático

```javascript
const select = Materix.init(document.getElementById('edad'), 'native-select');
const other = new Materix.NativeSelect(document.querySelector('#talla'));
const same = Materix.getInstance(document.getElementById('edad'));

select.value = '20';                 // no emite change
select.focus();
select.disable();
select.enable();
select.input.addEventListener('change', () => console.log(select.value));
```

```javascript
import { NativeSelect, init, getInstance } from '@rubenchodev/materix-ui';
```

{{< mtx-demo title="API en vivo" >}}
<select id="doc-ns-api" data-mtx="native-select" data-variant="outlined" data-label="Talla">
  <option value="s">S</option>
  <option value="m">M</option>
  <option value="l">L</option>
</select>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="value">value = 'l'</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="toggle">disable() / enable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" data-doc-ns="focus">focus()</button>
<output id="doc-ns-out">value: s</output>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-ns-api');
  const out = document.getElementById('doc-ns-out');
  if (!el || !window.Materix) return;
  const ns = Materix.getInstance(el);
  if (!ns) return;
  ns.input.addEventListener('change', () => { out.textContent = 'change → value: ' + ns.value; });
  document.querySelectorAll('[data-doc-ns]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-doc-ns');
      if (action === 'value') { ns.value = 'l'; out.textContent = 'value: ' + ns.value; }
      if (action === 'toggle') { if (ns.disabled) ns.enable(); else ns.disable(); out.textContent = 'disabled: ' + ns.disabled; }
      if (action === 'focus') ns.focus();
    });
  });
});
</script>

## Referencia de API

### Atributos data-*

En sintaxis simplificada se escriben en el `<select>` y se copian al contenedor; en BEM, en el contenedor `.mtx-native-select`.

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `native-select` | — | Inicializa el componente. |
| `data-variant` | `standard` \| `outlined` \| `filled` | `standard` | Variante visual (por defecto `standard`, como MUI NativeSelect). También se respeta una clase `mtx-native-select--{variante}`. |
| `data-label` | texto | — | Label visual flotante (también atributo `label`). |
| `data-size` | `small` | medium (56px) | `small` = 40px y texto de 14px. También `data-small`. |
| `data-error` | booleano | — | Estado de error y `aria-invalid="true"`. |

Los atributos nativos (`name`, `required`, `disabled`, `multiple`, `size`, `autocomplete`, `form`) funcionan igual que en cualquier `<select>`; `required` además añade el asterisco al label.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-native-select` | Contenedor raíz. |
| `mtx-native-select--outlined` / `--filled` / `--standard` | Variantes. |
| `mtx-native-select--small` | Altura 40px. |
| `mtx-native-select--error` | Estado de error. |
| `mtx-native-select--multiple` | `<select multiple>` (altura automática, sin chevron, con el borde o fondo de la variante). Lo añade el JS. |
| `mtx-native-select--has-label` | Hay label: en filled el valor baja para no quedar bajo el label. Lo añade el JS. |
| `mtx-native-select__label` | Label flotante. |
| `mtx-native-select__input` | `<select>` nativo. |
| `mtx-native-select__chevron` | Flecha decorativa. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `value` (get/set) | `string` \| `string[]` | Valor (array en `multiple`). Asignarlo no emite `change`. |
| `disabled` (get) | `boolean` | Si está deshabilitado. |
| `disable()` | `void` | Deshabilita el `<select>`. |
| `enable()` | `void` | Habilita el `<select>`. |
| `focus()` | `void` | Enfoca el `<select>`. |

Propiedades útiles: `element` (contenedor), `input` (`<select>`), `chevron`.

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `change` (en `select.input`) | — (nativo) | El usuario elige otra opción. |
| `input` (en `select.input`) | — (nativo) | Igual que `change`, de forma inmediata. |

### Variables CSS

Sin variables propias; usa `--mtx-control-height-outlined|filled|standard` (56px), sus variantes `-small` (40px), `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-color-primary` y `--mtx-color-error`.

## Accesibilidad

- Es un `<select>` real: el navegador y los lectores de pantalla lo anuncian y manejan de forma nativa.
- El label generado (`data-label`) se asocia al `<select>` con `for`/`id`, de modo que el nombre accesible es el texto del label. Sin label, usa `aria-label` o `aria-labelledby`.
- `data-error` añade `aria-invalid="true"`; el chevron es decorativo (`aria-hidden`).

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Enfoca el selector. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Cambia de opción (o abre la lista, según el sistema). |
| <kbd>Alt</kbd> + <kbd>↓</kbd> / <kbd>Espacio</kbd> | Abre la lista del sistema. |
| Letras | Saltan a la opción que empieza por esa letra. |
| <kbd>Esc</kbd> | Cierra la lista sin cambiar el valor. |
