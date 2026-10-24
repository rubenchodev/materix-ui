---
title: "Text Field"
description: "Campo de texto con label flotante, variantes MUI, iconos, contadores, máscaras de entrada y validación."
group: "inputs"
icon: "edit"
weight: 70
example: "text-field"
import: "TextField"
mui: "https://mui.com/material-ui/react-text-field/"
---

**TextField** permite escribir y editar texto en formularios: nombre, correo, contraseña, importes o comentarios largos. Renderiza el mismo marcado que el componente vanilla tras inicializarse: el `<label>` flotante, el borde con muesca (*NotchedOutline*, un `fieldset` con `legend`), los iconos, el texto de ayuda y el contador, alrededor de un `<input>`, `<textarea>` o `<select>` nativo. Para elegir entre un conjunto cerrado de opciones usa [Select](../select/) o [NativeSelect](../native-select/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { TextField } from '@rubenchodev/materix-react';

<TextField label="Nombre completo" />
```

## Uso básico

Basta un elemento con `label`. Las props nativas (`id`, `name`, `type`, `autoComplete`, `required`, `disabled`, `readOnly`, `maxLength`, `autoFocus`…) van al control nativo; `className`, `style` y el resto de atributos van al `<div>` raíz. Sin `label`, el `placeholder` se usa como label (como en vanilla). `multiline` renderiza un `<textarea>`.

{{< react-demo "text-field/01-basic" >}}

## Variantes

`outlined` (por defecto, con borde y muesca), `filled` (fondo y línea inferior) y `standard` (solo línea inferior). `variant="no-label"` dibuja un borde completo sin label ni muesca, para buscadores y filtros. Con `select`, el campo envuelve un `<select>` nativo (opciones como `children`) y añade un único chevron.

{{< react-demo id="text-field/02-variants" layout="block" >}}

## Tamaños

**Large** 48px (`size="large"`), **medium** 56px (por defecto) y **small** 40px (`size="small"`). Las filas de alineación muestran el campo junto a componentes de la misma altura: TextField small + Button medium (40px), TextField large + Button/IconButton large (48px) y TextField medium + FAB (56px).

{{< react-demo id="text-field/03-sizes" layout="block" >}}

## Con iconos

`startIcon` y `endIcon` aceptan un nombre de Material Icons (`"email"`), una URL de imagen (se pinta como `<img class="mtx-text-field__adornment--image">`) o un nodo (SVG, Material Symbols). Con icono inicial, el label se traslada exactamente 32px para que su primera letra coincida con el texto escrito. `startAdornment` y `endAdornment` aceptan contenido libre, como un prefijo `$` o un sufijo `kg`; como en MUI, un `startAdornment` libre mantiene el label flotando y alineado con el inicio del campo (el prefijo ocupa el lugar donde empezaría el texto), en las tres variantes, porque su ancho no es el de un icono de 24px.

{{< react-demo id="text-field/04-icons" layout="block" >}}

## Adornos interactivos

El equivalente a `InputAdornment` + `IconButton` de MUI. `passwordToggle` (solo con `type="password"`) añade el botón mostrar/ocultar con `aria-pressed`, `aria-controls` y nombre traducido, y llama a `onPasswordVisibilityChange(visible)`; el estado puede controlarse con `passwordVisible`. `startAction` / `endAction` crean un IconButton con el icono indicado y llaman a `onAdornmentClick({ position, button, input })`; nómbralos con `startActionLabel` / `endActionLabel`. El clic con ratón no roba el foco del campo y los botones se deshabilitan junto con él.

{{< react-demo id="text-field/05-adornments" layout="block" >}}

## Colores

`color` cambia el color de foco (label, borde y subrayado): `primary` (por defecto), `secondary`, `success`, `warning` e `info`. El rojo se reserva para el estado de error.

{{< react-demo "text-field/06-colors" >}}

## Estados

Normal, texto de ayuda, error con mensaje (`error` + `helperText`), error sin mensaje propio (el texto de ayuda se pinta en rojo), obligatorio (asterisco), deshabilitado y solo lectura. Pasa el ratón para ver el estado *hover* y usa <kbd>Tab</kbd> para ver el foco.

{{< react-demo id="text-field/07-states" layout="block" >}}

## Label estático, oculto y sin borde

`staticLabel` mantiene el label arriba y el placeholder visible, `hiddenLabel` oculta el label y la muesca (añade un `aria-label`) y `borderless` quita el borde. `margin` (`none`, `dense`, `normal`) y `fullWidth` funcionan como en MUI.

{{< react-demo id="text-field/08-label" layout="block" >}}

## Multilínea y auto-resize

`multiline` renderiza un `<textarea>` con `rows` (3 por defecto). `autoResize` hace crecer el campo al escribir y `maxRows` limita el crecimiento antes de mostrar scroll. Como en MUI, `minRows` o `maxRows` activan por sí solos el auto-resize.

{{< react-demo id="text-field/09-multiline" layout="block" >}}

## Contadores y límites

`counter="characters" | "words" | "both"` con `maxChars` (o el `maxLength` nativo) y `maxWords`. Basta un límite para mostrar su contador. Al superar el límite el campo pasa a estado de error (`aria-invalid="true"`); el contador se anuncia con `aria-live="polite"` y sus textos se traducen.

{{< react-demo id="text-field/10-counters" layout="block" >}}

## Máscaras de entrada

`mask` acepta un patrón (`0` dígito, `a` letra minúscula, `A` letra mayúscula, `*` alfanumérico; cualquier otro carácter es un literal), un atajo (`phone`, `phone-intl`, `credit-card`, `date`, `date-short`, `time`, `time-ampm`, `time-seconds`, `cpf`, `cnpj`, `zip`, `postal-code`) o `currency`, configurable con `currencyOptions` (`prefix`, `suffix`, `thousands`, `decimal`, `precision`). El valor se formatea al escribir y el cursor conserva su posición. `onChange` recibe el valor formateado y `{ unmaskedValue, isMaskComplete }`.

{{< react-demo id="text-field/11-masks" layout="block" >}}

## Validación

Combina la validación nativa (`required`, `type`, `checkValidity()` mediante `inputRef`) con `error` y `helperText`. Dentro de un [FormControl](../form-helper-text/), el campo hereda `error`, `disabled` y `required` y enlaza los textos de ayuda del FormControl con `aria-describedby`. En modo no controlado, el `reset` del formulario restaura el valor inicial.

{{< react-demo id="text-field/12-validation" layout="block" >}}

## Grilla

Formulario de registro con [Grid](../grid/): una columna en móvil y dos o tres en escritorio, combinando iconos, máscaras, un contador y Buttons.

{{< react-demo id="text-field/13-grid" layout="block" >}}

## Uso controlado

Con `value` + `onChange` el padre es dueño del valor. Con máscara, `value` puede ser el valor limpio (`"125000"`): se muestra formateado (`"$ 1,250.00"`). Los métodos de la instancia vanilla pasan a ser estado: `value`/`unmaskedValue = …` → `setValue()`, `setError()`/`clearError()` → `error` + `helperText`, `disable()`/`enable()` → `disabled`, y `focus()` usa `inputRef`. Los campos creados en tiempo de ejecución son simplemente nuevos elementos del estado (el equivalente a `Materix.init()` / `initAll()`).

{{< react-demo id="text-field/14-controlled" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `label` | `ReactNode` | — | Label flotante; también dimensiona la muesca. |
| `variant` | `'outlined' \| 'filled' \| 'standard' \| 'no-label'` | `'outlined'` | Variante visual. |
| `size` | `'small' \| 'medium' \| 'large'` | medium | 40px, 56px o 48px. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'info'` | `'primary'` | Color de foco. |
| `value` | `string \| number` | — | Valor (controlado). |
| `defaultValue` | `string \| number` | — | Valor inicial (no controlado). |
| `onChange` | `(event, value, { unmaskedValue, isMaskComplete }) => void` | — | Se invoca en cada cambio. |
| `placeholder` | `string` | — | Placeholder; se usa como label si falta `label`. |
| `helperText` | `ReactNode` | — | Texto de ayuda o de error bajo el campo. |
| `error` | `boolean` | de `FormControl` | Estado de error y `aria-invalid`. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita el campo y sus botones. |
| `required` | `boolean` | de `FormControl` | `required` nativo y asterisco. |
| `readOnly` | `boolean` | `false` | Solo lectura. |
| `fullWidth` | `boolean` | `false` | Ancho del 100%. |
| `margin` | `'none' \| 'dense' \| 'normal'` | `'none'` | Margen vertical. |
| `staticLabel` / `hiddenLabel` / `borderless` | `boolean` | `false` | Label siempre arriba / label oculto / sin borde. |
| `startIcon` / `endIcon` | `ReactNode` | — | Nombre de icono, URL de imagen o nodo. |
| `startAdornment` / `endAdornment` | `ReactNode` | — | Adorno libre (prefijo o sufijo). |
| `startAction` / `endAction` | `ReactNode` | — | Icono del IconButton de un adorno de acción. |
| `startActionLabel` / `endActionLabel` | `string` | — | Nombre accesible del botón de acción. |
| `onAdornmentClick` | `({ position, button, input }) => void` | — | Clic en un botón de acción. |
| `passwordToggle` | `boolean` | `false` | Botón mostrar/ocultar (`type="password"`). |
| `passwordToggleLabel` | `string` | traducido | Nombre accesible del botón de contraseña. |
| `passwordVisible` / `defaultPasswordVisible` | `boolean` | `false` | Visibilidad de la contraseña (controlada / inicial). |
| `onPasswordVisibilityChange` | `(visible: boolean) => void` | — | La contraseña se muestra u oculta. |
| `multiline` | `boolean` | `false` | Renderiza un `<textarea>`. |
| `rows` / `minRows` / `maxRows` | `number` | `3` / — / — | Filas; `minRows`/`maxRows` activan el auto-resize. |
| `autoResize` | `boolean` | `false` | La altura sigue al contenido. |
| `counter` | `'characters' \| 'words' \| 'both' \| boolean` | — | Tipo de contador. |
| `maxChars` / `maxWords` | `number` | `maxLength` / — | Límites del contador (no bloquean la escritura). |
| `mask` | `string` | — | Patrón, atajo o `currency`. |
| `currencyOptions` | `Partial<CurrencyMaskOptions>` | `$ ` `,` `.` `2` | Prefijo, sufijo, separadores y precisión. |
| `select` | `boolean` | `false` | `<select>` nativo; opciones como `children`. |
| `locale` | `string` | contexto | Idioma de los textos del contador y la contraseña. |
| `id`, `name`, `type`, `autoComplete`, `autoFocus`, `inputMode`, `maxLength`, `minLength`, `form` | | — | Se pasan al control nativo. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se pasan al control nativo. |
| `inputRef` | `Ref<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>` | — | Ref al control nativo. |
| `inputProps` | `InputHTMLAttributes` | — | Atributos extra del control nativo. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref a la raíz `.mtx-text-field`. |

Las utilidades de máscara (`resolveMask`, `formatMasked`, `unmaskValue`, `isMaskComplete`, `applyMaskInput`) se exportan junto al componente (`@rubenchodev/materix-react/components/text-field`).

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-text-field` | Contenedor raíz. |
| `mtx-text-field--outlined` / `--filled` / `--standard` | Variantes. |
| `mtx-text-field--no-label` | Outlined sin label ni muesca. |
| `mtx-text-field--small` / `--medium` / `--large` | Altura 40px / 56px / 48px. |
| `mtx-text-field--secondary` / `--success` / `--warning` / `--info` | Color de foco. |
| `mtx-text-field--error` | Estado de error. |
| `mtx-text-field--has-value` | El campo tiene valor, placeholder visible o es fecha/select (el label flota). |
| `mtx-text-field--adorned-start` / `--adorned-end` | Hay un adorno inicial / final. |
| `mtx-text-field--multiline` / `--auto-resize` | Campo multilínea / altura automática. |
| `mtx-text-field--select` | Envuelve un `<select>` nativo. |
| `mtx-text-field--static-label` / `--hidden-label` / `--borderless` | Modificadores de label y borde. |
| `mtx-text-field--full-width` / `--margin-dense` / `--margin-normal` | Ancho y márgenes. |
| `mtx-text-field__label` / `__container` / `__input` | Label, caja y control nativo. |
| `mtx-text-field__adornment` / `--start` / `--end` / `--image` / `--action` | Adornos (un `startAdornment` libre usa solo `mtx-text-field__adornment`, sin `--start`). |
| `mtx-text-field__action` / `--start` / `--end` | IconButton de un adorno de acción. |
| `mtx-text-field__outline` / `__legend` | `fieldset` y `legend` de la muesca (outlined). |
| `mtx-text-field__supporting-text` / `__helper-text` / `__counter` / `--error` | Fila inferior, texto de ayuda y contador. |
| `mtx-text-field__chevron` | Flecha de un `<select>`. |

### Variables CSS

| Variable | Por defecto | Descripción |
| :--- | :--- | :--- |
| `--mtx-tf-color` | `var(--mtx-color-primary)` | Color de foco de una instancia. |
| `--mtx-field-height-medium` / `--mtx-field-height-small` | `56px` / `40px` | Alturas. |
| `--mtx-size-large-height` | `48px` | Altura large. |
| `--mtx-color-input-filled` / `--mtx-color-input-filled-hover` | tema | Fondo de la variante filled. |

## Accesibilidad

- El label es un `<label for>` asociado al `id` del control (generado con `useId` si falta).
- El texto de ayuda y el contador (`.mtx-text-field__supporting-text`) se enlazan con `aria-describedby`, conservando los ids que pases y los de un FormControl padre.
- El estado de error (`error`, un FormControl padre o un límite superado) pone `aria-invalid="true"`.
- El contador usa `aria-live="polite"`. Los iconos generados llevan `aria-hidden="true"`.
- En `no-label` y `hiddenLabel` no hay label visible: añade un `aria-label`.
- `required` añade el asterisco visual; el atributo nativo lo anuncia a los lectores de pantalla.
- El botón de contraseña es un `<button type="button">` con `aria-label` traducido, `aria-pressed` y `aria-controls`; los botones de acción necesitan `startActionLabel` / `endActionLabel`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al campo siguiente o anterior (y a sus botones). |
| Teclas de texto | Escriben en el campo; con máscara se insertan los literales y se descartan los caracteres no válidos. |
| <kbd>Enter</kbd> | Nueva línea en un `<textarea>`; envía el formulario en un `<input>` (nativo). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en un botón de adorno | Muestra u oculta la contraseña o ejecuta la acción. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<input data-mtx="text-field" data-label="…">` | `<TextField label="…" />` |
| `<textarea data-mtx="textarea">` / `data-multiline` | `multiline` |
| `<select data-mtx="text-field">` | `select` + hijos `<option>` |
| `data-variant="filled"` | `variant="filled"` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-color="secondary"` | `color="secondary"` |
| `data-start-icon` / `data-end-icon` | `startIcon` / `endIcon` |
| `data-start-action` / `data-end-action` (+ `-label`) | `startAction` / `endAction` (+ `startActionLabel` / `endActionLabel`) |
| `data-password-toggle` / `data-password-toggle-label` | `passwordToggle` / `passwordToggleLabel` |
| `data-helper-text` | `helperText` |
| `data-error="mensaje"` / `setError('mensaje')` | `error` + `helperText="mensaje"` |
| `data-rows` / `data-auto-resize` / `data-max-rows` | `rows` / `autoResize` / `maxRows` |
| `data-counter` / `data-max-characters` / `data-max-words` | `counter` / `maxChars` / `maxWords` |
| `data-mask` / `data-currency-prefix`, `-suffix`, `data-thousands`, `data-decimal`, `data-precision` | `mask` / `currencyOptions` |
| `class="mtx-text-field--static-label"` (y `--hidden-label`, `--borderless`, `--margin-dense`, `--full-width`) | `staticLabel`, `hiddenLabel`, `borderless`, `margin="dense"`, `fullWidth` |
| `field.value` / `field.unmaskedValue` / `field.isMaskComplete` | `value` + `onChange(event, value, { unmaskedValue, isMaskComplete })` |
| `disable()` / `enable()` / `focus()` / `blur()` | `disabled` / `inputRef.current.focus()` / `.blur()` |
| `togglePasswordVisibility()` / `passwordVisible` | `passwordVisible` + `onPasswordVisibilityChange` |
| `mtx:text-field:password-visibility` | `onPasswordVisibilityChange(visible)` |
| `mtx:text-field:adornment-click` | `onAdornmentClick({ position, button, input })` |
