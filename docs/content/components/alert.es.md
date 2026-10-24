---
title: "Alert"
description: "Mensaje breve y destacado que informa del resultado de una acción o del estado del sistema sin interrumpir al usuario."
group: "feedback"
icon: "warning"
weight: 10
example: "alert"
import: "Alert, AlertTitle"
mui: "https://mui.com/material-ui/react-alert/"
---

**Alert** muestra un mensaje corto e importante dentro del flujo de la página, con un color y un icono que comunican su severidad (`success`, `info`, `warning`, `error`). Úsalo para confirmar una operación, avisar de un problema o explicar un error de validación junto al contenido afectado. No lo uses para notificaciones temporales que desaparecen solas (usa un Snackbar) ni para decisiones que bloquean la tarea (usa un Dialog).

```tsx
import { Alert, AlertTitle } from '@rubenchodev/materix-react';
// o solo este componente:
import { Alert, AlertTitle } from '@rubenchodev/materix-react/components/alert';
```

## Uso básico

Basta con `<Alert severity="…">`: el componente genera el icono de la severidad, el contenedor `.mtx-alert__message` y, con `title`, el título.

{{< react-demo id="alert/01-basic" layout="block" >}}

## Variantes

Tres variantes, como en MUI: `standard` (fondo suave, por defecto), `filled` (fondo sólido) y `outlined` (solo borde). `standard` y `outlined` usan el color de la severidad oscurecido en el tema claro y aclarado en el oscuro, para que el texto mantenga el contraste.

{{< react-demo id="alert/02-variants" layout="block" >}}

## Con y sin iconos

Por defecto se genera el icono SVG de la severidad a 22px, como en MUI. `icon` lo sustituye (un nodo, o un nombre de Material Icons, que conserva su rejilla de 24px) e `icon={false}` lo elimina.

{{< react-demo id="alert/03-icons" layout="block" >}}

## Severidades

`severity` fija el color y el icono. Usa `success`, `info`, `warning` o `error` según el significado del mensaje; sin la prop se aplica `success`.

{{< react-demo id="alert/04-severities" layout="block" >}}

## Título

`title` genera un `.mtx-alert__title` en negrita sobre el mensaje. También puedes escribir `<AlertTitle>` como primer hijo, como en MUI.

{{< react-demo id="alert/05-title" layout="block" >}}

## Acciones

`action` coloca contenido a la derecha del mensaje (por ejemplo, un botón «Deshacer»).

{{< react-demo id="alert/06-actions" layout="block" >}}

## Descartables

`onClose` (o `dismissible`) añade un botón de cierre accesible; `closeLabel` cambia su nombre para lectores de pantalla (por defecto, `Close` / `Cerrar` del diccionario i18n). Al cerrarse, la alerta se desvanece durante 200 ms, recibe `hidden` (sale del flujo: no deja hueco) e invoca `onClosed`. Las alertas no controladas se cierran solas; con `open`, `onClose` es una solicitud y tú actualizas el estado.

{{< react-demo id="alert/07-dismissible" layout="block" >}}

## En formularios

Vincula `open` al resultado de la validación (los campos son `TextField` outlined): una alerta cerrada tiene `hidden` y no ocupa espacio. Envía el formulario vacío para ver el error y rellénalo para ver el mensaje de éxito.

{{< react-demo id="alert/08-forms" layout="block" >}}

## Maquetación en grilla

Las alertas ocupan el ancho de su contenedor, así que encajan en cualquier columna de una grilla.

{{< react-demo id="alert/09-grid" layout="block" >}}

## Uso programático

El equivalente de `close()`/`open()` es la prop `open`. `onOpen` y `onClosed` equivalen a los eventos `mtx:alert:open` y `mtx:alert:close`; las alertas nuevas simplemente se renderizan.

{{< react-demo id="alert/10-programmatic" layout="block" >}}

## Referencia de la API

### Props de Alert

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `severity` | `'success' \| 'info' \| 'warning' \| 'error'` | `'success'` | Color e icono. |
| `variant` | `'standard' \| 'filled' \| 'outlined'` | `'standard'` | Variante visual. |
| `title` | `ReactNode` | — | Título sobre el mensaje (`.mtx-alert__title`). |
| `icon` | `ReactNode \| string \| false` | SVG de la severidad | Icono propio (dentro de `.mtx-alert__icon`); `false` lo oculta. |
| `action` | `ReactNode` | — | Contenido a la derecha del mensaje. |
| `onClose` | `(event) => void` | — | Clic en el botón de cierre; su presencia muestra el botón. |
| `dismissible` | `boolean` | `false` | Muestra el botón de cierre sin `onClose`. |
| `closeLabel` | `string` | i18n `alert.close` | Nombre accesible del botón de cierre. |
| `open` | `boolean` | — | Visibilidad controlada. |
| `defaultOpen` | `boolean` | `true` | Visibilidad inicial no controlada. |
| `onOpen` | `() => void` | — | Una alerta cerrada vuelve a mostrarse. |
| `onClosed` | `() => void` | — | Terminó la animación de cierre y la alerta está oculta. |
| `role` | `string` | `'alert'` | Usa `'status'` para mensajes que no deben interrumpir. |
| `locale` | `string` | contexto | Idioma de los textos propios. |

`className` se concatena; `ref`, `style` y cualquier otro atributo van al `<div>` raíz.

`AlertTitle` renderiza `<div class="mtx-alert__title">` y acepta los atributos de un `<div>`.

### Callbacks

| Callback | Evento vanilla | Se invoca cuando |
|---|---|---|
| `onClose(event)` | — (clic en `.mtx-alert__close`) | Se pulsa el botón de cierre. |
| `onClosed()` | `mtx:alert:close` | Termina la animación de cierre (o al instante con `prefers-reduced-motion`). |
| `onOpen()` | `mtx:alert:open` | `open` pasa de `false` a `true`. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-alert` | Raíz. |
| `.mtx-alert--{severity}`, `.mtx-alert--{variant}` | Severidad y variante. |
| `.mtx-alert__icon` | Contenedor del icono. |
| `.mtx-alert__message` | Mensaje (con el título). |
| `.mtx-alert__title` | Título. |
| `.mtx-alert__close` | Botón de cierre. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-{severity}` | Fondo en `filled`, borde en `outlined` y base del fondo suave en `standard`. |
| `--mtx-alert-text-mix` / `--mtx-alert-bg-mix` | Tonos que se mezclan con el color de la severidad en `standard`/`outlined`. |
| `--mtx-color-{severity}-contrast` | Color del texto en `filled`. |
| `--mtx-shape-radius` | Radio de las esquinas (4 px). |

## Accesibilidad

- La raíz tiene `role="alert"`, que los lectores de pantalla anuncian de inmediato. Para mensajes informativos que no deben interrumpir, pasa `role="status"`.
- Los iconos SVG generados tienen `aria-hidden="true"` y `focusable="false"`; el significado debe estar en el texto, no solo en el color.
- El botón de cierre es un `<button type="button">` nativo con un `aria-label` configurable mediante `closeLabel`.
- Si pasas un nodo de icono propio, márcalo con `aria-hidden="true"`.

| Tecla | Acción |
|---|---|
| `Tab` | Mueve el foco a la acción y al botón de cierre. |
| `Enter` / `Espacio` | Activa el botón enfocado (cierre o acción). |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-severity`, `data-variant` | `severity`, `variant` |
| `data-title="…"` | `title="…"` o `<AlertTitle>` |
| hijo `.mtx-alert__icon` / `data-icon="false"` | `icon={…}` / `icon={false}` |
| botón junto a `.mtx-alert__message` | `action={…}` |
| `data-dismissible`, `data-close-label` | `onClose` o `dismissible`, `closeLabel` |
| `close()` / `open()` | `open` (controlado) |
| `mtx:alert:close` / `mtx:alert:open` | `onClosed` / `onOpen` |
| `hidden` en el elemento | `open={false}` / `defaultOpen={false}` |
