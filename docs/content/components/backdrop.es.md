---
title: "Backdrop"
description: "Capa a pantalla completa que oscurece la página y centra un indicador mientras dura una operación; no sustituye a un diálogo."
group: "feedback"
icon: "gradient"
weight: 15
example: "backdrop"
import: "Backdrop"
mui: "https://mui.com/material-ui/react-backdrop/"
---

**Backdrop** cubre toda la pantalla con una capa semitransparente y centra su contenido, normalmente un [CircularProgress](../progress/). Úsalo para indicar que la página está ocupada durante una operación breve (guardar, sincronizar, procesar un pago). **No es un diálogo**: no tiene rol, no atrapa el foco ni ofrece título o acciones; si el usuario debe leer un mensaje o tomar una decisión, usa un [Dialog](../dialog/), que ya incluye su propio fondo (reutiliza este componente).

```tsx
import { Backdrop } from '@rubenchodev/materix-react';
// o solo este componente:
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
```

## Uso básico

`<Backdrop open={…}>` con el contenido a centrar. `open` es controlado: `onClose` solicita el cierre y tú actualizas el estado. Con `closeOnClick` un clic en la capa la cierra, y con `closeOnEscape`, la tecla Escape. El contenido es blanco por defecto, así que un `CircularProgress color="inherit"` destaca en ambos temas.

{{< react-demo id="backdrop/01-basic" layout="block" >}}

## Variantes

Dos variantes, como en MUI: la predeterminada oscurece la página con `--mtx-backdrop-bg` e `invisible` deja la capa transparente (sigue bloqueando los clics). Con `invisible` el contenido conserva el color del texto, así que usa un indicador con color.

{{< react-demo id="backdrop/02-variants" layout="block" >}}

## Con contenido

Los hijos se centran con flexbox; combínalos con [Stack](../stack/) y [Typography](../typography/). Cualquier elemento marcado con `data-mtx-backdrop-close` cierra la capa (motivo `click`), incluso sin `closeOnClick`.

{{< react-demo id="backdrop/03-content" layout="block" >}}

## Cierre

- `closeOnClick`: un clic en la capa o en contenido no interactivo solicita el cierre (motivo `click`). Los clics en botones, enlaces o campos del contenido se ignoran.
- `closeOnEscape`: Escape solicita el cierre (motivo `escape`) a través de la pila común de capas, así que solo llega a la capa superior.
- Sin ninguno de los dos, la capa solo se cierra al poner `open={false}` (por ejemplo, al terminar la operación).

{{< react-demo id="backdrop/04-closing" layout="block" >}}

## Estados

`lockScroll` bloquea el scroll del `<body>` mientras está abierto (gestor modal compartido con Dialog) e `inertOthers` marca el resto del documento como `inert` (sin foco, sin clics y oculto a lectores de pantalla) y lo restaura al cerrar. Con cualquiera de los dos el backdrop entra en la pila de capas y consume Escape aunque no se cierre con él.

{{< react-demo id="backdrop/05-states" layout="block" >}}

## Ejemplos reales

Guardar un formulario: el backdrop cubre la página mientras dura la petición y se cierra solo al terminar; después un [Snackbar](../snackbar/) confirma el resultado. El nombre del proyecto es un [TextField](../text-field/).

{{< react-demo id="backdrop/06-use-cases" layout="block" >}}

## Maquetación en grilla

La capa se renderiza en un portal sobre `document.body` y no participa en la maquetación; aquí una grilla de disparadores abre el mismo backdrop con mensajes distintos.

{{< react-demo id="backdrop/07-grid" layout="block" >}}

## Uso programático

El equivalente de `open()`/`close()`/`toggle()` es la prop `open`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:backdrop:open` y `mtx:backdrop:close`; `onExited` se llama al terminar el fundido de salida.

{{< react-demo id="backdrop/08-programmatic" layout="block" >}}

## Reutilización en otros overlays

[Dialog](../dialog/), [Drawer](../drawer/) y otros componentes modales pintan `Backdrop` como capa de fondo. Estas son las props en las que se apoyan:

```tsx
<Backdrop
  open={open}                 // muestra la capa con el fundido
  invisible={false}           // capa transparente para menús y popovers
  onClick={handleBackdropClick} // siempre se llama, antes de la lógica de cierre
  className="mtx-dialog__backdrop"
  transitionDuration={{ enter: 225, exit: 195 }}
  disablePortal               // el overlay ya se renderiza dentro de su propio portal
/>
```

## Referencia de la API

### Props de Backdrop

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra la capa (controlado). |
| `invisible` | `boolean` | `false` | Capa transparente (`.mtx-backdrop--invisible`). |
| `closeOnClick` | `boolean` | `false` | Un clic en la capa o en contenido no interactivo solicita el cierre. |
| `closeOnEscape` | `boolean` | `false` | Escape solicita el cierre (pila de capas). |
| `lockScroll` | `boolean` | `false` | Bloquea el scroll del `<body>` mientras está abierto. |
| `inertOthers` | `boolean` | `false` | Marca el resto del documento como `inert` mientras está abierto. |
| `onClick` | `(event) => void` | — | Clic en la capa; siempre se llama. |
| `onClose` | `(event, reason: 'click' \| 'escape') => void` | — | Solicitud de cierre. |
| `onOpen` | `() => void` | — | `open` pasa de `false` a `true`. |
| `onExited` | `() => void` | — | Terminó el fundido de salida. |
| `transitionDuration` | `number \| { enter?, exit? }` | `{ enter: 225, exit: 195 }` | Duración del fundido en ms. |
| `disablePortal` | `boolean` | `false` | Renderiza en su sitio en lugar de en `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Destino del portal. |
| `keepMounted` | `boolean` | `false` | Mantiene el nodo (con `hidden`) mientras está cerrado. |

`className` se combina; `ref`, `style` (por ejemplo un `zIndex` propio) y cualquier otro atributo van al `<div>` raíz.

### Callbacks

| Callback | Evento vanilla | Se llama cuando |
|---|---|---|
| `onOpen()` | `mtx:backdrop:open` | `open` pasa de `false` a `true` (no en el render inicial). |
| `onClose(event, reason)` | `mtx:backdrop:close` | Un clic (`click`) o Escape (`escape`) solicita el cierre. |
| `onExited()` | — | Termina el fundido de salida y el nodo se desmonta. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-backdrop` | Capa raíz. |
| `.mtx-backdrop--open` | Estado abierto. |
| `.mtx-backdrop--invisible` | Variante transparente. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-backdrop-bg` | Color de la capa (`rgba(0, 0, 0, 0.5)`). |
| `--mtx-backdrop-color` | Color del contenido (blanco). |
| `--mtx-backdrop-z-index` | Nivel de apilamiento (`--mtx-z-index-drawer` + 1). |

## Accesibilidad

- El backdrop no tiene rol ni mueve el foco: es un indicador visual. Da un nombre accesible al indicador (`CircularProgress label="Cargando"`).
- Cerrado o durante el fundido de salida lleva `aria-hidden="true"`.
- Para que los usuarios de teclado y lector de pantalla no interactúen con la página mientras está ocupada, usa `inertOthers`. Para mensajes o decisiones usa un [Dialog](../dialog/), que atrapa el foco.

| Tecla | Acción |
|---|---|
| `Escape` | Cierra la capa con `closeOnEscape` (solo si es la capa superior). |
| `Tab` | Recorre el contenido interactivo de la capa. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="backdrop"` + `open()` / `close()` / `toggle()` | `<Backdrop open={…}>` |
| `data-open` | `open={true}` inicial |
| `data-invisible` | `invisible` |
| `data-close-on-click`, `data-close-on-escape` | `closeOnClick`, `closeOnEscape` |
| `data-lock-scroll`, `data-inert` | `lockScroll`, `inertOthers` |
| `data-z="2000"` | `style={{ zIndex: 2000 }}` |
| disparador `data-mtx-backdrop-open="id"` | un botón que cambia el estado |
| `data-mtx-backdrop-close` | el mismo atributo dentro del contenido |
| `mtx:backdrop:open` / `mtx:backdrop:close` | `onOpen` / `onClose` |
