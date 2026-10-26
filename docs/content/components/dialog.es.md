---
title: "Dialog"
description: "Ventana modal que interrumpe la tarea para pedir una decisión o mostrar información crítica, con foco atrapado y cierre por Escape."
group: "feedback"
icon: "open_in_browser"
weight: 20
example: "dialog"
import: "Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions"
mui: "https://mui.com/material-ui/react-dialog/"
---

**Dialog** abre un panel modal sobre la página: bloquea el scroll, atrapa el foco del teclado y obliga a resolver una decisión antes de continuar. Úsalo para confirmaciones, formularios cortos o información que el usuario no debe pasar por alto. No lo uses para avisos que no requieren respuesta (usa [Snackbar](../snackbar/) o [Alert](../alert/)) ni para navegación lateral (usa un Drawer).

```tsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@rubenchodev/materix-react';
// o solo este componente:
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
```

## Uso básico

La forma más simple es un único elemento: `<Dialog open={…} onClose={…} title="…">` con el contenido como hijos. `open` es controlado: `onClose(event, reason)` solicita el cierre y tú actualizas el estado. El diálogo se renderiza en un portal sobre `document.body`, con el [Backdrop](../backdrop/) compartido como fondo; Escape y un clic en el fondo lo cierran.

{{< react-demo id="dialog/01-basic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<Button variant="contained" onClick={() => setOpen(true)}>Abrir diálogo</Button>
<Dialog open={open} onClose={() => setOpen(false)} title="¿Usar la ubicación del dispositivo?">
  <p>Permite que las aplicaciones determinen tu ubicación para mostrarte resultados cercanos.</p>
</Dialog>
```

## Anatomía

| Parte | Componente | Clase |
|---|---|---|
| Raíz (fija, en un portal) | `Dialog` | `.mtx-dialog` |
| Fondo | [Backdrop](../backdrop/) | `.mtx-backdrop.mtx-dialog__backdrop` |
| Panel (`role="dialog"`) | — (`paperProps`) | `.mtx-dialog__paper` |
| Título | `DialogTitle` (o `title`) | `.mtx-dialog__title` |
| Contenido | `DialogContent` | `.mtx-dialog__content` |
| Texto descriptivo | `DialogContentText` (o `description`) | `.mtx-dialog__content-text` |
| Acciones | `DialogActions` (o `actions`) | `.mtx-dialog__actions` |

## Con acciones

`actions` envuelve sus botones en un `DialogActions`, que siempre se coloca al final del panel, fuera del contenido. `description` genera un `DialogContentText` al inicio del contenido y lo enlaza con `aria-describedby`. Cualquier elemento con `data-mtx-dialog-close` dentro del diálogo solicita el cierre (motivo `closeButtonClick`). La acción principal usa `contained` y la secundaria `text`.

{{< react-demo id="dialog/02-actions" layout="block" >}}

```tsx
<Dialog
  open={open}
  onClose={close}
  maxWidth="sm"
  title="¿Descartar borrador?"
  description="El mensaje se eliminará y no podrás recuperarlo."
  actions={
    <>
      <Button onClick={close} data-dialog-autofocus>Cancelar</Button>
      <Button variant="contained" onClick={close}>Descartar</Button>
    </>
  }
/>
```

## Alineación de las acciones

Como en MUI, las acciones van a la derecha por defecto (`end`). Cámbiala con `align="start|center|end|between"` en `DialogActions`, o para todo el diálogo con `actionsAlign` (se aplica a las acciones sin `align` propio). `between` separa una acción auxiliar a la izquierda de las principales a la derecha. `disableSpacing` quita la separación entre botones.

{{< react-demo id="dialog/03-actions-alignment" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} title="Exportar informe">
  <DialogActions align="between">
    <Button startIcon="help_outline">Ayuda</Button>
    <div className="mtx-d-flex mtx-gap-1">
      <Button onClick={close}>Cancel</Button>
      <Button variant="contained" onClick={close}>Exportar</Button>
    </div>
  </DialogActions>
</Dialog>
```

## Tamaños

`maxWidth` fija el ancho máximo del panel: `xs` (20rem), `sm` (24rem), `md` (32rem, por defecto), `lg` (48rem), `xl` (64rem) o `false` (sin límite). La escala de anchos sigue la de vanilla, más estrecha que la de MUI (MUI usa 444/600/900/1200/1536px); `xs` es su escalón inferior y, como vanilla no tiene clase para él, se aplica en línea. El panel ocupa el 100% del ancho disponible hasta ese máximo; con `fullWidth={false}` se ajusta a su contenido. `fullScreen` ocupa toda la ventana y quita las esquinas redondeadas, el patrón recomendado en móvil para tareas largas.

{{< react-demo id="dialog/04-sizes" layout="block" >}}

## Confirmación destructiva

Para acciones irreversibles usa un título en forma de pregunta, explica la consecuencia y colorea la acción con `color="error"`. `role="alertdialog"` indica a las tecnologías de asistencia que el diálogo requiere una respuesta urgente, y `data-dialog-autofocus` lleva el foco inicial a "Cancelar", la opción segura.

{{< react-demo id="dialog/05-confirmation" layout="block" >}}

## Formulario dentro de un diálogo

Un `<form>` puede contener los campos [TextField](../text-field/) y enviarse desde un botón de las acciones (`type="submit" form="…"`). El primer campo recibe el foco al abrir, o el marcado con `data-dialog-autofocus`, y `Tab` no sale del panel. Si el contenido empieza directamente con un campo, el CSS compartido reserva espacio arriba para que el label flotante no se recorte.

{{< react-demo id="dialog/06-form" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} maxWidth="sm" title="Suscríbete al boletín">
  <DialogContent>
    <form id="subscribe" onSubmit={handleSubmit}>
      <DialogContentText>Recibe una vez al mes las novedades de Materix UI.</DialogContentText>
      <TextField label="Nombre" name="name" required fullWidth />
      <TextField label="Correo electrónico" type="email" name="email" required fullWidth
        inputProps={{ 'data-dialog-autofocus': '' }} />
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={close}>Cancel</Button>
    <Button variant="contained" type="submit" form="subscribe">Suscribirse</Button>
  </DialogActions>
</Dialog>
```

## Scroll: panel y página

Con `scroll="paper"` (por defecto) el contenido hace scroll dentro del panel; `DialogContent dividers` separa las zonas y `DialogTitle sticky` / `DialogActions sticky` fijan el título y las acciones. Con `scroll="body"` el panel crece con su contenido y lo que hace scroll es el contenedor del diálogo.

{{< react-demo id="dialog/07-scroll" layout="block" >}}

## Comportamiento modal

Por defecto el diálogo se cierra con un clic en el fondo (`backdropClick`) y con Escape (`escapeKeyDown`). `disableBackdropClose` y `disableEscapeKeyDown` obligan a elegir una acción explícita (el diálogo sigue consumiendo Escape, así que no llega a las capas de abajo). Mientras está abierto se bloquea el scroll de la página (`disableScrollLock` lo desactiva).

{{< react-demo id="dialog/08-behavior" layout="block" >}}

## Diálogos anidados y Escape

Los diálogos se suman a la pila común de capas: un diálogo abierto desde otro se apila encima (su `z-index` sube automáticamente), el foco queda atrapado solo en el superior y cada Escape cierra únicamente la capa de arriba.

{{< react-demo id="dialog/09-nested" layout="block" >}}

## Capas apiladas y Escape

Un [Popover](../popover/), un [Menu](../menu/) y un [Tooltip](../tooltip/) abiertos dentro de un diálogo se suman a la misma pila de capas: cada Escape cierra solo la capa superior (primero un tooltip visible), el foco entra en ellos sin que el panel lo recupere e interactuar con ellos nunca cierra el diálogo.

{{< react-demo id="dialog/10-layers" layout="block" >}}

## Maquetación en grilla

Dentro del contenido puedes usar [Grid](../grid/) para formularios de varias columnas; combínalo con `maxWidth="lg"` para dar espacio a las columnas.

{{< react-demo id="dialog/11-grid" layout="block" >}}

## Uso programático

El equivalente de `open()`/`close()` es la prop `open`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:dialog:open` y `mtx:dialog:close`; `onEntered` y `onExited` se llaman al terminar la animación del panel. Con `keepMounted` el diálogo permanece en el DOM mientras está cerrado.

{{< react-demo id="dialog/12-programmatic" layout="block" >}}

## Composición

Para un control total, compón las piezas: `DialogTitle` da nombre al diálogo (`aria-labelledby`) y el primer `DialogContentText` lo describe (`aria-describedby`); los ids se generan a partir del `id` del diálogo (o de un id único). Puedes mezclar ambas formas: `title`, `description` y `actions` se siguen añadiendo aunque uses `DialogContent` como hijo (la descripción se inserta al inicio del contenido), y también se reconocen los hijos envueltos en Fragments.

{{< react-demo id="dialog/13-composition" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} maxWidth="sm">
  <DialogTitle sticky>Estructura compuesta</DialogTitle>
  <DialogContent>
    <DialogContentText>…</DialogContentText>
  </DialogContent>
  <DialogActions sticky>
    <Button onClick={close}>Cancel</Button>
    <Button variant="contained" onClick={close}>Aceptar</Button>
  </DialogActions>
</Dialog>
```

## Referencia de la API

### Props de Dialog

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra el diálogo (controlado). |
| `onClose` | `(event, reason: 'backdropClick' \| 'escapeKeyDown' \| 'closeButtonClick') => void` | — | Solicitud de cierre. |
| `onOpen` | `() => void` | — | El diálogo se abre (también si se monta abierto). |
| `onEntered` / `onExited` | `() => void` | — | Terminó la animación de entrada / salida. |
| `title` | `ReactNode` | — | Genera un `DialogTitle`. |
| `description` | `ReactNode` | — | Genera un `DialogContentText` al inicio del contenido (también de un `DialogContent` hijo que no lo tenga). |
| `actions` | `ReactNode` | — | Botones envueltos en un `DialogActions`. |
| `actionsAlign` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | Alineación de las acciones sin `align`. |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | Rol del panel. |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | `'md'` (32rem) | Ancho máximo del panel (escala de vanilla; `xs` = 20rem). |
| `fullWidth` | `boolean` | `true` | El panel ocupa el ancho hasta `maxWidth`. |
| `fullScreen` | `boolean` | `false` | Panel a pantalla completa (`.mtx-dialog--full`). |
| `scroll` | `'paper' \| 'body'` | `'paper'` | Zona que hace scroll. |
| `disableEscapeKeyDown` | `boolean` | `false` | Escape no cierra. |
| `disableBackdropClose` | `boolean` | `false` | Un clic en el fondo no cierra. |
| `disableScrollLock` | `boolean` | `false` | No bloquea el scroll del `<body>`. |
| `disableRestoreFocus` | `boolean` | `false` | No devuelve el foco al disparador al cerrar. |
| `disableEnforceFocus` | `boolean` | `false` | Permite que el foco salga del panel. |
| `hideBackdrop` | `boolean` | `false` | No renderiza el fondo. |
| `keepMounted` | `boolean` | `false` | Mantiene el diálogo en el DOM mientras está cerrado. |
| `disablePortal` | `boolean` | `false` | Renderiza en su sitio en lugar de en `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Destino del portal. |
| `transitionDuration` | `number \| { enter?, exit? }` | `250` | Animación del panel en ms. |
| `paperProps` | `HTMLAttributes & { ref }` | — | Props del panel. |
| `backdropProps` | `Partial<BackdropProps>` | — | Props del [Backdrop](../backdrop/). |

`className`, `style`, `id`, `ref` y cualquier otro atributo van a la raíz `.mtx-dialog`; `aria-label`, `aria-labelledby` y `aria-describedby` van al panel y prevalecen sobre los automáticos.

### Piezas

| Componente | Props | Descripción |
|---|---|---|
| `DialogTitle` | `sticky` | Título `<h2>`; da nombre al diálogo. |
| `DialogContent` | `dividers` | Zona de contenido. |
| `DialogContentText` | — | Texto descriptivo `<p>`; el primero describe el diálogo. |
| `DialogActions` | `align`, `disableSpacing`, `sticky` | Barra de acciones. |

### Atributos dentro del contenido

| Atributo | Efecto |
|---|---|
| `data-dialog-autofocus` | Recibe el foco inicial (un contenedor delega en su primer control). |
| `data-mtx-dialog-close` | Un clic solicita el cierre con motivo `closeButtonClick`. |

### Callbacks

| Callback | Evento vanilla | Se llama cuando |
|---|---|---|
| `onOpen()` | `mtx:dialog:open` | `open` pasa a `true`. |
| `onClose(event, reason)` | `mtx:dialog:close` (`detail.reason`) | El fondo, Escape o `data-mtx-dialog-close` solicitan el cierre. |
| `onExited()` | — | Termina la animación de salida. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-dialog` | Raíz. |
| `.mtx-dialog--open` | Estado abierto (también durante la animación de salida). |
| `.mtx-dialog--scroll-paper`, `--scroll-body` | Modo de scroll. |
| `.mtx-dialog--max-sm` … `--max-xl` | Ancho máximo. |
| `.mtx-dialog--full` | Pantalla completa. |
| `.mtx-dialog__backdrop` | Fondo (un `Backdrop`). |
| `.mtx-dialog__paper` | Panel. |
| `.mtx-dialog__title`, `--sticky` | Título. |
| `.mtx-dialog__content`, `--dividers` | Contenido. |
| `.mtx-dialog__content-text` | Texto descriptivo. |
| `.mtx-dialog__actions`, `--start`, `--center`, `--between`, `--disable-spacing`, `--sticky` | Acciones. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-z-index-modal` | Nivel de apilamiento (1300). |
| `--mtx-backdrop-bg` | Color del fondo. |
| `--mtx-elevation-24` | Sombra del panel. |

## Accesibilidad

- El panel tiene `role="dialog"` (o `alertdialog`) y `aria-modal="true"`; su nombre viene del título (`aria-labelledby`) y su descripción del primer `DialogContentText` (`aria-describedby`). Sin título, dale un `aria-label`.
- Al abrir, el foco va al elemento con `data-dialog-autofocus`, al primer control enfocable o al panel; al cerrar vuelve al elemento que lo tenía.
- El foco queda atrapado en el diálogo superior; las capas abiertas desde él (popover, menú) gestionan su propio foco.
- El scroll de la página se bloquea mientras está abierto.

| Tecla | Acción |
|---|---|
| `Escape` | Cierra el diálogo superior (salvo con `disableEscapeKeyDown`). |
| `Tab` / `Shift+Tab` | Recorre de forma cíclica los controles del panel. |

## Equivalencia con vanilla

Diferencias con vanilla:

- **Animación:** el panel se anima al entrar y al salir (opacidad y escala, 250 ms) y el fondo hace un fundido (225/195 ms), como en MUI; en vanilla el diálogo aparece y desaparece al instante.
- **Fondo:** es el componente compartido [Backdrop](../backdrop/) (`.mtx-backdrop.mtx-dialog__backdrop`), no un `div.mtx-dialog__backdrop` suelto.
- **`maxWidth="xs"`** (20rem) y **`maxWidth={false}`** / **`fullWidth={false}`** no tienen clase en el CSS compartido y se aplican como estilos en línea del panel.
- Un clic en el fondo que solo cierra un menú o popover abierto dentro del diálogo no cierra el diálogo.


| Vanilla | React |
|---|---|
| `data-mtx="dialog"` + `open()` / `close()` | `<Dialog open={…} onClose={…}>` |
| `data-title`, `data-description` | `title`, `description` |
| `.mtx-dialog__actions` / `data-mtx="dialog-actions"` | `actions` o `<DialogActions>` |
| `data-actions-align`, `data-align`, `data-disable-spacing` | `actionsAlign`, `align`, `disableSpacing` |
| `mtx-dialog--max-sm` … `--max-xl`, `mtx-dialog--full` | `maxWidth`, `fullScreen` |
| `data-scroll="body"` | `scroll="body"` |
| `data-disable-backdrop-close`, `data-disable-escape` | `disableBackdropClose`, `disableEscapeKeyDown` |
| Disparador `data-mtx-dialog-open="id"` | un botón que cambia el estado |
| `data-mtx-dialog-close`, `data-dialog-autofocus` | mismos atributos |
| `mtx:dialog:open` / `mtx:dialog:close` | `onOpen` / `onClose` |
