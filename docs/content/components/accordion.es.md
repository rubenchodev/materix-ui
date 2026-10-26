---
title: "Accordion"
description: "Paneles que muestran y ocultan secciones de contenido relacionado tras un resumen pulsable; ideal para FAQ y ajustes agrupados."
group: "surfaces"
icon: "expand_circle_down"
weight: 5
example: "accordion"
import: "Accordion, AccordionSummary, AccordionDetails, AccordionActions, AccordionGroup"
mui: "https://mui.com/material-ui/react-accordion/"
---

`Accordion` organiza el contenido en paneles plegables: un resumen pulsable (AccordionSummary) muestra u oculta los detalles (AccordionDetails) con una transición de altura. Úsalo para preguntas frecuentes, ajustes por secciones o información secundaria que no debe ocupar espacio de forma permanente. No lo uses para la navegación principal (usa [Tabs](../tabs/) o un [Drawer](../drawer/)) ni para ocultar contenido que el usuario siempre necesita ver.

```tsx
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react';
// o solo este componente:
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';
```

## Uso básico

La forma más simple: la prop `summary` es el texto del resumen y los hijos pasan a ser los detalles (el equivalente de la sintaxis simplificada vanilla con `data-summary`). Genera la cabecera `<h3>`, el `<button>` con `aria-expanded` y `aria-controls`, el icono `expand_more` y la región plegable. Los paneles contiguos comparten separadores de 1px y solo el primero y el último llevan esquinas redondeadas.

{{< react-demo id="accordion/01-basic" layout="block" >}}

## Desde details

`component="details"` renderiza un `<details>`/`<summary>` nativo: con renderizado en servidor funciona incluso antes de que React hidrate. El panel conserva el aspecto MUI, la animación de altura y el icono; `defaultExpanded` fija `open` y la búsqueda del navegador (Ctrl+F) abre el panel que contiene la coincidencia (se notifica con `onChange`).

{{< react-demo id="accordion/02-details" layout="block" >}}

{{< callout type="info" >}}Un `<summary>` no puede ir dentro de una cabecera, así que la forma `details` no genera `<h3>`. Si el esquema de cabeceras importa en tu página, usa la forma `div` por defecto.{{< /callout >}}

## Variantes

Por defecto el acordeón es una superficie [Paper](../paper/) con elevación 1. `variant="outlined"` usa un borde de 1px (los bordes contiguos se fusionan), `elevation={0}` lo deja plano y `square` elimina las esquinas redondeadas.

{{< react-demo id="accordion/03-variants" layout="block" >}}

## Estilo del resumen

Por defecto el resumen usa peso medio (500) y, mientras el panel está expandido, un fondo `--mtx-color-action-selected` y un divisor inferior, también en la variante `outlined`. El foco (`--mtx-color-action-focus`) prevalece sobre ese fondo. `summaryStyle="plain"` (en el panel o en el grupo) recupera el aspecto plano de MUI: peso normal, sin fondo ni divisor. Ajústalo con las variables CSS `--mtx-accordion-summary-*`.

{{< callout type="info" title="Desviación deliberada de MUI" >}}
El `AccordionSummary` de MUI usa peso normal y el mismo fondo que los detalles. Materix destaca el resumen por defecto para que la cabecera de un panel abierto se distinga de su contenido. Usa `summaryStyle="plain"` para el aspecto original de MUI.
{{< /callout >}}

{{< react-demo id="accordion/04-summary-style" layout="block" >}}

## Márgenes (gutters)

Al expandirse, el panel recibe un margen vertical de 16px y el resumen crece de 48px a 64px. `disableGutters` mantiene los 48px y quita el margen.

{{< react-demo id="accordion/05-gutters" layout="block" >}}

## Con iconos

El icono de expansión es `expand_more` y gira 180° al abrir. `expandIcon` acepta un nombre de Material Icons o cualquier nodo (por ejemplo un SVG), y `expandIcon={false}` lo omite. El ángulo de giro se fija con la variable `--mtx-accordion-expand-icon-rotation` (por ejemplo `45deg` para un icono `add`). La prop `summary` también admite nodos, como un icono inicial.

{{< react-demo id="accordion/06-icons" layout="block" >}}

## Estados

El foco de teclado pinta el resumen con el fondo `action.focus`, como MUI. `disabled` atenúa el resumen al 38 %, aplica el fondo deshabilitado y bloquea la interacción. Como en MUI, el resumen no tiene ripple por defecto; `ripple` lo activa. `duration` fija el tiempo del plegado en milisegundos (`'auto'`, el valor por defecto, lo deriva de la altura con la fórmula de MUI; `0` desactiva la animación).

{{< react-demo id="accordion/07-states" layout="block" >}}

## Grupo exclusivo

`AccordionGroup` mantiene un solo panel abierto (el patrón "Controlled accordion" de MUI) y habilita la navegación con flechas, Inicio y Fin entre resúmenes. Con `exclusive={false}` puede haber varios abiertos. El grupo transmite `variant`, `elevation`, `square`, `disableGutters` y `summaryStyle` a los paneles que no los declaran. Si varios paneles empiezan con `defaultExpanded` en un grupo exclusivo, solo el primero queda abierto.

{{< react-demo id="accordion/08-exclusive-group" layout="block" >}}

## Acciones

Un hijo `AccordionActions` se coloca al pie de la región, tras los detalles, alineado a la derecha y con 8px entre botones. `disableSpacing` quita esa separación.

{{< react-demo id="accordion/09-actions" layout="block" >}}

## Ejemplos reales

Unas preguntas frecuentes con `component="details"` dentro de un grupo exclusivo, y unos ajustes cuyo resumen lleva texto secundario (`AccordionSummary` con `secondary`, como en la demo "Controlled accordion" de MUI).

{{< react-demo id="accordion/10-use-cases" layout="block" >}}

### Acordeones en una grilla

{{< react-demo id="accordion/11-grid" layout="block" >}}

## Uso programático

`expand()`, `collapse()`, `toggle()` y el setter `expanded` de vanilla pasan a ser la prop controlada `expanded` más `onChange`, que sustituye al evento `mtx:accordion:change`. Los métodos `expandAll()` y `collapseAll()` de `AccordionGroup` están disponibles con `actionRef`.

{{< react-demo id="accordion/12-programmatic" layout="block" >}}

```tsx
const [expanded, setExpanded] = useState(false);

<Accordion summary="Panel" expanded={expanded} onChange={(event, next) => setExpanded(next)}>
  Contenido
</Accordion>;

const group = useRef<AccordionGroupActions>(null);
<AccordionGroup exclusive={false} actionRef={group}>…</AccordionGroup>;
group.current?.collapseAll();
```

## Composición con subcomponentes

Para un control total (el equivalente de la sintaxis BEM vanilla), compón `AccordionSummary`, `AccordionDetails` y `AccordionActions`. Si no hay `AccordionDetails`, el resto de hijos se envuelve en uno; las acciones siempre van tras los detalles.

{{< react-demo id="accordion/13-composition" layout="block" >}}

## Referencia de la API

### Accordion

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `summary` | `ReactNode` | — | Contenido del resumen (sintaxis simplificada). Se ignora si hay un hijo `AccordionSummary`. |
| `expanded` | `boolean` | — | Estado expandido (controlado). |
| `defaultExpanded` | `boolean` | `false` | Estado inicial (no controlado). |
| `onChange` | `(event: SyntheticEvent \| null, expanded: boolean) => void` | — | Cambio de estado (clic, teclado, búsqueda en página o cierre por exclusividad). `event` es `null` si no procede de React (búsqueda en página, `actionRef`). |
| `disabled` | `boolean` | `false` | Deshabilita el panel. |
| `variant` | `'elevation' \| 'outlined'` | `'elevation'` | Sombra o borde de 1px. Heredable del grupo. |
| `elevation` | `0 \| 1 \| 2 \| 3 \| 4 \| 6 \| 8` | elevación 1 del CSS | Sombra de la superficie. Heredable del grupo. |
| `square` | `boolean` | `false` | Sin esquinas redondeadas. Heredable del grupo. |
| `disableGutters` | `boolean` | `false` | Sin margen ni cambio de altura al expandir. Heredable del grupo. |
| `summaryStyle` | `'emphasized' \| 'plain'` | `'emphasized'` | `plain`: resumen plano de MUI. Heredable del grupo. |
| `expandIcon` | `ReactNode \| false` | `'expand_more'` | Icono de expansión (nombre de Material Icons o nodo); `false` lo omite. |
| `headingLevel` | `1`–`6` \| `'none'` | `3` | Cabecera que envuelve el resumen (solo forma `div`). |
| `ripple` | `boolean` | `false` | Ripple al pulsar el resumen. |
| `duration` | `number \| 'auto'` | `'auto'` | Duración del plegado en ms; `0` = sin animación. |
| `component` | `'div' \| 'details'` | `'div'` | `details` usa `<details>/<summary>` nativos. |

`ref`, `id`, `className`, `style` y el resto de atributos van a la raíz. `id` sirve de base para los ids del resumen (`{id}-summary`) y de la región (`{id}-region`).

### AccordionGroup

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `exclusive` | `boolean` | `true` | Un solo panel abierto. |
| `variant`, `elevation`, `square`, `disableGutters`, `summaryStyle` | como en `Accordion` | — | Opciones heredadas por los paneles. |
| `actionRef` | `Ref<AccordionGroupActions>` | — | Recibe `expandAll()` (solo grupos no exclusivos) y `collapseAll()`. |

### Partes

| Componente | Props | Descripción |
|---|---|---|
| `AccordionSummary` | `children`, `secondary`, `expandIcon` | Cabecera + `<button>` (o `<summary>`); `ref` apunta al botón. |
| `AccordionDetails` | — | `.mtx-accordion__details`. |
| `AccordionActions` | `disableSpacing` | `.mtx-accordion-actions`, colocada tras los detalles. |

### Callbacks

| Callback | Argumentos | Evento vanilla |
|---|---|---|
| `Accordion.onChange` | `(event: SyntheticEvent \| null, expanded: boolean)` | `mtx:accordion:change` (`detail.expanded`) |

`onChange` se dispara con el clic, el teclado (Enter/Espacio), la búsqueda en página (`beforematch` o el `toggle` nativo de `<details>`, con `event = null` en `beforematch`), `actionRef` (`event = null`) y cuando un grupo exclusivo cierra el panel porque se abrió otro (con el evento que lo provocó). En modo controlado el estado solo cambia si actualizas `expanded`.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-summary` | `summary` |
| `data-expanded` / `details[open]` | `defaultExpanded` (o `expanded` controlado) |
| `data-disabled`, `disable()` / `enable()` | `disabled` |
| `data-variant`, `data-elevation`, `data-square`, `data-disable-gutters`, `data-summary-style` | `variant`, `elevation`, `square`, `disableGutters`, `summaryStyle` |
| `data-expand-icon`, `data-heading-level`, `data-ripple`, `data-duration` | `expandIcon`, `headingLevel`, `ripple`, `duration` |
| `<details data-mtx="accordion">` | `component="details"` |
| `data-mtx="accordion-group"`, `data-exclusive="false"` | `AccordionGroup`, `exclusive={false}` |
| `data-mtx="accordion-actions"`, `data-disable-spacing` | `AccordionActions`, `disableSpacing` |
| `expand()`, `collapse()`, `toggle()`, `expanded` | `expanded` + `onChange` |
| `AccordionGroup#expandAll()` / `collapseAll()` | `actionRef` |
| `mtx:accordion:change` (`detail.expanded`) | `onChange(event, expanded)` |

### Clases y variables CSS

Las mismas que la librería vanilla: `mtx-accordion` (`--expanded`, `--outlined`, `--elevation-{n}`, `--square`, `--disable-gutters`, `--disabled`, `--plain-summary`), `mtx-accordion__heading`, `__summary`, `__summary-content`, `__summary-secondary`, `__expand-icon`, `__region`, `__details`, `mtx-accordion-actions` (`--disable-spacing`) y `mtx-accordion-group`. Variables: `--mtx-accordion-expand-icon-rotation` (180deg), `--mtx-accordion-gutter` (16px), `--mtx-accordion-summary-font-weight` (500), `--mtx-accordion-summary-expanded-bg` y `--mtx-accordion-summary-expanded-divider`.

## Accesibilidad

- El resumen es un `<button>` (o el `<summary>` nativo) con `aria-expanded` y `aria-controls`; en la forma `div` va dentro de un `<h3>` (configurable con `headingLevel`), como recomienda el patrón Accordion de WAI-ARIA.
- La región tiene `role="region"` y `aria-labelledby` apuntando al resumen. Cerrada queda fuera del foco y de los lectores de pantalla, y con `hidden="until-found"` donde el navegador lo soporta, para que Ctrl+F pueda encontrar y mostrar su contenido.
- Deshabilitado: el `<button>` recibe `disabled`; el `<summary>`, `aria-disabled="true"` y `tabindex="-1"`.
- La transición respeta `prefers-reduced-motion`.

| Tecla | Acción |
|---|---|
| `Enter` / `Espacio` | Alterna el panel enfocado. |
| `Tab` / `Mayús+Tab` | Recorre los resúmenes y el contenido de los paneles abiertos. |
| `↓` / `↑` | En un `AccordionGroup`: enfoca el resumen siguiente / anterior (cíclico, salta los deshabilitados). |
| `Inicio` / `Fin` | En un `AccordionGroup`: enfoca el primer / último resumen. |
