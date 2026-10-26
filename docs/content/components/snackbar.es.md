---
title: "Snackbar"
description: "Notificación breve y temporal en un borde de la pantalla que confirma una acción y puede ofrecer deshacerla."
group: "feedback"
icon: "chat_bubble"
weight: 30
example: "snackbar"
import: "Snackbar, SnackbarProvider, useSnackbar"
mui: "https://mui.com/material-ui/react-snackbar/"
---

**Snackbar** muestra un mensaje corto y flotante en un borde de la pantalla para confirmar el resultado de una acción ("Correo enviado", "Elemento eliminado") y, opcionalmente, ofrecer una única acción como "Deshacer". No interrumpe al usuario y puede cerrarse solo. No lo uses para errores que el usuario debe resolver (usa un [Alert](../alert/) junto al contenido) ni para decisiones obligatorias (usa un [Dialog](../dialog/)).

```tsx
import { Snackbar, SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react';
// o solo este componente:
import { Snackbar, SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
```

## Uso básico

Basta con `<Snackbar open={…} message="…">`. `open` es controlado: `onClose(event, reason)` solicita el cierre y tú actualizas el estado. Se cierra con Escape, con un clic fuera o, con `autoHideDuration`, al agotarse el tiempo.

{{< react-demo id="snackbar/01-basic" layout="block" >}}

## Con acción

Una `action` de texto genera el botón `.mtx-snackbar__action` a la derecha; `onAction` se ejecuta al pulsarlo y `closeOnAction` cierra el snackbar (motivo `action`). Cualquier otro nodo (por ejemplo un [IconButton](../icon-button/)) se pinta tal cual.

{{< react-demo id="snackbar/02-action" layout="block" >}}

## Posición

`anchorOrigin` combina `vertical` (`top`/`bottom`) con `horizontal` (`left`/`center`/`right`); por defecto, abajo al centro. Por debajo de 600px el snackbar ocupa todo el ancho con 8px de margen lateral.

{{< react-demo id="snackbar/03-position" layout="block" >}}

## Duración

Sin `autoHideDuration` (o con `null`) el snackbar no se cierra solo. El temporizador se pausa mientras el puntero o el foco están sobre él y se reinicia con la duración completa al salir. Cambiar el texto de `message` o `action` con el snackbar abierto también lo reinicia, como `open()` en vanilla.

{{< react-demo id="snackbar/04-duration" layout="block" >}}

## Consecutivos

`SnackbarProvider` mantiene una cola y muestra un aviso a la vez: un aviso nuevo cierra el visible y aparece cuando termina su transición de salida, como el ejemplo *Consecutive Snackbars* de MUI.

{{< react-demo id="snackbar/05-consecutive" layout="block" >}}

## Con Alert

Para notificaciones con severidad, coloca un [Alert](../alert/) como hijo de un snackbar sin `message`. Las utilidades `mtx-p-0 mtx-bg-transparent` quitan el relleno y el fondo del snackbar y `mtx-flex-1` estira la alerta.

{{< react-demo id="snackbar/06-with-alert" layout="block" >}}

## Avisos rápidos con useSnackbar()

Para confirmaciones puntuales no hace falta declarar un snackbar: envuelve la aplicación una vez con `<SnackbarProvider>` y llama a `useSnackbar().enqueue(mensaje | opciones)`. El snackbar compartido usa `role="status"` y 4 s de duración por defecto; `onAction` se ejecuta al pulsar la acción y cierra el aviso. `enqueue` devuelve una clave que acepta `close(key)`.

{{< react-demo id="snackbar/07-quick-notice" layout="block" >}}

```tsx
const { enqueue } = useSnackbar();
enqueue('Enlace copiado');
enqueue({
  message: 'Conversación archivada',
  action: 'Deshacer',
  onAction: () => restoreConversation(),
  duration: 6000,
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
});
```

## Ejemplos reales

Un formulario de suscripción con un [TextField](../text-field/) `Email`: si la dirección es válida, el snackbar compartido lo confirma y ofrece deshacerlo.

{{< react-demo id="snackbar/08-use-cases" layout="block" >}}

## Maquetación en grilla

Un caso típico: acciones en una [Grid](../grid/) donde cada una confirma su resultado con el snackbar compartido.

{{< react-demo id="snackbar/09-grid" layout="block" >}}

## Uso programático

El equivalente de `open()`/`close()` es la prop `open`; `setMessage()`/`setAction()` son las props `message` y `action`. `onOpen`, `onAction` y `onClose(event, reason)` equivalen a `mtx:snackbar:open`, `mtx:snackbar:action` y `mtx:snackbar:close`. Escape solo cierra el snackbar más reciente, y nunca con un diálogo o menú abierto encima.

{{< react-demo id="snackbar/10-programmatic" layout="block" >}}

## Referencia de la API

### Props de Snackbar

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra el snackbar (controlado). |
| `onClose` | `(event, reason) => void` | — | Solicitud de cierre; `reason` es `timeout`, `clickaway`, `escapeKeyDown` o `action` (`api` queda reservado a `useSnackbar().close()`; el `programmatic` de vanilla no tiene equivalente porque cerrar con `open={false}` no llama a `onClose`). |
| `message` | `ReactNode` | — | Mensaje (`.mtx-snackbar__message`). |
| `action` | `ReactNode` | — | Texto → botón `.mtx-snackbar__action`; nodo → se pinta tal cual (no dispara `onAction` ni `closeOnAction`: gestiona su propio `onClick`). |
| `onAction` | `(event) => void` | — | Clic en la acción generada. |
| `closeOnAction` | `boolean` | `false` | La acción generada cierra el snackbar (motivo `action`). |
| `autoHideDuration` | `number \| null` | `null` | Auto-cierre en ms; `null` lo desactiva. |
| `anchorOrigin` | `{ vertical, horizontal }` | `{ vertical: 'bottom', horizontal: 'center' }` | Posición. |
| `role` | `'alert' \| 'status' \| null` | `'alert'` | Rol vivo del mensaje; `null` lo quita. |
| `disableClickAway` | `boolean` | `false` | Un clic fuera no solicita el cierre. |
| `onOpen` | `() => void` | — | `open` pasa de `false` a `true`. |
| `onExited` | `() => void` | — | Terminó la transición de salida (el nodo se desmonta). |
| `children` | `ReactNode` | — | Contenido extra entre el mensaje y la acción (por ejemplo un Alert). |

`className` se combina; `ref`, `style` y cualquier otro atributo van al `<div>` raíz.

### SnackbarProvider y useSnackbar

| Prop de `SnackbarProvider` | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `anchorOrigin` | `{ vertical, horizontal }` | abajo al centro | Posición por defecto. |
| `autoHideDuration` | `number \| null` | `4000` | Duración por defecto. |
| `role` | `'alert' \| 'status'` | `'status'` | Rol vivo por defecto. |
| `className` | `string` | — | Clases del snackbar compartido. |

`useSnackbar()` devuelve `{ enqueue, close }` y lanza un error si no hay un proveedor por encima.

| Opción de `enqueue` | Tipo | Descripción |
|---|---|---|
| `message` | `ReactNode` | Mensaje. |
| `action` | `string \| null \| false` | Texto de la acción. |
| `onAction` | `(event) => void` | Se ejecuta al pulsar la acción y cierra el aviso; sin ella la acción no cierra. |
| `duration` | `number \| null` | Duración de este aviso. |
| `anchorOrigin` | `{ vertical, horizontal }` | Posición de este aviso. |
| `role` | `'alert' \| 'status'` | Rol vivo de este aviso. |
| `onClose` | `(reason) => void` | El aviso se cerró: `timeout`, `clickaway`, `escapeKeyDown`, `action`, `api` (cerrado con `close()`) o `replaced` (lo sustituyó otro más nuevo). |
| `key` | `string \| number` | Identificador propio para `close(key)`. |

### Callbacks

| Callback | Evento vanilla | Se llama cuando |
|---|---|---|
| `onOpen()` | `mtx:snackbar:open` | `open` pasa de `false` a `true`. |
| `onAction(event)` | `mtx:snackbar:action` | Se pulsa la acción generada. |
| `onClose(event, reason)` | `mtx:snackbar:close` | El temporizador, un clic fuera, Escape o la acción solicitan el cierre. |
| `onExited()` | — | Termina la transición de salida. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-snackbar` | Raíz. |
| `.mtx-snackbar--{vertical}-{horizontal}` | Posición (`bottom-center`, `top-right`…). |
| `.mtx-snackbar--open` | Estado visible. |
| `.mtx-snackbar__message` | Mensaje. |
| `.mtx-snackbar__action` | Botón de acción generado. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-snackbar-bg` / `--mtx-snackbar-color` | Fondo y texto (invertidos en el tema oscuro). |
| `--mtx-snackbar-action-color` | Color de la acción. |
| `--mtx-z-index-snackbar` | Nivel de apilamiento (1400). |
| `--mtx-elevation-6` | Sombra. |

## Accesibilidad

- El mensaje lleva `role="alert"` (urgente, se anuncia de inmediato) o `role="status"` para avisos no urgentes. Su contenedor se monta vacío y el texto llega un frame después, porque los lectores de pantalla no suelen anunciar una región viva insertada ya con contenido.
- `SnackbarProvider` mantiene montadas dos regiones vivas ocultas (`.mtx-visually-hidden`, `role="status"`/`aria-live="polite"` y `role="alert"`/`aria-live="assertive"`) y solo cambia su texto en cada aviso de texto; el mensaje visible queda sin rol para no anunciarse dos veces. Los avisos cuyo `message` es un nodo usan el rol del mensaje visible.
- La acción generada es un `<button type="button">` nativo; el temporizador se pausa mientras tiene el foco para que los usuarios de teclado tengan tiempo de usarla.
- Evita información esencial que desaparece: usa un `autoHideDuration` largo (o ninguno) cuando el aviso tiene una acción.

| Tecla | Acción |
|---|---|
| `Escape` | Cierra el snackbar más reciente (motivo `escapeKeyDown`) si no hay un diálogo o menú abierto. |
| `Tab` | Lleva el foco a la acción. |
| `Enter` / `Espacio` | Activa la acción. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="snackbar"` + `open()` / `close()` | `<Snackbar open={…}>` |
| `data-message`, `setMessage()` | `message` |
| `data-action`, `setAction()` | `action` |
| `data-close-on-action` | `closeOnAction` |
| `data-duration="4000"` / `none` | `autoHideDuration={4000}` / `null` |
| `data-anchor="top-right"` | `anchorOrigin={{ vertical: 'top', horizontal: 'right' }}` |
| `data-role="status"` | `role="status"` |
| `open({ message, action, onAction, duration })` | props, o `enqueue({ … })` |
| `Materix.snackbar.show()` / `showSnackbar()` | `SnackbarProvider` + `useSnackbar().enqueue()` |
| `mtx:snackbar:open` / `:action` / `:close` | `onOpen` / `onAction` / `onClose` |
| `close('programmatic')` | `open={false}` (sin `onClose`); `useSnackbar().close()` notifica `api` |
