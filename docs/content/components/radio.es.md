---
title: "Radio"
description: "Botón de opción para elegir exactamente una alternativa de un grupo visible; RadioGroup lee y fija el valor del grupo."
group: "inputs"
icon: "radio_button_checked"
weight: 50
example: "radio"
mui: "https://mui.com/material-ui/react-radio-button/"
---

**Radio** permite elegir exactamente una opción de un conjunto pequeño en el que conviene ver todas las alternativas a la vez (plan, método de envío, frecuencia). Cada opción es un `<input type="radio">` nativo, así que la exclusión por `name`, las flechas del teclado y el envío en formularios funcionan sin código extra. **RadioGroup** es el contenedor opcional que apila las opciones y expone el valor seleccionado.

{{< callout type="tip" title="¿Radio, Select, Checkbox o Switch?" >}}
| Necesitas… | Usa |
| :--- | :--- |
| Una sola opción entre 2 y ~6, todas visibles | **Radio** |
| Una sola opción entre muchas, o con poco espacio | [Select](../select/) / [Native Select](../native-select/) |
| Varias opciones independientes | [Checkbox](../checkbox/) |
| Encender o apagar una sola preferencia | [Switch](../switch/) |
{{< /callout >}}

## Uso básico

Cada opción se escribe como un único input con `data-mtx="radio"`, `data-label` y el mismo `name`. Envuélvelas en `data-mtx="radio-group"` para apilarlas y leer el valor del grupo.

{{< mtx-demo title="Uso básico" layout="block" >}}
<div data-mtx="radio-group" data-name="plan" aria-label="Plan">
  <input type="radio" data-mtx="radio" name="plan" value="basic" data-label="Básico" checked />
  <input type="radio" data-mtx="radio" name="plan" value="pro" data-label="Profesional" />
  <input type="radio" data-mtx="radio" name="plan" value="enterprise" data-label="Empresa" />
</div>
{{< /mtx-demo >}}

## Tamaños

Dos tamaños: **medium** (círculo de 20px, predeterminado) y **small** (16px y texto de 14px) con `data-size="small"`.

{{< mtx-demo title="Tamaños" layout="block" >}}
<div data-mtx="radio-group" data-name="size-demo" data-row="true" aria-label="Tamaños">
  <input type="radio" data-mtx="radio" name="size-demo" value="medium" data-label="Medium" checked />
  <input type="radio" data-mtx="radio" name="size-demo" value="small" data-label="Small" data-size="small" />
</div>
{{< /mtx-demo >}}

## Orientación

El grupo es vertical por defecto, la disposición más fácil de recorrer. Con `data-row="true"` las opciones se colocan en fila (con salto de línea si no caben). Úsalo con pocas opciones cortas.

{{< mtx-demo title="En fila" layout="block" >}}
<div data-mtx="radio-group" data-name="size" data-row="true" aria-label="Talla">
  <input type="radio" data-mtx="radio" name="size" value="s" data-label="S" />
  <input type="radio" data-mtx="radio" name="size" value="m" data-label="M" checked />
  <input type="radio" data-mtx="radio" name="size" value="l" data-label="L" />
  <input type="radio" data-mtx="radio" name="size" value="xl" data-label="XL" />
</div>
{{< /mtx-demo >}}

## Colores

Primary es el predeterminado. Usa `data-color` en el input (`secondary`, `success`, `error`, `warning`, `info`) o la clase `mtx-radio--{color}`, que se concatena al contenedor generado.

{{< mtx-demo title="Colores" layout="block" >}}
<div data-mtx="radio-group" data-name="colors" data-row="true" aria-label="Colores">
  <input type="radio" data-mtx="radio" name="colors" value="primary" data-label="Primary" checked />
  <input type="radio" data-color="secondary" data-mtx="radio" name="colors" value="secondary" data-label="Secondary" />
  <input type="radio" data-color="success" data-mtx="radio" name="colors" value="success" data-label="Success" />
  <input type="radio" data-color="error" data-mtx="radio" name="colors" value="error" data-label="Error" />
  <input type="radio" data-color="warning" data-mtx="radio" name="colors" value="warning" data-label="Warning" />
  <input type="radio" data-color="info" data-mtx="radio" name="colors" value="info" data-label="Info" />
</div>
{{< /mtx-demo >}}

## Estados

Hover colorea el borde, la pulsación muestra un ripple centrado y el foco con teclado un anillo. `disabled` atenúa la opción y la excluye de la navegación con flechas.

{{< mtx-demo title="Habilitado y deshabilitado" layout="block" >}}
<div data-mtx="radio-group" data-name="state" aria-label="Estados">
  <input type="radio" data-mtx="radio" name="state" value="a" data-label="Seleccionado" checked />
  <input type="radio" data-mtx="radio" name="state" value="b" data-label="Sin seleccionar" />
  <input type="radio" data-mtx="radio" name="state" value="c" data-label="Deshabilitado" disabled />
</div>
{{< /mtx-demo >}}

Para un error de validación usa `data-error` en el grupo (o `group.setError()`): el radiogroup recibe `aria-invalid="true"`, los círculos sin marcar y la etiqueta se pintan en rojo, y el mensaje se enlaza con `aria-describedby`. `data-helper-text` añade una ayuda permanente:

{{< mtx-demo title="Error y texto de ayuda" layout="block" >}}
<div data-mtx="radio-group" data-name="source" data-label="¿Cómo nos conociste?" data-error="Selecciona una opción.">
  <input type="radio" data-mtx="radio" name="source" value="search" data-label="Buscador" required />
  <input type="radio" data-mtx="radio" name="source" value="friend" data-label="Recomendación" required />
</div>
<div data-mtx="radio-group" data-name="billing" data-label="Facturación" data-helper-text="Puedes cambiarla en cualquier momento.">
  <input type="radio" data-mtx="radio" name="billing" value="monthly" data-label="Mensual" checked />
  <input type="radio" data-mtx="radio" name="billing" value="yearly" data-label="Anual" />
</div>
{{< /mtx-demo >}}

{{< callout type="info" >}}
El `<input type="radio">` nativo no admite `readonly`. Para bloquear la elección usa `disabled`.
{{< /callout >}}

## Agrupación accesible

Todo grupo necesita un nombre accesible. Lo más sencillo es `data-label` en el grupo: genera una etiqueta `.mtx-form-label` y la enlaza con `aria-labelledby`. También sirven `<fieldset>` + `<legend>` o tu propio `aria-label`/`aria-labelledby`. RadioGroup añade `role="radiogroup"` automáticamente (salvo que el contenedor ya declare otro `role`).

```html
<span id="theme-label">Tema</span>
<div data-mtx="radio-group" data-name="theme" aria-labelledby="theme-label">
  <input type="radio" data-mtx="radio" name="theme" value="light" data-label="Claro" checked />
  <input type="radio" data-mtx="radio" name="theme" value="dark" data-label="Oscuro" />
</div>
```

## Casos de uso reales

Método de envío en un checkout: pocas opciones, mutuamente excluyentes y con información que conviene comparar.

{{< mtx-demo title="Método de envío" layout="block" >}}
<fieldset>
  <legend>Método de envío</legend>
  <div data-mtx="radio-group" data-name="shipping">
    <input type="radio" data-mtx="radio" name="shipping" value="standard" data-label="Estándar (3-5 días) · Gratis" checked />
    <input type="radio" data-mtx="radio" name="shipping" value="express" data-label="Exprés (24 h) · 6,90 €" />
    <input type="radio" data-mtx="radio" name="shipping" value="pickup" data-label="Recogida en tienda · Gratis" />
  </div>
</fieldset>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino declara cada `<label class="mtx-radio">` con su input, el círculo y la etiqueta, y el grupo con sus clases.

```html
<div class="mtx-radio-group" data-mtx="radio-group" data-name="plan" aria-label="Plan">
  <label class="mtx-radio" data-mtx="radio">
    <input type="radio" name="plan" value="basic" checked />
    <span class="mtx-radio__box"></span>
    <span class="mtx-radio__label">Básico</span>
  </label>
  <label class="mtx-radio" data-mtx="radio">
    <input type="radio" name="plan" value="pro" />
    <span class="mtx-radio__box"></span>
    <span class="mtx-radio__label">Profesional</span>
  </label>
</div>
```

## Uso programático

La instancia de RadioGroup se obtiene con `Materix.getInstance(contenedor)`. Expone `value` (lectura y escritura) y emite `mtx:radio-group:change` cuando el usuario cambia la selección. Cada Radio se obtiene con `Materix.getInstance(input)`.

```javascript
const groupEl = document.querySelector('#priority');
const group = Materix.getInstance(groupEl);

console.log(group.value);   // 'medium'
group.value = 'high';       // marca el radio con value="high" (no emite eventos)

groupEl.addEventListener('mtx:radio-group:change', (event) => {
  console.log('Nuevo valor:', event.detail.value);
});

const radio = Materix.getInstance(document.querySelector('#priority-high'));
radio.checked = true;
radio.disable();
radio.enable();
radio.focus();
```

Con ES modules:

```javascript
import { init, getInstance, Radio } from '@rubenchodev/materix-ui';
```

{{< callout type="info" >}}
RadioGroup se exporta como `Materix.RadioGroup` (`new Materix.RadioGroup(el)`), además de la vía declarativa `data-mtx="radio-group"` o `Materix.init(el, 'radio-group')`. Expone `value`, `disable()`/`enable()`, `setError()`, `clearError()` y `setHelperText()`.
{{< /callout >}}

{{< mtx-demo title="value y mtx:radio-group:change" layout="column" >}}
<div data-mtx="radio-group" data-name="doc-priority" data-row="true" aria-label="Prioridad" id="doc-radio-group">
  <input type="radio" data-mtx="radio" name="doc-priority" value="low" data-label="Baja" />
  <input type="radio" data-mtx="radio" name="doc-priority" value="medium" data-label="Media" checked />
  <input type="radio" data-mtx="radio" name="doc-priority" value="high" data-label="Alta" />
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-radio-set">group.value = 'high'</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var groupEl = document.getElementById('doc-radio-group');
  var group = Materix.init(groupEl);
  var status = groupEl.closest('.doc-demo').querySelector('.doc-demo-status');
  groupEl.addEventListener('mtx:radio-group:change', function (event) {
    if (status) status.textContent = 'mtx:radio-group:change → ' + event.detail.value;
  });
  document.getElementById('doc-radio-set').addEventListener('click', function () {
    group.value = 'high';
    if (status) status.textContent = 'value = ' + group.value;
  });
});
</script>

## Referencia de API

### Atributos data-* (Radio)

Se escriben en el input (sintaxis simplificada) o en el `<label>` (BEM).

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `radio` | — | Activa la inicialización automática. |
| `data-label` | texto | — | Crea `.mtx-radio__label`. También se acepta `label`. |
| `data-size` | `small` | medium | Tamaño compacto (`mtx-radio--small`). |
| `data-small` | booleano | — | Atajo de `data-size="small"`. |
| `data-disable-ripple` | booleano | — | Desactiva el ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color del estado seleccionado. |

Atributos nativos conservados: `id`, `name`, `value`, `checked`, `disabled`, `required`, `aria-*`.

### Atributos data-* (RadioGroup)

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `radio-group` | — | Activa la inicialización. |
| `data-name` | texto | — | `name` de los radios del grupo (también se acepta `name`). Si se omite, el grupo considera todos sus radios. |
| `data-row` | booleano | vertical | Dispone las opciones en fila (`mtx-radio-group--row`). `data-row="false"` lo desactiva. |
| `data-label` | texto | — | Crea la etiqueta del grupo (`.mtx-form-label`) y la enlaza con `aria-labelledby` si no hay nombre propio. |
| `data-direction` | `row` | vertical | Alias de `data-row`. |
| `data-helper-text` | texto | — | Texto de ayuda bajo el grupo (`aria-describedby` en el radiogroup). |
| `data-error` | texto \| vacío \| `true` | — | Error de grupo: `aria-invalid="true"` en el radiogroup, círculos y etiqueta en rojo. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-radio` | Contenedor `<label>`. |
| `mtx-radio__input` | Input nativo invisible y superpuesto (lo añade el JS). |
| `mtx-radio__box` | Círculo visual de 20px con el punto central. |
| `mtx-radio__label` | Texto de la opción. |
| `mtx-radio--small` | Círculo de 16px y texto de 14px. |
| `mtx-radio--secondary`, `--success`, `--error`, `--warning`, `--info` | Color del estado seleccionado. |
| `mtx-radio-group` | Contenedor del grupo (columna; cada opción ocupa una fila de 42px como en MUI). |
| `mtx-form-control` | Contenedor generado (o manual) que agrupa control y `.mtx-form-helper-text`; `--error` / `--disabled` según el estado. |
| `mtx-form-helper-text` / `--error` | Texto de ayuda o de error (FormHelperText de MUI). |
| `mtx-radio-group--row` | Grupo en fila con separación de 16px. |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `Radio.checked` (get/set) | `boolean` | Estado seleccionado del input. |
| `Radio.disable()` / `enable()` | `void` | Cambia `disabled` del input. |
| `Radio.disabled` (getter) | `boolean` | Estado deshabilitado. |
| `Radio.focus()` | `void` | Enfoca el input. |
| `Radio.input` (propiedad) | `HTMLInputElement` | Input nativo. |
| `Radio.destroy()` | `void` | Elimina el listener de ripple. |
| `RadioGroup.value` (get/set) | `string` | Valor del radio seleccionado (`''` si ninguno); al asignarlo selecciona el radio con ese `value`. |
| `RadioGroup.disable()` / `enable()` | `void` | (Des)habilita todos los radios del grupo y sincroniza `aria-disabled`. |
| `RadioGroup.disabled` (getter) | `boolean` | `true` si todos los radios están deshabilitados. |
| `RadioGroup.setHelperText(text)` / `setError(message?)` / `clearError()` | `void` | Ayuda y error del grupo (FormHelperText). |
| `RadioGroup.error` (getter) | `boolean` | Si el grupo está en error. |
| `RadioGroup.destroy()` | `void` | Elimina el listener de cambios. |

### Eventos

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `mtx:radio-group:change` (en el RadioGroup, burbujea) | `{ value: string }` | El usuario selecciona otra opción del grupo. No se emite al asignar `value` ni `checked` desde código. |
| `change` (nativo, en el input) | — | El usuario selecciona ese radio. |

Alias deprecado: `mtx:change` se sigue emitiendo con el mismo `detail` hasta la 1.0.

### Variables CSS

| Variable | Uso en Radio |
| :--- | :--- |
| `--mtx-color-{color}` | Borde y punto en estado seleccionado. |
| `--mtx-color-text-secondary` | Borde sin seleccionar. |
| `--mtx-color-text-primary`, `--mtx-type-body1` | Etiqueta. |
| `--mtx-color-action-disabled`, `--mtx-color-text-disabled` | Estado deshabilitado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-rd-color`, `--mtx-rd-check` | Variables locales (borde y punto) para personalizar. |

## Accesibilidad

- Los inputs nativos se agrupan por `name`: el navegador gestiona la exclusión, el foco itinerante y las flechas.
- RadioGroup añade `role="radiogroup"` automáticamente; nómbralo con `data-label`, `<fieldset>`/`<legend>` o `aria-labelledby`. El radio usa su estado nativo (no se añade `aria-checked`).
- Toda la fila es clicable; sin `data-label`, usa `aria-label` en cada input.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Entra en el grupo (sobre la opción seleccionada) o sale de él. |
| <kbd>↓</kbd> / <kbd>→</kbd> | Selecciona la opción siguiente. |
| <kbd>↑</kbd> / <kbd>←</kbd> | Selecciona la opción anterior. |
| <kbd>Espacio</kbd> | Selecciona la opción enfocada si no lo está. |
