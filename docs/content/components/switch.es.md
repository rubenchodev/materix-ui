---
title: "Switch"
description: "Interruptor que activa o desactiva una opción al instante, como una preferencia de ajustes; usa role=switch sobre un checkbox nativo."
group: "inputs"
icon: "toggle_on"
weight: 60
example: "switch"
import: "Switch"
mui: "https://mui.com/material-ui/react-switch/"
---

**Switch** activa o desactiva una única opción con efecto inmediato: Wi-Fi, modo oscuro, notificaciones. Renderiza un `<input type="checkbox" role="switch">` nativo dentro de un `<label class="mtx-switch">`, por lo que se anuncia como «activado / desactivado». Si el cambio solo se aplica al enviar un formulario, o hay varias opciones que confirmar, usa un [Checkbox](../checkbox/).

{{< callout type="tip" title="¿Switch o Checkbox?" >}}
Pregúntate si el usuario espera ver el efecto **sin pulsar «Guardar»**. Si la respuesta es sí, es un Switch («Modo oscuro»). Si el valor se envía con un formulario («Acepto los términos», «Suscribirme al boletín»), es un Checkbox.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Switch } from '@rubenchodev/materix-react';

<Switch label="Wi-Fi" defaultChecked />
```

## Uso básico

Basta un elemento con `label`: el componente renderiza el `<label>`, el input nativo, la pista con su thumb y el texto.

{{< react-demo "switch/01-basic" >}}

## Tamaños

**Medium** (pista de 34×20px, por defecto) y **small** (28×16px) con `size="small"`.

{{< react-demo "switch/02-sizes" >}}

## Con y sin etiqueta

Sin `label` solo se dibuja el interruptor: dale nombre con `aria-label` o `aria-labelledby` (se pasan al input).

{{< react-demo "switch/03-label" >}}

## Colores

Primary es el color por defecto; `color` acepta `secondary`, `success`, `error`, `warning` e `info`.

{{< react-demo "switch/04-colors" >}}

## Estados

Pasa el ratón, enfoca con <kbd>Tab</kbd>, alterna con <kbd>Espacio</kbd> y pulsa para ver el ripple en el thumb. `disabled` bloquea el control; `readOnly` lo mantiene enfocable y anunciado, pero el usuario no puede cambiarlo (para valores gestionados por un administrador).

{{< react-demo "switch/05-states" >}}

## Texto de ayuda y error

`helperText` envuelve el interruptor en `.mtx-form-control` y añade debajo un `.mtx-form-helper-text` enlazado con `aria-describedby`. `error` añade `aria-invalid="true"`; pasa el mensaje como `helperText`. Dentro de un [FormControl](../form-helper-text/) el interruptor hereda `error` y `disabled`.

{{< react-demo "switch/06-helper-error" >}}

## Agrupación

Agrupa varios interruptores bajo un `FormControl` con `role="group"` y un `FormLabel` (o un `<fieldset>` con `<legend>`).

{{< react-demo "switch/07-grouping" >}}

## Ejemplos reales

Un panel de preferencias donde cada interruptor aplica su cambio al instante.

{{< react-demo "switch/08-use-cases" >}}

## Grilla

Dentro de un `Grid` los interruptores se reparten en columnas responsive.

{{< react-demo "switch/09-grid" >}}

## Uso controlado

Con `checked` + `onChange` el estado lo gestiona el padre; `toggle()`, `disable()` y `setError()` de vanilla pasan a ser cambios de estado y `focus()` usa `inputRef`.

{{< react-demo "switch/10-controlled" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | — | Estado activado (controlado). |
| `defaultChecked` | `boolean` | `false` | Estado inicial (no controlado). |
| `onChange` | `(event, checked: boolean) => void` | — | Se invoca cuando el usuario alterna el interruptor. |
| `label` | `ReactNode` | — | Texto visible (`.mtx-switch__label`). También sirve `children`. |
| `size` | `'medium' \| 'small'` | `'medium'` | Tamaño de la pista. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color al activarse. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita el input. |
| `readOnly` | `boolean` | `false` | Enfocable pero no editable. |
| `required` | `boolean` | de `FormControl` | `required` nativo. |
| `error` | `boolean` | de `FormControl` | `aria-invalid` y colores de error. |
| `helperText` | `ReactNode` | — | Texto de ayuda o de error bajo el interruptor. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `id`, `name`, `value`, `form`, `autoFocus` | | — | Se pasan al `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se pasan al `<input>`. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref al input nativo. |
| `inputProps` | `InputHTMLAttributes` | — | Atributos extra del input nativo. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref al `<label>` raíz. |

`className`, `style` y el resto de atributos van al `<label>` raíz, que se renderiza siempre dentro de un `.mtx-form-control` estable para que cambiar `helperText` no remonte el input.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-switch` | `<label>` raíz. |
| `.mtx-switch--small` | Tamaño small. |
| `.mtx-switch--{color}` | Color de la paleta (no se añade para primary). |
| `.mtx-switch__input` | Input nativo con `role="switch"`. |
| `.mtx-switch__track` | Pista. |
| `.mtx-switch__thumb` | Thumb (aloja el ripple). |
| `.mtx-switch__label` | Texto. |

### Variables CSS

| Variable | Descripción |
| :--- | :--- |
| `--mtx-sw-color` | Color de la pista y el thumb al activarse. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="checkbox" data-mtx="switch" data-label="…">` | `<Switch label="…" />` |
| Atributo `checked` | `defaultChecked` o `checked` + `onChange` |
| `data-size="small"` | `size="small"` |
| `data-color="success"` | `color="success"` |
| `readonly` | `readOnly` |
| `data-helper-text` / `setHelperText()` | `helperText` |
| `data-error="mensaje"` / `setError('mensaje')` | `error` + `helperText="mensaje"` |
| `data-disable-ripple` | `disableRipple` |
| `disable()` / `enable()` | `disabled` |
| `toggle()` / `checked = …` | Actualizar el estado `checked` |
| `focus()` | `inputRef.current.focus()` |

## Accesibilidad

- El input conserva su semántica nativa con `role="switch"`: los lectores anuncian «interruptor, activado/desactivado» a partir del estado nativo (sin `aria-checked` redundante). Los interruptores no controlados son nativos (`defaultChecked`), así que `form.reset()` los restaura.
- El texto de ayuda queda **fuera** del `<label>` y se enlaza con `aria-describedby`; `error` añade `aria-invalid="true"`.
- Toda la fila es clicable. Sin `label`, usa `aria-label` o `aria-labelledby`.
- `readOnly` mantiene el control enfocable y legible sin simular un estado deshabilitado.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Mueve el foco al interruptor siguiente / anterior. |
| <kbd>Espacio</kbd> | Activa o desactiva el interruptor (salvo con `readOnly` o `disabled`). |
