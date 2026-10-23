---
title: "Checkbox"
description: "Casilla para seleccionar una o varias opciones de una lista o confirmar una condición; admite estado indeterminado."
group: "inputs"
icon: "check_box"
weight: 40
example: "checkbox"
mui: "https://mui.com/material-ui/react-checkbox/"
---

**Checkbox** permite seleccionar cero, una o varias opciones de un conjunto, o confirmar una condición («Acepto los términos»). Conserva un `<input type="checkbox">` nativo, por lo que funciona en formularios, con teclado y con lectores de pantalla sin código extra. Si la opción aplica un cambio inmediato, usa un [Switch](../switch/); si solo puede elegirse una opción, usa [Radio](../radio/).

{{< callout type="tip" title="¿Checkbox, Switch o Radio?" >}}
| Componente | Cuándo usarlo |
| :--- | :--- |
| **Checkbox** | Varias opciones independientes, o una confirmación que se aplica al enviar un formulario. |
| **Switch** | Activar/desactivar una preferencia con efecto inmediato, sin botón «Guardar». |
| **Radio** | Elegir exactamente una opción de un grupo pequeño y visible. |
{{< /callout >}}

## Uso básico

Escribe solo el input con `data-mtx="checkbox"` y `data-label`. La librería lo envuelve en un `<label class="mtx-checkbox">`, dibuja la casilla y la etiqueta, y conserva `id`, `name`, `value`, `checked`, `required` y el resto de atributos.

{{< mtx-demo title="Uso básico" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Recordarme" checked />
<input type="checkbox" data-mtx="checkbox" data-label="Recibir novedades" />
{{< /mtx-demo >}}

## Tamaños

Dos tamaños, como en MUI: **medium** (casilla de 18px, predeterminado) y **small** (16px y texto de 14px) con `data-size="small"`, para tablas y formularios densos.

{{< mtx-demo title="Tamaños" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Medium" checked />
<input type="checkbox" data-mtx="checkbox" data-label="Small" data-size="small" checked />
{{< /mtx-demo >}}

## Con y sin etiqueta

Sin `data-label` se dibuja solo la casilla. Dale entonces nombre accesible con `aria-label` o `aria-labelledby`, por ejemplo en la columna de selección de una tabla.

{{< mtx-demo title="Solo casilla" >}}
<input type="checkbox" data-mtx="checkbox" aria-label="Seleccionar fila 1" checked />
<input type="checkbox" data-mtx="checkbox" aria-label="Seleccionar fila 2" />
{{< /mtx-demo >}}

## Colores

Primary es el predeterminado. Usa `data-color` en el input (`secondary`, `success`, `error`, `warning`, `info`) o la clase `mtx-checkbox--{color}`, que se concatena al contenedor generado.

{{< mtx-demo title="Colores" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Primary" checked />
<input type="checkbox" data-color="secondary" data-mtx="checkbox" data-label="Secondary" checked />
<input type="checkbox" data-color="success" data-mtx="checkbox" data-label="Success" checked />
<input type="checkbox" data-color="error" data-mtx="checkbox" data-label="Error" checked />
<input type="checkbox" data-color="warning" data-mtx="checkbox" data-label="Warning" checked />
<input type="checkbox" data-color="info" data-mtx="checkbox" data-label="Info" checked />
{{< /mtx-demo >}}

## Estados

Sin marcar, marcada e indeterminada, cada una habilitada o con `disabled`. Hover colorea el borde, la pulsación muestra un ripple centrado en la casilla y el foco con teclado un anillo.

{{< mtx-demo title="Habilitado y deshabilitado" layout="column" >}}
<div>
  <input type="checkbox" data-mtx="checkbox" data-label="Sin marcar" />
  <input type="checkbox" data-mtx="checkbox" data-label="Marcada" checked />
  <input type="checkbox" data-mtx="checkbox" data-label="Indeterminada" data-indeterminate />
</div>
<div>
  <input type="checkbox" data-mtx="checkbox" data-label="Sin marcar" disabled />
  <input type="checkbox" data-mtx="checkbox" data-label="Marcada" checked disabled />
</div>
{{< /mtx-demo >}}

Para un error de validación usa `data-error` (o `setError()`): marca `aria-invalid`, pinta el borde en rojo y muestra el mensaje enlazado con `aria-describedby` (ver [Ayuda y error](#ayuda-y-error-formhelpertext)):

{{< mtx-demo title="Error y texto de ayuda" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Términos de servicio" data-error="Debes aceptar las condiciones." required />
<input type="checkbox" data-mtx="checkbox" data-label="Indeterminada deshabilitada" data-indeterminate disabled />
{{< /mtx-demo >}}

{{< callout type="info" >}}
El `<input type="checkbox">` nativo no admite `readonly`. Para mostrar una casilla que el usuario no puede cambiar, usa `disabled`.
{{< /callout >}}

## Ayuda y error (FormHelperText)

`data-helper-text` envuelve la casilla en `.mtx-form-control` y añade debajo un `.mtx-form-helper-text` enlazado con `aria-describedby`. `data-error` vacío activa el error conservando la ayuda; con texto, el mensaje la sustituye. El input recibe `aria-invalid="true"` y el borde sin marcar se pinta en rojo. Desde código: `setError()`, `clearError()` y `setHelperText()`.

{{< mtx-demo title="Ayuda, error y validación" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Enviar recibo por correo" data-helper-text="Lo recibirás en ana@ejemplo.com" checked />
<input type="checkbox" data-mtx="checkbox" data-label="Confirmo que soy mayor de edad" data-helper-text="Requisito legal" data-error />
<input type="checkbox" id="doc-cb-consent" data-mtx="checkbox" data-label="Acepto los términos" data-error="Debes aceptar los términos." required />
{{< /mtx-demo >}}

```javascript
const consent = Materix.getInstance(document.getElementById('doc-cb-consent'));
form.addEventListener('submit', (event) => {
  if (!consent.checked) {
    event.preventDefault();
    consent.setError('Debes aceptar los términos.');
  } else {
    consent.clearError();
  }
});
```

`.mtx-form-helper-text` también funciona solo con CSS (o con `data-mtx="form-helper-text"`, que añade un `id`). Si escribes el contenedor a mano, el control enlaza el helper existente automáticamente:

{{< mtx-demo title="FormHelperText manual" >}}
<div class="mtx-form-control">
  <label class="mtx-checkbox" data-mtx="checkbox">
    <input type="checkbox" />
    <span class="mtx-checkbox__box"></span>
    <span class="mtx-checkbox__label">Suscribirme al boletín</span>
  </label>
  <p class="mtx-form-helper-text">Un correo al mes, sin spam.</p>
</div>
{{< /mtx-demo >}}

| Clase / atributo | Descripción |
| :--- | :--- |
| `mtx-form-control` | Columna que agrupa `mtx-form-label` (opcional), el control y el helper. `--error` y `--disabled` colorean label y helper. |
| `mtx-form-label` | Etiqueta de grupo (FormLabel): body1, text-secondary; primary con foco y error en estado inválido. |
| `mtx-form-helper-text` | Caption, margen superior 3px, text-secondary. |
| `mtx-form-helper-text--error` | Color error. |
| `mtx-form-helper-text--contained` | Sangría de 14px para alinearse con un TextField outlined/filled. |
| `mtx-form-helper-text--disabled` | Color text-disabled (automático dentro de un control deshabilitado). |
| `data-mtx="form-helper-text"` + `data-error` | Inicialización opcional; la instancia `Materix.FormHelperText` expone `setText(text)` y `error` (get/set). |

## Indeterminado

El estado indeterminado indica que solo una parte de las opciones hijas está marcada (patrón «seleccionar todo»). Se declara con `data-indeterminate` o con la propiedad `indeterminate`, y la librería sincroniza `aria-checked="mixed"`. Es solo visual: al hacer clic, el navegador lo retira y aplica marcado/desmarcado.

{{< mtx-demo title="Seleccionar todo" layout="column" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Todos los permisos" id="doc-checkbox-parent" data-indeterminate />
<input type="checkbox" class="doc-checkbox-child" data-mtx="checkbox" data-label="Leer" checked />
<input type="checkbox" class="doc-checkbox-child" data-mtx="checkbox" data-label="Escribir" />
{{< /mtx-demo >}}

```javascript
const parent = Materix.getInstance(document.getElementById('doc-checkbox-parent'));
const children = [...document.querySelectorAll('input.doc-checkbox-child')].map(Materix.getInstance);

function syncParent() {
  const marked = children.filter((c) => c.checked).length;
  parent.indeterminate = marked > 0 && marked < children.length;
  parent.checked = marked === children.length;
}
parent.input.addEventListener('change', () => {
  children.forEach((c) => { c.checked = parent.checked; });
  syncParent();
});
children.forEach((c) => c.input.addEventListener('change', syncParent));
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  // Materix.init es idempotente: garantiza la instancia aunque este script corra antes que la autoinicialización.
  var parent = Materix.init(document.getElementById('doc-checkbox-parent'));
  var children = Array.prototype.map.call(document.querySelectorAll('input.doc-checkbox-child'), function (el) {
    return Materix.init(el);
  });
  function syncParent() {
    var marked = children.filter(function (c) { return c.checked; }).length;
    parent.indeterminate = marked > 0 && marked < children.length;
    parent.checked = marked === children.length;
  }
  parent.input.addEventListener('change', function () {
    children.forEach(function (c) { c.checked = parent.checked; });
    syncParent();
  });
  children.forEach(function (c) { c.input.addEventListener('change', syncParent); });
});
</script>

## Agrupación

Agrupa casillas relacionadas en un `<fieldset>` con `<legend>`: los lectores de pantalla anuncian la leyenda al entrar en el grupo. Comparte `name` para enviarlas juntas en un formulario.

{{< mtx-demo title="Grupo con leyenda" layout="column" >}}
<fieldset>
  <legend>Notificaciones por correo</legend>
  <input type="checkbox" name="notify" value="comments" data-mtx="checkbox" data-label="Comentarios" checked />
  <input type="checkbox" name="notify" value="mentions" data-mtx="checkbox" data-label="Menciones" checked />
  <input type="checkbox" name="notify" value="digest" data-mtx="checkbox" data-label="Resumen semanal" />
</fieldset>
{{< /mtx-demo >}}

## Casos de uso reales

Formulario de acceso con la casilla «Recordarme».

{{< mtx-demo title="Formulario de acceso" layout="column" >}}
<input data-mtx="text-field" data-label="Correo electrónico" data-start-icon="email" type="email" />
<input data-mtx="text-field" data-label="Contraseña" data-start-icon="lock" type="password" />
<input type="checkbox" name="remember" data-mtx="checkbox" data-label="Recordarme en este equipo" />
<button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button">Iniciar sesión</button>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino declara el `<label>` contenedor con `data-mtx`, el input, la casilla visual y la etiqueta. La librería reutiliza los nodos existentes.

```html
<label class="mtx-checkbox mtx-checkbox--secondary" data-mtx="checkbox">
  <input type="checkbox" name="terms" checked />
  <span class="mtx-checkbox__box"></span>
  <span class="mtx-checkbox__label">Acepto los términos</span>
</label>
```

## Uso programático

`Materix.getInstance()` acepta el input o el `<label>` generado. Los cambios hechos desde código no disparan eventos; las interacciones del usuario emiten el evento nativo `change` del input.

```javascript
const checkbox = Materix.getInstance(document.querySelector('#remember'));

checkbox.checked = true;
checkbox.indeterminate = false;
checkbox.toggle();
checkbox.disable();
checkbox.enable();
checkbox.focus();

checkbox.input.addEventListener('change', (event) => {
  console.log('checked:', event.target.checked);
});

// Inicializar un input creado dinámicamente
Materix.init(newInput, 'checkbox');
```

Con ES modules:

```javascript
import { init, getInstance, Checkbox } from '@rubenchodev/materix-ui';
const checkbox = new Checkbox(document.querySelector('#remember'));
```

{{< mtx-demo title="toggle()" >}}
<input type="checkbox" data-mtx="checkbox" data-label="Casilla controlada" id="doc-checkbox-target" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-checkbox-toggle">toggle()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-checkbox-toggle').addEventListener('click', function () {
    Materix.getInstance(document.getElementById('doc-checkbox-target')).toggle();
  });
});
</script>

## Referencia de API

### Atributos data-*

Se pueden escribir en el input (sintaxis simplificada) o en el `<label>` (BEM).

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `checkbox` | — | Activa la inicialización automática. |
| `data-label` | texto | — | Crea `.mtx-checkbox__label` con ese texto. También se acepta `label`. |
| `data-size` | `small` | medium | Tamaño compacto (`mtx-checkbox--small`). |
| `data-small` | booleano | — | Atajo de `data-size="small"`. |
| `data-indeterminate` | booleano | — | Inicia en estado indeterminado. |
| `data-disable-ripple` | booleano | — | Desactiva el ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color del estado marcado (añade `mtx-{componente}--{color}`). |
| `data-helper-text` | texto | — | Crea un `.mtx-form-helper-text` bajo el control dentro de `.mtx-form-control`, enlazado con `aria-describedby`. |
| `data-error` | texto \| vacío \| `true` | — | Estado de error: `aria-invalid="true"` y helper en rojo. Con texto, el mensaje sustituye a la ayuda. |

Los atributos `data-*` de configuración se leen del input y **no** se copian al `<label>` generado; la clase del input sí se concatena (nunca se reemplaza).

Atributos nativos conservados: `id`, `name`, `value`, `checked`, `disabled`, `required`, `aria-*`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-checkbox` | Contenedor `<label>`. |
| `mtx-checkbox__input` | Input nativo, invisible y superpuesto (lo añade el JS). |
| `mtx-checkbox__box` | Casilla visual de 18px con la marca o el guion. |
| `mtx-checkbox__label` | Texto de la etiqueta. |
| `mtx-checkbox--small` | Casilla de 16px y texto de 14px. |
| `mtx-checkbox--secondary`, `--success`, `--error`, `--warning`, `--info` | Color del estado marcado. |
| `mtx-form-control` | Contenedor generado (o manual) que agrupa control y `.mtx-form-helper-text`; `--error` / `--disabled` según el estado. |
| `mtx-form-helper-text` / `--error` | Texto de ayuda o de error (FormHelperText de MUI). |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `checked` (get/set) | `boolean` | Estado marcado; al asignarlo sincroniza `aria-checked`. |
| `indeterminate` (get/set) | `boolean` | Estado indeterminado; al asignarlo sincroniza `aria-checked="mixed"`. |
| `toggle()` | `void` | Alterna `checked` si no está deshabilitada. |
| `disable()` / `enable()` | `void` | Cambia `disabled` del input. |
| `disabled` (getter) | `boolean` | Estado deshabilitado del input. |
| `focus()` | `void` | Enfoca el input. |
| `input` (propiedad) | `HTMLInputElement` | Input nativo. |
| `setHelperText(text)` | `void` | Crea o cambia el texto de ayuda (vacío lo elimina). |
| `setError(message?)` | `void` | Activa el error (`aria-invalid`); con texto, el mensaje sustituye a la ayuda. |
| `clearError()` | `void` | Quita el error y restaura la ayuda. |
| `error` (getter) | `boolean` | Si está en estado de error. |
| `destroy()` | `void` | Elimina los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

Checkbox no emite eventos propios. Usa el evento nativo `change` del input (burbujea), que solo se dispara por interacción del usuario.

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `change` (nativo) | — (lee `event.target.checked`) | El usuario marca o desmarca la casilla. |

### Variables CSS

| Variable | Uso en Checkbox |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast` | Relleno y marca en estado marcado/indeterminado. |
| `--mtx-color-text-secondary` | Borde sin marcar. |
| `--mtx-color-text-primary`, `--mtx-type-body1` | Etiqueta. |
| `--mtx-color-action-disabled`, `--mtx-color-text-disabled` | Estado deshabilitado. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-cb-color`, `--mtx-cb-check` | Variables locales (color de relleno y de la marca) para personalizar. |

## Accesibilidad

- El input nativo permanece en el DOM: conserva el envío en formularios, `required` y la semántica de casilla.
- Toda la fila (`<label>`) es clicable. Sin `data-label`, usa `aria-label` o `aria-labelledby`.
- `aria-checked` se sincroniza con `checked` e `indeterminate` (`mixed`).
- El texto de ayuda queda **fuera** del `<label>` (no se mezcla con el nombre accesible) y se enlaza con `aria-describedby`, conservando los ids previos. `setError()` añade `aria-invalid="true"` y `clearError()` lo retira (solo si lo puso la librería).
- Agrupa opciones relacionadas con `<fieldset>` y `<legend>`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco a la casilla siguiente / anterior. |
| <kbd>Espacio</kbd> | Marca o desmarca la casilla enfocada. |
