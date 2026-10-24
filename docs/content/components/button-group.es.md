---
title: "Button Group"
description: "Agrupa botones relacionados en una sola pieza con bordes unidos, separadores y la variante, tamaño y color heredados."
group: "inputs"
icon: "view_week"
weight: 15
example: "button-group"
import: "Button, ButtonGroup"
mui: "https://mui.com/material-ui/react-button-group/"
---

**Button Group** une [Buttons](../button/) relacionados en una sola pieza: bordes compartidos, separadores entre ellos y la misma variante, tamaño y color. Úsalo para conjuntos de acciones del mismo nivel (alineación de texto, filtros de periodo, formatos de exportación) y para el patrón *split button*.

## Importación

```tsx
import { Button, ButtonGroup } from '@rubenchodev/materix-react';
```

## Uso básico

Un `<ButtonGroup>` con hijos `<Button>`: el grupo pasa su variante (outlined por defecto) a los botones mediante contexto, calcula su posición (`first` / `middle` / `last`) y renderiza `role="group"`. Dale un nombre con `label` o `aria-label`.

{{< react-demo "button-group/01-basic" >}}

## Variantes

`variant="outlined|contained|text"`, como en MUI. Outlined superpone los bordes; contained separa con el tono oscuro del color y lleva la elevación al grupo; text separa con una línea al 50%.

{{< react-demo id="button-group/02-variants" layout="column" >}}

## Tamaños

`size="small|medium|large"` se hereda en todos los botones (32, 40 y 48px).

{{< react-demo id="button-group/03-sizes" layout="column" >}}

## Con iconos

Cada hijo acepta las props de Button (`startIcon`, `endIcon`). Para botones de solo icono, pon un `span.material-icons` como único hijo y un `aria-label`: el grupo compacta su relleno.

{{< react-demo id="button-group/04-icons" layout="column" >}}

## Colores

`color` acepta los colores de la paleta e `inherit`; un hijo con su propio `color` (o `variant`, `size`) lo conserva.

{{< react-demo id="button-group/05-colors" layout="column" >}}

## Orientación

`orientation="vertical"` apila los botones. Mantiene `role="group"`, que no admite `aria-orientation`; con `role="toolbar"` el grupo añade `aria-orientation="vertical"`.

{{< react-demo "button-group/06-orientation" >}}

## Ancho completo

`fullWidth` ocupa todo el ancho y reparte el espacio por igual.

{{< react-demo id="button-group/07-full-width" layout="block" >}}

## Estados

`disabled` deshabilita todos los botones del grupo y le pone `aria-disabled="true"`; un hijo puede deshabilitarse por separado. `disableElevation` quita la sombra del grupo contained.

{{< react-demo id="button-group/08-states" layout="column" >}}

## Split button

Patrón de MUI: la acción principal más un botón de flecha que abre un menú con las alternativas. Dale a la flecha un `aria-label` y `aria-haspopup="menu"`; el Menu añade `aria-expanded` y `aria-controls`, y debe anclarse al grupo para alinearse con todo su ancho. En esta demo la flecha abre un [Menu](../menu/) anclado al grupo (`matchWidth`); elegir una opción la convierte en la acción principal y el foco vuelve a la flecha.

{{< react-demo id="button-group/09-split-button" layout="block" >}}

## Maquetación en grilla

Con `fullWidth` el grupo se adapta a la columna de la grilla.

{{< react-demo id="button-group/10-grid" layout="block" >}}

## Uso programático

El grupo es declarativo: cambia `disabled` o renderiza más hijos y las posiciones se recalculan en cada render (no hace falta `refresh()`).

{{< react-demo id="button-group/11-programmatic" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'outlined' \| 'contained' \| 'text'` | `'outlined'` | Variante heredada por los botones. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño heredado. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | Color heredado. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección. |
| `fullWidth` | `boolean` | `false` | Ancho completo; también se pasa a los botones. |
| `disabled` | `boolean` | `false` | Deshabilita todos los botones. |
| `disableElevation` | `boolean` | `false` | Sin sombra en contained. |
| `label` | `string` | — | Nombre accesible (`aria-label`). |
| `role` | `string` | `'group'` | Rol de la raíz (`toolbar` si añades navegación con flechas). |

El resto de props van al `<div>` raíz; `className` se concatena y `ref` apunta a él. Se exporta `ButtonGroupContext` para hijos personalizados.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-button-group` | Contenedor. |
| `mtx-button-group--{outlined,contained,text}` | Variante. |
| `mtx-button-group--horizontal` · `--vertical` | Orientación. |
| `mtx-button-group--{color}` · `--small` · `--large` | Color y tamaño. |
| `mtx-button-group--full-width` · `--disable-elevation` · `--disabled` | Modificadores. |
| `mtx-button-group__grouped` | Cada botón hijo. |
| `mtx-button-group__first` · `__middle` · `__last` | Posición del hijo (bordes y separadores). |

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `data-variant` · `data-size` · `data-color` | `variant` · `size` · `color` |
| `data-orientation="vertical"` | `orientation="vertical"` |
| `data-full-width` · `data-disable-elevation` · `data-disabled` | `fullWidth` · `disableElevation` · `disabled` |
| `data-label` | `label` |
| `disable()` / `enable()` · `refresh()` | prop `disabled` · automático en cada render |
| `<button data-open-menu>` + Menu | `<Button>` de flecha + Menu (`onClick`) |

## Accesibilidad

- El contenedor renderiza `role="group"`; nómbralo con `label` o `aria-label` para que los lectores de pantalla anuncien el propósito del conjunto.
- Cada hijo es un `<button>` nativo (o `<a>`): el orden de tabulación es el natural, sin roving tabindex.
- Los botones de solo icono necesitan `aria-label`; el icono, `aria-hidden="true"`.
- `disabled` usa el `disabled` nativo (o `aria-disabled` en enlaces) y pone `aria-disabled="true"` en el grupo.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Mueve el foco entre los botones del grupo. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa el botón enfocado. |
