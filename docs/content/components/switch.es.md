---
title: "Switch"
description: "Interruptor que activa o desactiva una opción al instante, como una preferencia de ajustes; usa role=switch sobre un checkbox nativo."
group: "inputs"
icon: "toggle_on"
weight: 60
example: "switch"
mui: "https://mui.com/material-ui/react-switch/"
---

**Switch** activa o desactiva una única opción cuyo efecto es inmediato: Wi-Fi, modo oscuro, notificaciones. Es un `<input type="checkbox">` nativo al que la librería añade `role="switch"`, de modo que se anuncia como «activado / desactivado». Si el cambio solo se aplica al enviar un formulario, o hay varias opciones que confirmar, usa un [Checkbox](../checkbox/).

{{< callout type="tip" title="¿Switch o Checkbox?" >}}
Pregúntate si el usuario espera ver el efecto **sin pulsar «Guardar»**. Si la respuesta es sí, es un Switch («Modo oscuro»). Si el valor se envía con un formulario («Acepto los términos», «Suscribirme al boletín»), es un Checkbox.
{{< /callout >}}

## Uso básico

Escribe solo el input con `data-mtx="switch"` y `data-label`. La librería genera la pista, el pulgar y la etiqueta dentro de un `<label class="mtx-switch">` y conserva todos los atributos del input.

{{< mtx-demo title="Uso básico" >}}
<input type="checkbox" data-mtx="switch" data-label="Wi-Fi" checked />
<input type="checkbox" data-mtx="switch" data-label="Bluetooth" />
{{< /mtx-demo >}}

## Tamaños

Dos tamaños, como en MUI: **medium** (pista de 34×20px, predeterminado) y **small** (28×16px y texto de 14px) con `data-size="small"`.

{{< mtx-demo title="Tamaños" >}}
<input type="checkbox" data-mtx="switch" data-label="Medium" checked />
<input type="checkbox" data-mtx="switch" data-label="Small" data-size="small" checked />
{{< /mtx-demo >}}

## Con y sin etiqueta

Sin `data-label` se dibuja solo el interruptor; dale nombre accesible con `aria-label` o `aria-labelledby`.

{{< mtx-demo title="Solo interruptor" >}}
<input type="checkbox" data-mtx="switch" aria-label="Sincronización automática" checked />
<input type="checkbox" data-mtx="switch" aria-label="Sincronización automática (small)" data-size="small" />
{{< /mtx-demo >}}

## Colores

Primary es el predeterminado. Usa `data-color` en el input (`secondary`, `success`, `error`, `warning`, `info`) o la clase `mtx-switch--{color}`, que se concatena al contenedor generado.

{{< mtx-demo title="Colores" >}}
<input type="checkbox" data-mtx="switch" data-label="Primary" checked />
<input type="checkbox" data-color="secondary" data-mtx="switch" data-label="Secondary" checked />
<input type="checkbox" data-color="success" data-mtx="switch" data-label="Success" checked />
<input type="checkbox" data-color="error" data-mtx="switch" data-label="Error" checked />
<input type="checkbox" data-color="warning" data-mtx="switch" data-label="Warning" checked />
<input type="checkbox" data-color="info" data-mtx="switch" data-label="Info" checked />
{{< /mtx-demo >}}

## Estados

La pulsación muestra un ripple sobre el pulgar y el foco con teclado un anillo alrededor de la pista.

- `disabled`: atenúa el control y lo saca del orden de tabulación.
- `readonly`: el control sigue siendo enfocable y legible, pero la librería bloquea los cambios por clic o teclado. Útil para ajustes gestionados por un administrador.

{{< mtx-demo title="Estados" layout="column" >}}
<div>
  <input type="checkbox" data-mtx="switch" data-label="Desactivado" />
  <input type="checkbox" data-mtx="switch" data-label="Activado" checked />
</div>
<div>
  <input type="checkbox" data-mtx="switch" data-label="Deshabilitado" disabled />
  <input type="checkbox" data-mtx="switch" data-label="Deshabilitado activado" checked disabled />
</div>
<div>
  <input type="checkbox" data-mtx="switch" data-label="Solo lectura (gestionado)" checked readonly />
</div>
{{< /mtx-demo >}}

## Ayuda y error

`data-helper-text` añade un `.mtx-form-helper-text` (FormHelperText) bajo el interruptor, enlazado con `aria-describedby`; `data-error` (vacío o con mensaje) activa el error con `aria-invalid="true"`. Ver la sección equivalente de [Checkbox]({{< relref "/components/checkbox" >}}).

{{< mtx-demo title="Ayuda y error" layout="column" >}}
<input type="checkbox" data-mtx="switch" data-label="Copias automáticas" data-helper-text="Cada noche a las 02:00." checked />
<input type="checkbox" data-mtx="switch" data-label="Verificación en dos pasos" data-error="Obligatoria para administradores." />
<input type="checkbox" data-mtx="switch" data-label="Alertas de seguridad" data-helper-text="Siempre activas." checked disabled />
{{< /mtx-demo >}}

## Agrupación

Agrupa interruptores relacionados en un `<fieldset>` con `<legend>`. Cada interruptor sigue siendo independiente.

{{< mtx-demo title="Grupo de preferencias" layout="column" >}}
<fieldset>
  <legend>Notificaciones</legend>
  <input type="checkbox" name="notify" value="push" data-mtx="switch" data-label="Notificaciones push" checked />
  <input type="checkbox" name="notify" value="email" data-mtx="switch" data-label="Resumen por correo" />
  <input type="checkbox" name="notify" value="sms" data-mtx="switch" data-label="Alertas por SMS" />
</fieldset>
{{< /mtx-demo >}}

## Casos de uso reales

Panel de ajustes en el que cada interruptor aplica el cambio en cuanto se pulsa, sin botón «Guardar».

{{< mtx-demo title="Ajustes" layout="column" >}}
<input type="checkbox" data-mtx="switch" data-label="Reproducir vídeos automáticamente" checked />
<input type="checkbox" data-mtx="switch" data-label="Mostrar vista previa de enlaces" checked />
<input type="checkbox" data-mtx="switch" data-label="Usar datos móviles para descargas" />
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino declara el `<label>` con el input, la pista con su pulgar y la etiqueta. La librería reutiliza los nodos y añade `role="switch"` al input.

```html
<label class="mtx-switch mtx-switch--success" data-mtx="switch">
  <input type="checkbox" name="wifi" checked />
  <span class="mtx-switch__track"><span class="mtx-switch__thumb"></span></span>
  <span class="mtx-switch__label">Wi-Fi</span>
</label>
```

## Uso programático

`Materix.getInstance()` acepta el input o el `<label>` generado. Los cambios desde código no disparan eventos; las interacciones del usuario emiten el `change` nativo del input.

```javascript
const wifi = Materix.getInstance(document.querySelector('#wifi'));

wifi.checked = true;
wifi.toggle();   // no hace nada si está disabled o readonly
wifi.disable();
wifi.enable();
wifi.focus();

wifi.input.addEventListener('change', (event) => {
  applyWifi(event.target.checked);
});

// Inicializar un input creado dinámicamente
Materix.init(newInput, 'switch');
```

Con ES modules:

```javascript
import { init, getInstance, Switch } from '@rubenchodev/materix-ui';
const wifi = new Switch(document.querySelector('#wifi'));
```

{{< mtx-demo title="toggle()" >}}
<input type="checkbox" data-mtx="switch" data-label="Interruptor controlado" id="doc-switch-target" />
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-switch-toggle">toggle()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-switch-toggle').addEventListener('click', function () {
    Materix.getInstance(document.getElementById('doc-switch-target')).toggle();
  });
});
</script>

## Referencia de API

### Atributos data-*

Se escriben en el input (sintaxis simplificada) o en el `<label>` (BEM).

| Atributo | Valores | Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `switch` | — | Activa la inicialización automática. |
| `data-label` | texto | — | Crea `.mtx-switch__label`. También se acepta `label`. |
| `data-size` | `small` | medium | Tamaño compacto (`mtx-switch--small`). |
| `data-small` | booleano | — | Atajo de `data-size="small"`. |
| `data-disable-ripple` | booleano | — | Desactiva el ripple. |
| `data-color` | `primary` \| `secondary` \| `success` \| `error` \| `warning` \| `info` | `primary` | Color del estado marcado (añade `mtx-{componente}--{color}`). |
| `data-helper-text` | texto | — | Crea un `.mtx-form-helper-text` bajo el control dentro de `.mtx-form-control`, enlazado con `aria-describedby`. |
| `data-error` | texto \| vacío \| `true` | — | Estado de error: `aria-invalid="true"` y helper en rojo. Con texto, el mensaje sustituye a la ayuda. |

Atributos nativos relevantes: `checked`, `disabled`, `readonly` (bloquea los cambios), `name`, `value`, `aria-*`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-switch` | Contenedor `<label>`. |
| `mtx-switch__input` | Input nativo invisible y superpuesto, con `role="switch"` (lo añade el JS). |
| `mtx-switch__track` | Pista de 34×20px. |
| `mtx-switch__thumb` | Pulgar de 16px que se desplaza al activarse. |
| `mtx-switch__label` | Texto de la etiqueta. |
| `mtx-switch--small` | Pista de 28×16px y texto de 14px. |
| `mtx-switch--secondary`, `--success`, `--error`, `--warning`, `--info` | Color del estado activado. |
| `mtx-form-control` | Contenedor generado (o manual) que agrupa control y `.mtx-form-helper-text`; `--error` / `--disabled` según el estado. |
| `mtx-form-helper-text` / `--error` | Texto de ayuda o de error (FormHelperText de MUI). |

### Métodos

| Método | Retorna | Descripción |
| :--- | :--- | :--- |
| `checked` (get/set) | `boolean` | Estado activado. |
| `toggle()` | `void` | Alterna el estado salvo que esté `disabled` o `readonly`. |
| `disable()` / `enable()` | `void` | Cambia `disabled` del input. |
| `disabled` (getter) | `boolean` | Estado deshabilitado. |
| `focus()` | `void` | Enfoca el input. |
| `input` (propiedad) | `HTMLInputElement` | Input nativo. |
| `setHelperText(text)` | `void` | Crea o cambia el texto de ayuda (vacío lo elimina). |
| `setError(message?)` | `void` | Activa el error (`aria-invalid`); con texto, el mensaje sustituye a la ayuda. |
| `clearError()` | `void` | Quita el error y restaura la ayuda. |
| `error` (getter) | `boolean` | Si está en estado de error. |
| `destroy()` | `void` | Elimina los listeners de ripple y de solo lectura. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

Switch no emite eventos propios. Usa el evento nativo `change` del input (burbujea), que solo se dispara por interacción del usuario.

| Evento | detail | Se emite cuando |
| :--- | :--- | :--- |
| `change` (nativo) | — (lee `event.target.checked`) | El usuario activa o desactiva el interruptor. |

### Variables CSS

| Variable | Uso en Switch |
| :--- | :--- |
| `--mtx-switch-track` | Pista desactivada. |
| `--mtx-switch-thumb` | Pulgar desactivado. |
| `--mtx-switch-track-disabled`, `--mtx-switch-thumb-disabled` | Estado deshabilitado. |
| `--mtx-color-{color}` | Pulgar activado y pista (al 50%). |
| `--mtx-elevation-2` | Sombra del pulgar. |
| `--mtx-color-text-primary`, `--mtx-color-text-disabled`, `--mtx-type-body1` | Etiqueta. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-sw-color` | Variable local con el color activado, para personalizar. |

## Accesibilidad

- El input conserva su semántica nativa y recibe `role="switch"`: los lectores de pantalla anuncian «interruptor, activado/desactivado». `aria-checked` se sincroniza con `checked` (setter y cambios del usuario).
- El texto de ayuda queda **fuera** del `<label>` (no se mezcla con el nombre accesible) y se enlaza con `aria-describedby`, conservando los ids previos. `setError()` añade `aria-invalid="true"` y `clearError()` lo retira (solo si lo puso la librería).
- Toda la fila es clicable. Sin `data-label`, usa `aria-label` o `aria-labelledby`.
- `readonly` mantiene el control enfocable y legible sin simular un estado deshabilitado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al interruptor siguiente / anterior. |
| <kbd>Espacio</kbd> | Activa o desactiva el interruptor (salvo `readonly` o `disabled`). |
