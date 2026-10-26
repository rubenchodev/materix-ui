---
title: "Link"
description: "Enlace de texto con estilo MUI sobre un <a> nativo: colores de la paleta y tres modos de subrayado, sin perder la semántica."
group: "navigation"
icon: "link"
weight: 20
example: "link"
import: "Link"
mui: "https://mui.com/material-ui/react-link/"
---

`Link` aplica el estilo de enlace de MUI (color primario, subrayado siempre por defecto) sobre un `<a>` nativo, sobre un `<button>` para acciones que no navegan o sobre el componente de enlace de tu router. Hereda la tipografía del texto que lo rodea.

```tsx
import { Link } from '@rubenchodev/materix-react';
// o solo este componente:
import { Link } from '@rubenchodev/materix-react/components/link';
```

## Uso básico

`<Link href="…">` renderiza un `<a class="mtx-link">`. Sin más props usa el color primario y va siempre subrayado (por defecto en MUI v5), así que nunca depende solo del color.

{{< react-demo id="link/01-basic" layout="block" >}}

## Subrayado

La variante del enlace es su subrayado: `underline="always|hover|none"`. `always` es el valor por defecto: un subrayado suave (40 % del color) que se vuelve sólido al pasar el ratón. Usa `hover` o `none` solo en enlaces fuera de texto corrido (navegación, listas, pies de página).

{{< react-demo id="link/02-underline" layout="block" >}}

## Colores

`color` acepta los seis colores de la paleta, los de texto (`text-primary`, `text-secondary`) e `inherit`, que toma el color del texto que lo rodea (aquí, dentro de un Alert).

{{< react-demo id="link/03-colors" layout="block" >}}

## Estados

Pasa el ratón para ver el subrayado y usa <kbd>Tab</kbd> para ver el anillo de foco. `disabled` deshabilita el enlace: en `<a>` pone `aria-disabled="true"`, lo saca del orden de tabulación y cancela los clics; en `<button>` usa el atributo nativo `disabled`.

{{< react-demo id="link/04-states" layout="block" >}}

## Como botón

Para acciones que no navegan pero deben verse como enlace dentro de un texto, usa `component="button"` (sin fondo, borde ni relleno nativos y con la tipografía del texto que lo rodea). Sin `type`, recibe `type="button"` para no enviar formularios.

{{< react-demo id="link/05-as-button" layout="block" >}}

## Dentro de un párrafo

Dentro de texto corrido mantén el subrayado por defecto (`always`) para que el enlace no dependa solo del color (WCAG 1.4.1). El enlace hereda la tipografía del párrafo, así que encaja en cualquier variante.

{{< react-demo id="link/06-in-paragraph" layout="block" >}}

## Enlaces externos

Con `target="_blank"` añade siempre `rel="noopener noreferrer"` y anuncia el cambio de contexto en el texto visible o en un `aria-label` que lo contenga.

{{< react-demo id="link/07-external" layout="block" >}}

## Ejemplos reales

Enlaces secundarios bajo un formulario de inicio de sesión y una ruta de navegación.

{{< react-demo id="link/08-real-world" layout="block" >}}

## En una grilla

Pie de página con columnas de enlaces en un `Grid`: una columna en móvil, dos en tableta y cuatro en escritorio.

{{< react-demo id="link/09-grid" layout="block" >}}

## Uso programático y enlaces de router

Los enlaces se crean desde el estado (no hay métodos). `component` aplica el estilo de Link sobre cualquier componente: el `Link` de React Router, el de Next.js, etc. Sus props (`to`, `prefetch`…) se reenvían.

{{< react-demo id="link/10-programmatic" layout="block" >}}

```tsx
import { Link as RouterLink } from 'react-router-dom';

<Link component={RouterLink} to="/dashboard">Panel</Link>
```

## API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` \| `'text-primary'` \| `'text-secondary'` \| `'inherit'` | primario (CSS) | Añade `.mtx-link--{color}` y `.mtx-link--color-{color}`. |
| `underline` | `'always'` \| `'hover'` \| `'none'` | `always` (CSS) | Añade `.mtx-link--underline-{modo}`. |
| `disabled` | `boolean` | `false` | `<button>`: `disabled`. Resto: `aria-disabled="true"`, `tabIndex={-1}` y clics cancelados. |
| `component` | `ElementType` | `'a'` | Elemento o componente raíz (`'button'`, un enlace de router…). |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

El resto de props (`href`, `target`, `rel`, `onClick`, `aria-*`…) se reenvían al elemento raíz.

### Callbacks

| Callback | Descripción |
|---|---|
| `onClick(event)` | Clic nativo. No se llama mientras está `disabled`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-link` | Base: color primario, subrayado `always`, anillo de foco. |
| `.mtx-link--{color}` / `.mtx-link--color-{color}` | Color del enlace. |
| `.mtx-link--underline-{always\|hover\|none}` | Modo de subrayado. |
| `button.mtx-link` | Elimina el aspecto de botón nativo. |

## Accesibilidad

- Usa `<a href>` para navegar: es enfocable, se activa con <kbd>Enter</kbd> y se anuncia como enlace. Para una acción sin destino dentro de un texto usa `component="button"`; para acciones destacadas, Button.
- El texto debe describir el destino («Leer la política de privacidad»), no «haz clic aquí».
- Dentro de párrafos mantén el subrayado `always` (WCAG 1.4.1, axe `link-in-text-block`).
- Un `<a>` deshabilitado conserva su `href`, pero sale del orden de tabulación y se anuncia como deshabilitado.
- El foco de teclado muestra un anillo de `--mtx-focus-ring-width` con 2 px de separación.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al enlace siguiente o anterior. |
| <kbd>Enter</kbd> | Sigue el enlace (o ejecuta la acción con `component="button"`). |
| <kbd>Espacio</kbd> | Ejecuta la acción con `component="button"`. |

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<a data-mtx="link" href="/">` | `<Link href="/">` |
| `<button data-mtx="link">` | `<Link component="button">` |
| `data-color="secondary"` | `color="secondary"` |
| `data-underline="hover"` | `underline="hover"` |
| `data-disabled` / `link.disable()` / `link.enable()` | `disabled` (controlado por la prop) |

El DOM renderizado (clases, `type`, `disabled`, `aria-disabled` y `tabindex`) es idéntico al del componente vanilla tras inicializarse.
