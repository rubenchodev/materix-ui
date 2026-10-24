---
title: "Form Helper Text"
description: "Texto de ayuda y de error bajo un control de formulario, con FormControl y FormLabel para compartir error, deshabilitado y requerido con los controles internos."
group: "inputs"
icon: "info"
weight: 45
example: "form-helper-text"
import: "FormHelperText, FormControl, FormLabel, useFormControl"
mui: "https://mui.com/material-ui/api/form-helper-text/"
---

**FormHelperText** es el texto bajo un control que explica qué introducir o por qué el valor no es válido. **FormControl** agrupa un rótulo, un control y su texto de ayuda y comparte `error`, `disabled` y `required` mediante un contexto, para que todas las piezas cambien a la vez; **FormLabel** es el rótulo del grupo. Checkbox, Switch y RadioGroup ya renderizan estas piezas con `helperText` y `error`; úsalas directamente para componer tus propias maquetaciones o crear controles nuevos con `useFormControl()`.

{{< callout type="tip" title="Cuándo componerlo a mano" >}}
Para un único control, usa las props `helperText`/`error` de [Checkbox](../checkbox/), [Switch](../switch/) o [Radio](../radio/). Recurre a `FormControl` cuando varios controles comparten un rótulo y un mensaje, o cuando escribes un control propio.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { FormControl, FormHelperText, FormLabel } from '@rubenchodev/materix-react';

<FormControl error>
  <FormLabel>Consentimiento</FormLabel>
  {/* control */}
  <FormHelperText>Debes aceptar los términos.</FormHelperText>
</FormControl>
```

## Uso básico

`FormHelperText` renderiza un `<p class="mtx-form-helper-text">` con un id generado. `error` lo pone en rojo; `disabled` lo atenúa y añade `aria-disabled`.

{{< react-demo "form-helper-text/01-basic" >}}

## FormControl y FormLabel

Dentro de un `FormControl`, el rótulo, el texto de ayuda y los controles heredan `error` y `disabled`. Checkbox, Switch y RadioGroup además enlazan cada `FormHelperText` del grupo con `aria-describedby`.

{{< react-demo "form-helper-text/02-form-control" >}}

## Contenido (contained)

`contained` añade un margen lateral de 14px para alinear el texto con el contenido de un campo de texto outlined o filled.

{{< react-demo "form-helper-text/03-contained" >}}

## Control propio con useFormControl

`useFormControl()` devuelve el estado del FormControl más cercano (o `undefined`): `error`, `disabled`, `required` y `helperTextIds`, los ids de los textos de ayuda con contenido, listos para `aria-describedby`.

{{< react-demo "form-helper-text/04-use-form-control" >}}

## Referencia de la API

### Props de FormHelperText

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `error` | `boolean` | de `FormControl` | Color de error (`--error`). |
| `disabled` | `boolean` | de `FormControl` | Atenúa el texto (`--disabled` + `aria-disabled`). Heredado solo como `aria-disabled`. |
| `contained` | `boolean` | `false` | Margen lateral de un campo outlined/filled (`--contained`). |
| `id` | `string` | automático | Id usado por `aria-describedby`. |
| `ref` | `Ref<HTMLParagraphElement>` | — | Ref al `<p>`. |

### Props de FormControl

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `error` | `boolean` | `false` | Estado de error compartido con los hijos (`.mtx-form-control--error`). |
| `disabled` | `boolean` | `false` | Estado deshabilitado compartido con los hijos (`.mtx-form-control--disabled`). |
| `required` | `boolean` | `false` | Estado requerido compartido con los hijos. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al `<div>`. |

### Props de FormLabel

Atributos nativos de `<div>`; renderiza `.mtx-form-label` (color primario con foco interno; colores de error y deshabilitado según `FormControl`).

### useFormControl()

Devuelve `{ error, disabled, required, helperTextIds, registerHelperText } | undefined`. `FormHelperText` usa `registerHelperText(id)`, que devuelve la función de desregistro. Solo se registran los helpers de nivel FormControl: el `helperText` de Checkbox, Switch o RadioGroup describe solo a su control, y un control con `helperText` propio no enlaza los del grupo.

`className`, `style` y el resto de atributos van al elemento raíz de cada componente.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-form-control` | Contenedor (`--error`, `--disabled`). |
| `.mtx-form-label` | Rótulo del grupo. |
| `.mtx-form-helper-text` | Texto de ayuda (`--error`, `--contained`, `--disabled`). |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<p data-mtx="form-helper-text" data-error>` | `<FormHelperText error>` |
| `helper.error = true` / `setText()` | Prop `error` / children |
| `<div class="mtx-form-control">` (manual) | `<FormControl>` |
| `data-helper-text` / `data-error` en Checkbox, Switch, RadioGroup | Props `helperText` / `error` de esos componentes |
| `HelperTextController` (`aria-describedby`, `aria-invalid`) | Contexto de `FormControl` + `useFormControl()` |

## Accesibilidad

- El texto de ayuda se enlaza con el control mediante `aria-describedby`: se lee después del nombre del control sin formar parte de él.
- El error se comunica con `aria-invalid="true"` en el control, no solo con color: escribe el motivo en el texto de ayuda.
- Los textos de ayuda deshabilitados llevan `aria-disabled="true"` para que su color atenuado se trate como contenido deshabilitado.
- Nombra los grupos de controles con `FormLabel` + `aria-labelledby` (y `role="group"` en el `FormControl`).
