---
title: "Checkbox"
description: "Casilla para seleccionar una o varias opciones de una lista o confirmar una condición; admite estado indeterminado."
group: "inputs"
icon: "check_box"
weight: 40
example: "checkbox"
import: "Checkbox"
mui: "https://mui.com/material-ui/react-checkbox/"
---

**Checkbox** permite seleccionar cero, una o varias opciones de un conjunto, o confirmar una condición («Acepto los términos»). Renderiza un `<input type="checkbox">` nativo dentro de un `<label class="mtx-checkbox">`, por lo que funciona en formularios, con teclado y con lectores de pantalla sin código extra. Si la opción aplica un cambio inmediato, usa un [Switch](../switch/); si solo puede elegirse una opción, usa [Radio](../radio/).

{{< callout type="tip" title="¿Checkbox, Switch o Radio?" >}}
| Componente | Cuándo usarlo |
| :--- | :--- |
| **Checkbox** | Varias opciones independientes, o una confirmación que se aplica al enviar un formulario. |
| **Switch** | Activar/desactivar una preferencia con efecto inmediato, sin botón «Guardar». |
| **Radio** | Elegir exactamente una opción de un grupo pequeño y visible. |
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Checkbox } from '@rubenchodev/materix-react';

<Checkbox label="Recordarme" defaultChecked />
```

## Uso básico

Basta un elemento con `label`: el componente renderiza el `<label>` envolvente, el input nativo, la caja visual y el texto. Las props nativas (`id`, `name`, `value`, `required`, `autoFocus`, `form`) van al `<input>`.

{{< react-demo "checkbox/01-basic" >}}

## Tamaños

Dos tamaños, como en MUI: **medium** (caja de 18px, por defecto) y **small** (16px con texto de 14px) con `size="small"`, para tablas y formularios densos.

{{< react-demo "checkbox/02-sizes" >}}

## Con y sin etiqueta

Sin `label` solo se dibuja la caja. En ese caso dale un nombre accesible con `aria-label` o `aria-labelledby` (ambos se pasan al input), por ejemplo en la columna de selección de una tabla.

{{< react-demo "checkbox/03-label" >}}

## Colores

Primary es el color por defecto. Usa `color` (`secondary`, `success`, `error`, `warning`, `info`) para cambiar el color de la casilla marcada.

{{< react-demo "checkbox/04-colors" >}}

## Estados

Pasa el ratón para ver el cambio de color del borde, pulsa para ver el ripple y usa <kbd>Tab</kbd> y <kbd>Espacio</kbd> para enfocar y marcar. El checkbox nativo no admite `readOnly`: para bloquear una casilla usa `disabled`.

{{< react-demo "checkbox/05-states" >}}

## Texto de ayuda y error (FormHelperText)

`helperText` envuelve la casilla en `.mtx-form-control` y añade debajo un `.mtx-form-helper-text`, **fuera** del `<label>`, enlazado con `aria-describedby`. `error` añade `aria-invalid="true"` al input, colorea el borde de la caja vacía y pone el texto en rojo; pasa el mensaje de error como `helperText`. También puedes componer las piezas con [FormControl y FormHelperText](../form-helper-text/): la casilla hereda `error`/`disabled` y enlaza el texto automáticamente.

{{< react-demo "checkbox/06-helper-error" >}}

## Indeterminado

El estado indeterminado indica que solo algunas opciones hijas están marcadas. Como en MUI, `indeterminate` lo controla el padre: el componente mantiene la propiedad DOM `input.indeterminate` y `aria-checked="mixed"` sincronizadas con la prop en cada render.

{{< react-demo "checkbox/07-indeterminate" >}}

## Agrupación

Agrupa las casillas relacionadas bajo un rótulo para que los lectores de pantalla lo anuncien al entrar en el grupo: un `FormControl` con `role="group"` y un `FormLabel` (o un `<fieldset>` con `<legend>`). Usa el mismo `name` para enviarlas juntas.

{{< react-demo "checkbox/08-grouping" >}}

## Ejemplos reales

Un formulario de acceso con «Recordarme» y una confirmación de términos que habilita el botón de envío.

{{< react-demo "checkbox/09-use-cases" >}}

## Grilla

Con el componente `Grid` una lista larga de opciones se reparte en columnas: una en móvil, dos desde 600px y tres desde 900px.

{{< react-demo "checkbox/10-grid" >}}

## Uso controlado

Con `checked` + `onChange` el estado lo gestiona el padre; los métodos de la instancia vanilla pasan a ser cambios de estado (`toggle()` → `setChecked(!checked)`, `disable()` → `disabled`, `setError()` → `error` + `helperText`) y `focus()` usa `inputRef`.

{{< react-demo "checkbox/11-controlled" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | — | Estado marcado (controlado). |
| `defaultChecked` | `boolean` | `false` | Estado inicial (no controlado). |
| `onChange` | `(event, checked: boolean) => void` | — | Se invoca cuando el usuario cambia la casilla. |
| `indeterminate` | `boolean` | `false` | Estado parcial con `aria-checked="mixed"`. |
| `label` | `ReactNode` | — | Texto visible (`.mtx-checkbox__label`). También sirve `children`. |
| `size` | `'medium' \| 'small'` | `'medium'` | Caja de 18px o 16px. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Color al marcar. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita el input. |
| `required` | `boolean` | de `FormControl` | `required` nativo. |
| `error` | `boolean` | de `FormControl` | `aria-invalid` y colores de error. |
| `helperText` | `ReactNode` | — | Texto de ayuda o de error bajo la casilla. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `id`, `name`, `value`, `form`, `autoFocus` | | — | Se pasan al `<input>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se pasan al `<input>`. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref al input nativo. |
| `inputProps` | `InputHTMLAttributes` | — | Atributos extra del input nativo. |
| `ref` | `Ref<HTMLLabelElement>` | — | Ref al `<label>` raíz. |

`className`, `style` y el resto de atributos van al `<label>` raíz. El `<label>` se renderiza siempre dentro de un `.mtx-form-control` estable (salvo si ya está dentro de un `FormControl`), así que cambiar `helperText` nunca remonta el input ni mueve el foco.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-checkbox` | `<label>` raíz. |
| `.mtx-checkbox--small` | Tamaño small. |
| `.mtx-checkbox--{color}` | Color de la paleta (no se añade para primary). |
| `.mtx-checkbox__input` | Input nativo (oculto visualmente, sigue en el DOM). |
| `.mtx-checkbox__box` | Caja visual (aloja el ripple). |
| `.mtx-checkbox__label` | Texto. |
| `.mtx-form-control` / `.mtx-form-helper-text` | Contenedor y texto de ayuda cuando hay `helperText`. |

### Variables CSS

| Variable | Descripción |
| :--- | :--- |
| `--mtx-cb-color` | Color de la caja marcada o indeterminada. |
| `--mtx-cb-check` | Color de la marca. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="checkbox" data-mtx="checkbox" data-label="…">` | `<Checkbox label="…" />` |
| Atributo `checked` | `defaultChecked` (no controlado) o `checked` + `onChange` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-color="secondary"` | `color="secondary"` |
| `data-indeterminate` / `instance.indeterminate = true` | `indeterminate` |
| `data-helper-text="…"` / `setHelperText()` | `helperText="…"` |
| `data-error="mensaje"` / `setError('mensaje')` | `error` + `helperText="mensaje"` |
| `data-disable-ripple` | `disableRipple` |
| `disable()` / `enable()` | `disabled` |
| `focus()` | `inputRef.current.focus()` |
| `toggle()` / `checked = …` | Actualizar el estado `checked` |
| Evento nativo `change` | `onChange(event, checked)` |

## Accesibilidad

- El input nativo sigue en el DOM: conserva el envío de formularios, `required` y la semántica de casilla.
- Toda la fila (`<label>`) es clicable. Sin `label`, usa `aria-label` o `aria-labelledby`.
- El estado marcado lo expone el input nativo (sin `aria-checked` redundante); `indeterminate` añade `aria-checked="mixed"`. En modo no controlado el input es nativo (`defaultChecked`), así que `form.reset()` lo restaura.
- El texto de ayuda queda **fuera** del `<label>` (no se mezcla con el nombre accesible) y se enlaza con `aria-describedby`, conservando los ids que pases. `error` añade `aria-invalid="true"`.
- Agrupa las opciones relacionadas bajo un `FormLabel` (`role="group"` + `aria-labelledby`) o un `<fieldset>` con `<legend>`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Mueve el foco a la casilla siguiente / anterior. |
| <kbd>Espacio</kbd> | Marca o desmarca la casilla enfocada. |
