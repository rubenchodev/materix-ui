---
title: "Divider"
description: "Línea fina que separa y agrupa contenido en listas, menús y maquetaciones, en horizontal o vertical y opcionalmente con texto."
group: "data-display"
icon: "horizontal_rule"
weight: 40
example: "divider"
import: "Divider"
mui: "https://mui.com/material-ui/react-divider/"
---

**Divider** es una línea de 1 px en el color `divider` del tema que separa grupos de contenido. Puede ser horizontal o vertical, con sangría o con margen a ambos lados, y llevar texto centrado o alineado.

```tsx
import { Divider } from '@rubenchodev/materix-react';
// o solo este componente:
import { Divider } from '@rubenchodev/materix-react/components/divider';
```

## Uso básico

`<Divider />` renderiza un `<hr class="mtx-divider">`, que tiene el rol `separator` de forma nativa.

{{< react-demo id="divider/01-basic" layout="block" >}}

## Variantes

`fullWidth` (por defecto) ocupa todo el ancho; `middle` deja 16 px a cada lado; `inset` deja 72 px a la izquierda para alinearse con el texto de las listas con icono.

{{< react-demo id="divider/02-variants" layout="block" >}}

## Orientación vertical

`orientation="vertical"` renderiza un `<div>` con `role="separator"` y `aria-orientation="vertical"`. Dentro de una fila flex, `flexItem` lo estira a la altura de la fila.

{{< react-demo id="divider/03-vertical" layout="block" >}}

## Con texto

Los `children` se convierten en el texto del divisor (envuelto en `.mtx-divider__text`). `textAlign` lo lleva a `left` o `right`; por defecto va centrado.

{{< react-demo id="divider/04-with-text" layout="block" >}}

## En listas

Usa `component="li"` para que el HTML de la lista siga siendo válido. Como en vanilla, el `<li>` conserva su rol de elemento de lista (una lista no puede contener `role="separator"`) y, si está vacío, se oculta a los lectores de pantalla con `aria-hidden="true"`. `inset` alinea la línea con el texto. Como alternativa, `divider` en cada `ListItem` dibuja un borde inferior.

{{< react-demo id="divider/05-in-lists" layout="block" >}}

## Casos de uso

Un separador «o» entre un inicio de sesión social y el formulario de inicio de sesión (TextField + Button).

{{< react-demo id="divider/06-use-cases" layout="block" >}}

## Maquetación en grilla

Métricas en una grilla con un divisor entre la cifra y su descripción.

{{< react-demo id="divider/07-grid" layout="block" >}}

## Uso programático

Los divisores se renderizan desde el estado como cualquier otro elemento; no hay nada que inicializar.

{{< react-demo id="divider/08-programmatic" layout="block" >}}

## API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `orientation` | `'horizontal'` \| `'vertical'` | `'horizontal'` | `vertical` añade `.mtx-divider--vertical` y `aria-orientation="vertical"`. |
| `variant` | `'fullWidth'` \| `'middle'` \| `'inset'` | `'fullWidth'` | Añade `.mtx-divider--middle` o `.mtx-divider--inset`. |
| `flexItem` | `boolean` | `false` | Añade `.mtx-divider--flex-item` (se estira en una fila flex). |
| `textAlign` | `'center'` \| `'left'` \| `'right'` | `'center'` | Posición del texto; añade `.mtx-divider--text-{left\|right}`. |
| `children` | `ReactNode` | — | Texto del divisor: añade `.mtx-divider--text` y el `span` `.mtx-divider__text`. |
| `component` | `ElementType` | `'hr'` (`'div'` si es vertical o lleva texto) | Elemento raíz. `'li'` conserva el rol de elemento de lista. |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

El resto de props (`role`, `aria-*`, `style`, `data-*`…) se reenvían al elemento raíz; tu propio `role` o `aria-orientation` tienen prioridad.

### Callbacks

Divider no emite eventos.

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-divider` | Línea de 1 px en `--mtx-color-divider`. |
| `.mtx-divider--vertical` | Línea vertical que se estira a la altura de su fila. |
| `.mtx-divider--middle` / `.mtx-divider--inset` | Margen de 16 px a ambos lados / 72 px a la izquierda. |
| `.mtx-divider--flex-item` | `align-self: stretch` con altura automática. |
| `.mtx-divider--text` | Disposición línea — texto — línea. |
| `.mtx-divider--text-left` / `.mtx-divider--text-right` | Texto alineado a un lado. |
| `.mtx-divider__text` | Contenedor del texto. |

## Accesibilidad

- `<hr>` tiene el rol implícito `separator`; es la opción por defecto para divisores horizontales sin texto.
- Sobre un `<div>` (vertical o con texto) el componente añade `role="separator"` salvo que pases tu propio `role` (por ejemplo `role="presentation"` para un divisor puramente decorativo), y `aria-orientation="vertical"` en los verticales, como MUI.
- Con `component="li"` el divisor conserva el rol de elemento de lista; vacío recibe `aria-hidden="true"` y, con texto, sigue siendo legible.
- El texto de un divisor es contenido legible: escríbelo con sentido («o», «Sección 2»), no con símbolos.

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<hr data-mtx="divider">` | `<Divider />` |
| `data-orientation="vertical"` | `orientation="vertical"` |
| `data-variant="middle\|inset"` | `variant="middle\|inset"` |
| `data-flex-item` | `flexItem` |
| `data-text="LEFT"` / texto del elemento | `children` |
| `data-text-align="left\|right"` | `textAlign="left\|right"` |
| `<li data-mtx="divider">` dentro de una lista | `<Divider component="li" />` |

El DOM renderizado (clases, `role` y `aria-*`) es idéntico al del componente vanilla tras inicializarse.
