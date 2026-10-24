---
title: "Tabs"
description: "Pestañas para alternar entre vistas del mismo nivel, con indicador animado, iconos, orientación vertical y navegación completa por teclado."
group: "navigation"
icon: "tab"
weight: 40
example: "tabs"
import: "Tabs, Tab, TabPanel, TabContext, TabsContainer"
mui: "https://mui.com/material-ui/react-tabs/"
---

**Tabs** organiza contenido relacionado en vistas del mismo nivel y permite alternar entre ellas sin salir de la página, con un indicador que se desliza bajo la pestaña activa. Úsalo cuando haya entre dos y unas siete secciones hermanas que se consultan de una en una (perfil, seguridad, notificaciones). No lo uses para pasos secuenciales ni para navegar entre páginas principales.

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react';

<TabContext defaultValue="overview">
  <Tabs aria-label="Proyecto">
    <Tab value="overview" label="Resumen" />
    <Tab value="activity" label="Actividad" />
  </Tabs>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
</TabContext>
```

## Uso básico

`TabContext` comparte el valor activo entre `Tabs` y los `TabPanel`: genera los ids, enlaza `aria-controls` / `aria-labelledby` y oculta los paneles inactivos con `hidden`. Sin `defaultValue`, se activa la primera pestaña habilitada. `TabsContainer` es opcional: agrupa pestañas y paneles sobre una superficie con borde (`.mtx-tabs-container`).

{{< react-demo id="tabs/01-basic" layout="block" >}}

## Variantes

Por defecto las pestañas tienen su ancho natural (`variant="standard"`). `variant="fullWidth"` reparte el ancho entre ellas y `centered` las centra. Un `Tab` sin `value` recibe su índice, así que una barra sin paneles solo necesita hijos `<Tab label>`. `TabsContainer` añade una superficie con borde; con `borderless` solo agrupa.

{{< react-demo id="tabs/02-variants" layout="block" >}}

## Con y sin iconos

`icon` acepta un nombre de Material Icons (se pinta como `<span class="material-icons mtx-tab__icon">` decorativo) o un nodo propio. `iconPosition="start"` (por defecto) o `"end"`. Las pestañas de solo icono necesitan `aria-label`.

{{< react-demo id="tabs/03-icons" layout="block" >}}

## Colores

La pestaña activa y el indicador usan `--mtx-color-primary`; como en vanilla, no hay props `textColor` / `indicatorColor`. Para otro tono, redefine el token en un contenedor.

{{< react-demo id="tabs/04-colors" layout="block" >}}

## Estados

Una pestaña `disabled` se atenúa, no responde a clics y el teclado la salta. Pasa el ratón para ver el fondo de hover, pulsa para ver el ripple (`disableRipple` lo desactiva) y usa <kbd>Tab</kbd> para ver el anillo de foco.

{{< react-demo id="tabs/05-states" layout="block" >}}

## Desplazable

Si las pestañas no caben, la barra se desplaza en horizontal (táctil, rueda o teclado) y el indicador sigue a la pestaña activa. La barra de desplazamiento está oculta y no hay botones de flecha (a diferencia del `variant="scrollable"` de MUI).

{{< react-demo id="tabs/06-scrollable" layout="block" >}}

## Vertical

`orientation="vertical"` apila las pestañas, coloca el indicador a la derecha y cambia las flechas a <kbd>↑</kbd>/<kbd>↓</kbd>. Un [Stack](../stack/) en fila coloca los paneles junto a la barra.

{{< react-demo id="tabs/07-vertical" layout="block" >}}

## Activación manual y automática

Por defecto las flechas solo mueven el foco y la pestaña se activa con <kbd>Enter</kbd> o <kbd>Espacio</kbd> (activación manual, recomendada por WAI-ARIA cuando cargar un panel es costoso). Con `selectionFollowsFocus` la pestaña se activa en cuanto recibe el foco.

{{< react-demo id="tabs/08-activation" layout="block" >}}

## Ejemplo real

Ajustes de cuenta con pestañas a todo el ancho, iconos y paneles con controles.

{{< react-demo id="tabs/09-use-cases" layout="block" >}}

## Maquetación en grilla

Dos grupos dentro de un [Grid](../grid/): el indicador se recalcula al cambiar el ancho (`ResizeObserver` y `resize`).

{{< react-demo id="tabs/10-grid" layout="block" >}}

## Uso controlado y cambio cancelable

Controla el valor con `value` + `onChange` en `TabContext` (o directamente en `Tabs` si no hay paneles). `onBeforeChange(value, previousValue)` se ejecuta antes del cambio: si devuelve `false`, lo cancela (equivale al cancelable `mtx:tabs:before-change`).

{{< react-demo id="tabs/11-programmatic" layout="block" >}}

```tsx
const [value, setValue] = useState('general');

<Tabs value={value} onChange={(event, next) => setValue(next)} onBeforeChange={(next) => next !== 'locked'}>
  <Tab value="general" label="General" />
  <Tab value="locked" label="Bloqueada" />
</Tabs>;
```

## Referencia de la API

### Props de Tabs

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `string \| number \| null` | — | Valor activo (controlado). Dentro de `TabContext` se toma del contexto. |
| `defaultValue` | `string \| number \| null` | primera habilitada | Valor inicial (no controlado, sin `TabContext`). |
| `onChange` | `(event, value) => void` | — | Se invoca tras el cambio (`mtx:tabs:change`). |
| `onBeforeChange` | `(value, previousValue) => boolean \| void` | — | Si devuelve `false`, cancela el cambio (`mtx:tabs:before-change`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación, `aria-orientation` y flechas. |
| `variant` | `'standard' \| 'fullWidth'` | `'standard'` | `fullWidth` reparte el ancho (`mtx-tabs--full`). |
| `centered` | `boolean` | `false` | Centra las pestañas. |
| `selectionFollowsFocus` | `boolean` | `false` | Activa la pestaña al moverse con las flechas. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref al elemento `role="tablist"`. |

`className`, `style`, `aria-label` y el resto de atributos van al tablist; su `id` se usa como prefijo de ids cuando no hay `TabContext`.

### Props de Tab

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `value` | `string \| number` | índice | Valor de la pestaña. |
| `label` | `ReactNode` | — | Texto (`children` también sirve). |
| `icon` | `string \| ReactNode` | — | Nombre de Material Icons o nodo. |
| `iconPosition` | `'start' \| 'end'` | `'start'` | Posición del icono. |
| `disabled` | `boolean` | `false` | `disabled` + `aria-disabled`; el teclado la salta. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref al `<button role="tab">`. |

### Props de TabPanel y TabContext

| Componente | Prop | Descripción |
| :--- | :--- | :--- |
| `TabContext` | `value` / `defaultValue` / `onChange(event, value)` | Valor activo compartido (controlado o no). |
| `TabContext` | `id` | Prefijo de ids (único por defecto). |
| `TabsContainer` | `borderless` | Superficie opcional (`.mtx-tabs-container`); `borderless` quita borde y fondo. |
| `TabPanel` | `value` | Valor de la pestaña que muestra el panel. Fuera de `TabContext`, controla `hidden` y los ids a mano. |

En RTL (`dir="rtl"`) se intercambian las flechas horizontales. Si `value` no coincide con ninguna pestaña habilitada, la primera habilitada conserva `tabindex="0"` para que la barra siga siendo alcanzable.

`useTabContext()` devuelve el contexto (`value`, `idPrefix`, `setValue`…) para piezas propias.

### Clases CSS

| Clase | Elemento |
| :--- | :--- |
| `.mtx-tabs` | Barra de pestañas (flex, 48px, línea divisoria inferior, desplazamiento horizontal sin barra visible). |
| `.mtx-tabs--full` / `--centered` / `--vertical` | Todo el ancho, centradas, vertical. |
| `.mtx-tabs__indicator` | Indicador de 2px (posicionado con `transform` y `width`/`height`). |
| `.mtx-tabs-container` / `--borderless` | Superficie de `TabsContainer`. |
| `.mtx-tab` / `.mtx-tab--active` | Pestaña y pestaña activa. |
| `.mtx-tab__icon` | Icono generado desde `icon`. |
| `.mtx-tab-panel` | Panel de contenido (oculto con `hidden`). |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-color-primary` | Texto de la pestaña activa e indicador. |
| `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Texto en reposo y en hover. |
| `--mtx-color-action-hover`, `--mtx-color-action-disabled` | Fondo de hover y texto deshabilitado. |
| `--mtx-color-divider` | Línea divisoria y borde del contenedor. |
| `--mtx-duration-standard`, `--mtx-easing-standard` | Animación del indicador. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<div data-mtx="tabs">` + `<button data-mtx="tab">` | `<Tabs>` + `<Tab label>` |
| `.mtx-tabs-container` | `TabsContainer` |
| `data-panel="#id"` + `.mtx-tab-panel` | `TabContext` + `<TabPanel value>` |
| `data-active` | `defaultValue` / `value` |
| `data-value` | `value` en `Tab` |
| `data-icon="phone"` | `icon="phone"` |
| `data-disabled` | `disabled` |
| `data-orientation`, `data-full`, `data-centered`, `data-selection-follows-focus` | `orientation`, `variant="fullWidth"`, `centered`, `selectionFollowsFocus` |
| `select(value)`, getter `value` | `value` (controlado) |
| `mtx:tabs:before-change` / propiedad `onBeforeChange` | `onBeforeChange(value, previousValue)` que devuelve `false` |
| `mtx:tabs:change` / propiedad `onChange` | `onChange(event, value)` |

## Accesibilidad

- La barra tiene `role="tablist"` y `aria-orientation`; cada pestaña `role="tab"`, `aria-selected` y, con `TabPanel`, `aria-controls`; cada panel `role="tabpanel"` y `aria-labelledby`.
- Roving tabindex: solo la pestaña activa está en el orden de tabulación (`tabindex="0"`); a las demás se llega con las flechas.
- Las pestañas deshabilitadas llevan `aria-disabled="true"` y el teclado las salta.
- Nombra la barra con `aria-label` y da `aria-label` a las pestañas de solo icono; el icono generado es decorativo.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> | Entra en la pestaña activa; el siguiente <kbd>Tab</kbd> sale de la barra. |
| <kbd>→</kbd> / <kbd>←</kbd> | Pestaña siguiente / anterior (horizontal), con vuelta al inicio. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Pestaña siguiente / anterior (vertical), con vuelta al inicio. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última pestaña habilitada. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la pestaña enfocada (activación manual). |
