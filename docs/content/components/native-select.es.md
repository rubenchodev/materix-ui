---
title: "Native Select"
description: "El <select> del navegador con estética MUI: ligero, accesible por defecto y con el selector táctil nativo en móviles."
group: "inputs"
icon: "arrow_drop_down_circle"
weight: 90
example: "native-select"
import: "NativeSelect"
mui: "https://mui.com/material-ui/react-select/#native-select"
---

`NativeSelect` aplica la estética de MUI al `<select>` del navegador sin sustituir su menú: la lista la dibuja el sistema operativo, lo que lo hace el selector más ligero, rápido con listas largas y cómodo en móviles. Úsalo en formularios simples. Si necesitas búsqueda, multiselección con casillas o iconos en las opciones, usa [Select](../select/).

{{< callout type="info" title="¿Select o NativeSelect?" >}}
| Necesidad | [Select](../select/) | NativeSelect |
| :--- | :--- | :--- |
| Menú con estética MUI (Paper, marca de selección) | Sí | No, usa el del sistema |
| Búsqueda dentro del menú | Sí | No |
| Selección múltiple cómoda | Sí, con casillas | Lista nativa (`multiple`, Ctrl/Cmd + clic) |
| Iconos o imágenes en las opciones | Sí | No |
| Peso y rendimiento con miles de opciones | Medio | Mínimo |
| Experiencia táctil nativa en móviles | Menú propio | Selector del sistema |

Regla práctica: **NativeSelect** para formularios simples y listas largas en móvil; **Select** cuando necesites búsqueda, selección múltiple, iconos o coherencia visual total.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { NativeSelect } from '@rubenchodev/materix-react';

<NativeSelect label="Edad" name="age" defaultValue="20">
  <option value="10">Diez</option>
  <option value="20">Veinte</option>
</NativeSelect>
```

## Uso básico

Basta un elemento con `label`: el componente genera el contenedor, el label flotante (asociado con `for`/`id`, así el select ya tiene nombre accesible), el `<select>` nativo y el chevron. Como en NativeSelect de MUI, la variante predeterminada es `standard`. Las opciones se escriben como hijos `<option>`/`<optgroup>` o se pasan con la prop `options`.

{{< react-demo "native-select/01-basic" >}}

## Variantes

`outlined` (borde completo), `filled` (fondo y esquinas superiores redondeadas) y `standard` (línea inferior, predeterminada) con `variant`.

{{< react-demo "native-select/02-variants" >}}

## Tamaños

Medium 56px (por defecto) y small 40px con `size="small"` (también reduce el texto a 14px). Las alturas coinciden con TextField y Select, así un NativeSelect small se alinea con un [TextField](../text-field/) small y un Button medium.

{{< react-demo id="native-select/03-sizes" layout="block" >}}

## Estados

`error` pinta de rojo el borde, el label y el chevron y añade `aria-invalid="true"`; `disabled` deshabilita el `<select>`; `required` añade el atributo nativo y el asterisco al label. Al enfocar, el borde y el label pasan al color primario.

{{< react-demo "native-select/04-states" >}}

## Texto de ayuda y de error

Fuera de un `FormControl` el campo siempre va envuelto en `.mtx-form-control` (así el select no se remonta y conserva el foco cuando aparece el texto de ayuda); `helperText` añade debajo un [FormHelperText](../form-helper-text/) enlazado con `aria-describedby`. Junto con `error` se convierte en el mensaje de error. Dentro de un `FormControl` el select hereda `error`, `disabled` y `required`.

{{< react-demo "native-select/05-helper-text" >}}

## Grupos y selección múltiple

`<optgroup>` y `<option disabled>` funcionan de forma nativa, también con `options` (un elemento con `options` se convierte en `<optgroup>`). Con `multiple` (y `htmlSize` para las filas visibles) se muestra la lista del navegador con el borde o fondo de su variante y sin chevron; `value`/`onChange` usan entonces un array.

{{< react-demo id="native-select/06-groups-multiple" layout="block" >}}

## Casos de uso reales

Un formulario rápido de dirección en móvil: al tocar cada campo aparece el selector del sistema y los valores se envían con el formulario.

{{< react-demo "native-select/07-use-cases" >}}

## ¿Select o NativeSelect?

Los mismos datos con ambos componentes: NativeSelect abre el menú del sistema y [Select](../select/) dibuja su propio menú MUI con búsqueda.

{{< react-demo "native-select/08-comparison" >}}

## Grilla

Dentro de un [Grid](../grid/) cada select ocupa todo el ancho de su columna: uno por fila en móvil, dos desde 600px y cuatro desde 900px.

{{< react-demo "native-select/09-grid" >}}

## Uso controlado

Con `value` + `onChange` el padre es dueño del valor; los métodos de la instancia vanilla pasan a ser cambios de estado (`value = …` → `setValue`, `disable()` → `disabled`) y `focus()` usa `inputRef`.

{{< react-demo "native-select/10-controlled" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'standard' \| 'outlined' \| 'filled'` | `'standard'` | Variante visual. |
| `size` | `'medium' \| 'small'` | `'medium'` | 56px o 40px (texto de 14px). |
| `label` | `ReactNode` | — | Label flotante asociado al select. |
| `value` | `string \| number \| string[]` | — | Valor (controlado); un array con `multiple`. |
| `defaultValue` | `string \| number \| string[]` | — | Valor inicial (no controlado). |
| `onChange` | `(event, value: string \| string[]) => void` | — | Se invoca cuando el usuario elige otra opción. |
| `options` | `Array<{ value, label, disabled? } \| { label, options, disabled? }>` | — | Opciones como datos; los grupos generan `<optgroup>`. Se renderizan antes de `children`. |
| `multiple` | `boolean` | `false` | Lista nativa (sin chevron). |
| `htmlSize` | `number` | — | Filas visibles (atributo `size` nativo). |
| `error` | `boolean` | de `FormControl` | `aria-invalid` y colores de error. |
| `helperText` | `ReactNode` | — | Texto de ayuda o de error bajo el campo. |
| `disabled` | `boolean` | de `FormControl` | Deshabilita el select. |
| `required` | `boolean` | de `FormControl` | `required` nativo y asterisco. |
| `fullWidth` | `boolean` | `true` | Ocupa el ancho del contenedor (comportamiento vanilla); `false` se ajusta al contenido. |
| `id`, `name`, `form`, `autoComplete`, `autoFocus` | | — | Se pasan al `<select>`. |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Se pasan al `<select>`. |
| `inputRef` | `Ref<HTMLSelectElement>` | — | Ref al select nativo. |
| `inputProps` | `SelectHTMLAttributes` | — | Atributos extra del select nativo. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al `<div>` raíz. |

`className`, `style` y cualquier otro atributo van al `<div>` raíz.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-native-select` | Contenedor raíz. |
| `.mtx-native-select--outlined` / `--filled` / `--standard` | Variantes. |
| `.mtx-native-select--small` | Altura de 40px. |
| `.mtx-native-select--error` | Estado de error. |
| `.mtx-native-select--multiple` | `<select multiple>` (altura automática, sin chevron). |
| `.mtx-native-select--has-label` | Hay label (en filled, el valor baja). |
| `.mtx-native-select__label` | Label flotante. |
| `.mtx-native-select__input` | `<select>` nativo. |
| `.mtx-native-select__chevron` | Flecha decorativa. |
| `.mtx-form-control` / `.mtx-form-helper-text` | Envoltorio (siempre, fuera de un `FormControl`) y texto de ayuda cuando hay `helperText`. |

### Variables CSS

No tiene variables propias; usa `--mtx-control-height-outlined|filled|standard` (56px), sus variantes `-small` (40px), `--mtx-color-input-filled`, `--mtx-color-divider`, `--mtx-color-primary` y `--mtx-color-error`.

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<select data-mtx="native-select" data-label="…">` | `<NativeSelect label="…">` |
| `data-variant="outlined"` | `variant="outlined"` |
| `data-size="small"` / `data-small` | `size="small"` |
| `data-error` | `error` (+ `helperText` para el mensaje) |
| `disabled` / `disable()` / `enable()` | `disabled` |
| `multiple size="4"` | `multiple htmlSize={4}` |
| `selected` en las opciones | `defaultValue` (no controlado) o `value` + `onChange` |
| `instance.value = …` | Actualizar el estado `value` |
| `focus()` | `inputRef.current.focus()` |
| Evento nativo `change` | `onChange(event, value)` |

## Accesibilidad

- Es un `<select>` real: el navegador y los lectores de pantalla lo anuncian y manejan de forma nativa.
- El `label` se asocia al `<select>` con `for`/`id`, así el nombre accesible es el texto del label. Sin label, usa `aria-label` o `aria-labelledby`.
- `error` añade `aria-invalid="true"`; `helperText` se enlaza con `aria-describedby`; el chevron es decorativo (`aria-hidden`).

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Enfoca el select. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Cambia de opción (o abre la lista, según el sistema). |
| <kbd>Alt</kbd> + <kbd>↓</kbd> / <kbd>Espacio</kbd> | Abre la lista del sistema. |
| Letras | Saltan a la opción que empieza por esa letra. |
| <kbd>Esc</kbd> | Cierra la lista sin cambiar el valor. |
