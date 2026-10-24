---
title: "Radio"
description: "Botón de radio para elegir exactamente una opción de un grupo visible; RadioGroup lee y establece el valor del grupo."
group: "inputs"
icon: "radio_button_checked"
weight: 50
example: "radio"
import: "Radio, RadioGroup"
mui: "https://mui.com/material-ui/react-radio-button/"
---

**Radio** permite elegir exactamente una opción de un conjunto pequeño en el que conviene ver todas las alternativas a la vez (plan, método de envío, frecuencia). Cada opción es un `<input type="radio">` nativo, así que la navegación con flechas y el envío del formulario funcionan sin código extra. **RadioGroup** comparte un `name` (lo genera si lo omites), gestiona el valor seleccionado y añade `role="radiogroup"`, un rótulo y texto de ayuda/error.

{{< callout type="tip" title="¿Radio, Select, Checkbox o Switch?" >}}
| Necesitas… | Usa |
| :--- | :--- |
| Una opción entre 2 y ~6, todas visibles | **Radio** |
| Una opción entre muchas, o poco espacio | [Select](../select/) / [Native Select](../native-select/) |
| Varias opciones independientes | [Checkbox](../checkbox/) |
| Activar o desactivar una preferencia | [Switch](../switch/) |
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Radio, RadioGroup } from '@rubenchodev/materix-react';

<RadioGroup label="Plan" defaultValue="basic">
  <Radio value="basic" label="Básico" />
  <Radio value="pro" label="Profesional" />
</RadioGroup>
```

## Uso básico

Envuelve las opciones en un `RadioGroup` con `label` y `defaultValue`. Cada `Radio` solo necesita `value` y `label`.

{{< react-demo "radio/01-basic" >}}

## Tamaños

**Medium** (círculo de 20px, por defecto) y **small** (16px) con `size="small"` en cada `Radio`.

{{< react-demo "radio/02-sizes" >}}

## Orientación

Las opciones se apilan por defecto; `row` las coloca en horizontal y las reparte en varias líneas si falta espacio.

{{< react-demo "radio/03-orientation" >}}

## Colores

`color` en cada `Radio` (`secondary`, `success`, `error`, `warning`, `info`); primary es el color por defecto.

{{< react-demo "radio/04-colors" >}}

## Estados

`disabled` en el grupo deshabilita todas las opciones (y pone `aria-disabled` en el radiogroup); `disabled` en un `Radio` deshabilita solo esa opción. `error` en el grupo añade `aria-invalid` y colorea los círculos vacíos.

{{< react-demo "radio/05-states" >}}

## Ayuda y error (FormHelperText)

`helperText` añade un `.mtx-form-helper-text` bajo el grupo, enlazado con `aria-describedby`. Combina `error` con el mensaje en `helperText` para validar al enviar.

{{< react-demo "radio/06-helper-error" >}}

## Agrupación accesible

El grupo necesita un nombre: `label` renderiza un `FormLabel` enlazado con `aria-labelledby`; también puedes pasar `aria-label` o tu propio `aria-labelledby`.

{{< react-demo "radio/07-accessible-grouping" >}}

## Ejemplos reales

Un selector de método de envío que lee el valor elegido al continuar.

{{< react-demo "radio/08-use-cases" >}}

## Grilla

Los radios pueden estar en cualquier maquetación anidada (aquí `Grid`): siguen leyendo `name` y la selección del `RadioGroup` más cercano.

{{< react-demo "radio/09-grid" >}}

## Uso controlado

Con `value` + `onChange` la selección la gestiona el padre: `group.value = 'low'` de vanilla pasa a ser `setValue('low')`, `disable()`/`setError()` pasan a ser props y `focus()` usa `inputRef`.

{{< react-demo "radio/10-controlled" >}}

## Referencia de la API

### Props de Radio

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `string` | — | Valor de la opción (se compara con el `value` del grupo). |
| `label` | `ReactNode` | — | Texto visible (`.mtx-radio__label`). También sirve `children`. |
| `checked` | `boolean` | del `RadioGroup` | Estado seleccionado (controlado). |
| `defaultChecked` | `boolean` | — | Estado inicial fuera de un `RadioGroup` (comportamiento nativo). |
| `onChange` | `(event, checked: boolean) => void` | — | Se invoca al seleccionar la opción. |
| `size` | `'medium' \| 'small'` | `'medium'` | Círculo de 20px o 16px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color al seleccionarse. |
| `disabled` | `boolean` | del `RadioGroup` / `FormControl` | Deshabilita la opción. |
| `required` | `boolean` | de `FormControl` | `required` nativo. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `id`, `name`, `form`, `autoFocus`, `aria-*`, `onFocus`, `onBlur` | | — | Se pasan al `<input>` (`name` lo asigna el grupo). |
| `inputRef` / `inputProps` | | — | Ref y atributos extra del input nativo. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref al `<label>` raíz. |

### Props de RadioGroup

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `string \| null` | — | Valor seleccionado (controlado). |
| `defaultValue` | `string \| null` | `null` | Valor inicial (no controlado). |
| `onChange` | `(event, value: string) => void` | — | Se invoca al seleccionar una opción (`mtx:radio-group:change`). |
| `name` | `string` | automático | Nombre compartido por los radios. |
| `row` | `boolean` | `false` | Distribución horizontal. |
| `label` | `ReactNode` | — | Rótulo del grupo (`.mtx-form-label`) enlazado con `aria-labelledby`. |
| `helperText` | `ReactNode` | — | Texto de ayuda o de error. |
| `error` | `boolean` | de `FormControl` | `aria-invalid` en el grupo. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita todos los radios. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al elemento `role="radiogroup"`. |

`className`, `style` y el resto de atributos van al elemento raíz de cada componente. `useRadioGroup()` devuelve el contexto del grupo (`name`, `value` —`undefined` si no es controlado—, `defaultValue`, `disabled`, `onChange`) para opciones propias. Un grupo no controlado usa radios nativos con `defaultChecked`, así que `form.reset()` restaura `defaultValue`. El grupo se renderiza siempre dentro de un `.mtx-form-control` estable.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-radio` | `<label>` raíz. |
| `.mtx-radio--small` / `.mtx-radio--{color}` | Tamaño y color. |
| `.mtx-radio__input` | Input nativo. |
| `.mtx-radio__box` | Círculo visual (aloja el ripple). |
| `.mtx-radio__label` | Texto. |
| `.mtx-radio-group` / `.mtx-radio-group--row` | Grupo y distribución en fila. |
| `.mtx-form-control` / `.mtx-form-label` / `.mtx-form-helper-text` | Contenedor, rótulo y ayuda del grupo. |

### Variables CSS

| Variable | Descripción |
| :--- | :--- |
| `--mtx-rd-color` | Color del borde del círculo seleccionado. |
| `--mtx-rd-check` | Color del punto interior. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<div data-mtx="radio-group" data-name="plan" data-label="Plan">` | `<RadioGroup name="plan" label="Plan">` |
| `<input type="radio" data-mtx="radio" value="a" data-label="A" checked>` | `<Radio value="a" label="A" />` + `defaultValue="a"` en el grupo |
| `data-row` / `data-direction="row"` | `row` |
| `data-size="small"`, `data-color` | `size="small"`, `color` |
| `data-helper-text`, `data-error="mensaje"` | `helperText`, `error` + `helperText` |
| `group.value` (lectura/escritura) | `value` / `onChange` |
| `group.disable()` / `radio.disable()` | `disabled` en el grupo / en el radio |
| `group.setError()` / `clearError()` | `error` |
| `mtx:radio-group:change` `{ value }` | `onChange(event, value)` |

## Accesibilidad

- Los inputs nativos comparten el `name` del grupo: el navegador gestiona la exclusión mutua, el foco itinerante y las flechas.
- RadioGroup renderiza `role="radiogroup"`; nómbralo con `label`, `aria-label` o `aria-labelledby`. El radio usa su estado nativo (sin `aria-checked`).
- Toda la fila es clicable; sin `label`, usa `aria-label` en cada `Radio`.
- `error` añade `aria-invalid="true"` al grupo y el texto de ayuda se enlaza con `aria-describedby`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Entra en el grupo (en la opción seleccionada) o sale de él. |
| <kbd>↓</kbd> / <kbd>→</kbd> | Selecciona la opción siguiente. |
| <kbd>↑</kbd> / <kbd>←</kbd> | Selecciona la opción anterior. |
| <kbd>Espacio</kbd> | Selecciona la opción enfocada si no lo está. |
