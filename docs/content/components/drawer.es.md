---
title: "Drawer"
description: "Panel lateral de navegación o contenido auxiliar: temporal, persistente, permanente o responsive, con cabecera y pie generados y patrón app shell."
group: "navigation"
icon: "menu_open"
weight: 10
example: "drawer"
import: "Drawer"
mui: "https://mui.com/material-ui/react-drawer/"
---

**Drawer** es un panel que se desliza desde un borde de la pantalla para mostrar la navegación de la aplicación o contenido auxiliar (filtros, detalles, opciones), como el `Drawer` de MUI. Úsalo para la navegación principal en móvil (temporal) o como barra lateral fija en escritorio (permanente). Para una decisión o un formulario breve que interrumpe el flujo usa un Dialog; para una lista corta de acciones sobre un elemento, un Menu.

```tsx
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
// piezas para composición manual y el hook responsive:
import { DrawerHeader, DrawerContent, DrawerFooter, DrawerSubmenu, useDrawerMode } from '@rubenchodev/materix-react/components/drawer';
```

## Uso básico

`<Drawer open={…} onClose={…} title="…">` con el contenido directamente dentro. `title` genera la cabecera con título y botón de cierre; el contenido se envuelve en el panel desplazable `.mtx-drawer__content` y el drawer temporal añade un [Backdrop](../backdrop/). `open` es controlado: `onClose(event, reason)` solicita el cierre y tú actualizas el estado.

{{< react-demo id="drawer/01-basic" layout="block" >}}

## App shell: AppBar + Drawer responsive

La receta principal de una aplicación: una [AppBar](../app-bar/), una fila con un drawer `variant="responsive"` (temporal por debajo de `breakpoint`, permanente desde él) y el contenido principal. La AppBar se conecta al drawer con su botón de navegación, el equivalente React de `data-drawer="id"` de vanilla:

- `navigationControls={drawerId}` pone `aria-controls` en el botón de menú,
- `navigationExpanded={open}` mantiene `aria-expanded` sincronizado,
- `onNavigationClick` alterna el estado,
- `useDrawerMode('responsive', 'md')` devuelve el modo actual, así `startIcon={mode === 'temporary' ? 'menu' : undefined}` oculta el botón mientras el drawer es permanente (vanilla añade `.mtx-drawer-trigger--hidden`).

El drawer ignora los clics en su propio disparador (cualquier elemento con `aria-controls` apuntando a su `id`), así el botón no lo cierra y lo reabre. Aquí el shell vive dentro de un marco (`absolute`); en una página completa usa `clipped` y un [ToolbarOffset](../app-bar/) al principio de `<main>`.

{{< react-demo id="drawer/02-app-shell" layout="block" >}}

```tsx
const mode = useDrawerMode('responsive', 'md');
const [open, setOpen] = useState(false);

<AppBar
  position="fixed"
  clipped
  title="Mi app"
  startIcon={mode === 'temporary' ? 'menu' : undefined}
  navigationControls="app-nav"
  navigationExpanded={open}
  onNavigationClick={() => setOpen((value) => !value)}
/>
<div className="mtx-d-flex">
  <Drawer id="app-nav" variant="responsive" breakpoint="md" clipped width={240}
          title="Mi app" headerMode="temporary" aria-label="Navegación principal"
          open={open} onClose={() => setOpen(false)}>
    <List component="nav" aria-label="Secciones">…</List>
  </Drawer>
  <main className="mtx-flex-1 mtx-min-w-0">
    <ToolbarOffset />
    …
  </main>
</div>
```

## Variantes

- `temporary` (por defecto): modal sobre un fondo. Bloquea el scroll de la página, atrapa el foco, se cierra con <kbd>Escape</kbd>, el fondo o un clic fuera, y se renderiza en un portal en `document.body`.
- `persistent`: se abre sin fondo y la página sigue usable; desplaza tú el contenido para hacerle sitio.
- `permanent`: siempre visible, una caja de ancho fijo en una fila flex con un panel sticky del alto de la ventana. Nunca solicita cerrarse.
- `responsive`: ver "Responsive".

Con `absolute` el drawer y su fondo quedan dentro del padre posicionado (sin bloqueo de scroll), y el permanente toma el alto del contenedor.

{{< react-demo id="drawer/03-variants" layout="block" >}}

## Anchos

Por defecto responsive: `min(85vw, 320px)` en móvil, 280px desde 600px y 300px desde 900px. `width="narrow" | "wide" | "full"` fija 200px, 360px o 100vw; cualquier número (px) o longitud CSS (`"40vw"`) se aplica tal cual y también se escribe en `--mtx-drawer-width`. Nunca supera el 85% de la ventana salvo con `full`.

{{< react-demo id="drawer/04-widths" layout="block" >}}

## Anclas

`anchor="left" | "right" | "top" | "bottom"`. `right` suele usarse para detalles o filtros; `top` y `bottom` ocupan todo el ancho y se ajustan a su contenido (bottom sheet). Cualquier elemento con `data-mtx-drawer-close` dentro del drawer solicita el cierre con motivo `closeButtonClick`.

{{< react-demo id="drawer/05-anchors" layout="block" >}}

## Cabecera y pie

Sin título el drawer solo envuelve el contenido (dale un `aria-label`). `title` y `subtitle` generan una cabecera de texto; `userName`, `userEmail` y `userAvatar`, una cabecera de usuario con [Avatar](../avatar/). `footerInfo` y `footerAction` (+ `footerActionIcon`, `onFooterActionClick`) crean un pie fijo cuyo botón además cierra el drawer; la zona central se desplaza de forma independiente. `closeButton={false}` quita la X.

{{< react-demo id="drawer/06-header-footer" layout="block" >}}

## Estados

Puedes impedir el cierre implícito: `disableBackdropClick` (ni el fondo ni un clic fuera lo cierran), `disableEscapeKeyDown` y `hideBackdrop` (sin fondo; un clic fuera sigue cerrando). La línea de estado muestra el `reason` que recibe `onClose`.

{{< react-demo id="drawer/07-states" layout="block" >}}

## Bajo la AppBar (clipped)

La AppBar ocupa todo el ancho y el drawer empieza debajo. En una página completa usa `clipped` en un drawer `permanent`, `responsive` o `persistent`: se coloca en `--mtx-app-bar-height` (56px en móvil, 64px desde 600px) y se apila bajo la AppBar (pon también `clipped` en la AppBar). El temporal ignora `clipped`: es modal y cubre la AppBar, como en MUI. Dentro de un marco, como aquí, se consigue con un drawer permanente `absolute` en la fila bajo la AppBar.

{{< react-demo id="drawer/08-clipped" layout="block" >}}

## Responsive

`variant="responsive"` con `breakpoint="sm" | "md" | "lg" | "xl"` (600, 900, 1200, 1536px; por defecto `md`): por debajo es temporal y se abre con su disparador; desde él, permanente. Al cruzar el breakpoint se sincronizan clases, ARIA, fondo y foco sin animación, se llama a `onModeChange(mode, previousMode)` (`mtx:drawer:mode-change` en vanilla) y un temporal abierto solicita el cierre con motivo `breakpoint` para no reaparecer al volver a móvil. Si el foco estaba dentro al pasar a temporal, pasa al disparador visible. El responsive se mantiene montado y en su sitio (sin portal), así su contenido conserva el estado. `headerMode="temporary"` muestra la cabecera generada solo mientras es temporal. Redimensiona la ventana.

{{< react-demo id="drawer/09-responsive" layout="block" >}}

## Submenús colapsables

`DrawerSubmenu` equivale a `data-mtx-collapse-trigger` + `.mtx-collapse` de vanilla: un elemento de lista con `aria-expanded` y `aria-controls`, un `.mtx-collapse-indicator` que rota 90° y una [List](../list/) anidada animada con `Collapse`. Funciona controlado (`open` + `onToggle`) o no controlado (`defaultOpen`). Plegado, sus elementos no reciben el foco.

{{< react-demo id="drawer/10-submenus" layout="block" >}}

## Maquetación en grilla

Un drawer derecho con `width="wide"` y `padded` que contiene un formulario maquetado con [Grid](../grid/) y [TextField](../text-field/). `inputProps={{ 'data-drawer-autofocus': '' }}` da el foco inicial al campo de búsqueda (mejor que `autoFocus`, que robaría el foco antes de que el drawer registre el disparador al que volver). Los botones con `data-mtx-drawer-close` lo cierran.

{{< react-demo id="drawer/11-grid" layout="block" >}}

## Uso programático

El equivalente de `open()`, `close(reason)`, `toggle()` e `isOpen` es la prop `open`. `onOpen` y `onClose(event, reason)` equivalen a `mtx:drawer:open` y `mtx:drawer:close`. El registro muestra los callbacks reales: prueba también <kbd>Escape</kbd>, el fondo y la X.

{{< react-demo id="drawer/12-programmatic" layout="block" >}}

## Composición BEM manual

Con `DrawerHeader`, `DrawerContent` y `DrawerFooter` como hijos el drawer no genera nada: coloca cabecera y pie fuera del panel desplazable y añade la semántica de diálogo a `DrawerContent`. Nombra el panel con `aria-labelledby` (o `aria-label`) en el drawer.

{{< react-demo id="drawer/13-bem" layout="block" >}}

## Referencia de la API

### Props de Drawer

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | `false` | Estado abierto (controlado). Se ignora en modo `permanent`, que siempre está abierto. |
| `onClose` | `(event, reason) => void` | — | Solicitud de cierre; `reason`: `backdropClick`, `escapeKeyDown`, `clickaway`, `closeButtonClick` o `breakpoint`. |
| `onOpen` | `() => void` | — | `open` pasa de `false` a `true` (no en el render inicial). |
| `variant` | `'temporary' \| 'persistent' \| 'permanent' \| 'responsive'` | `'temporary'` | Comportamiento. |
| `breakpoint` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Breakpoint de `responsive`. |
| `onModeChange` | `(mode, previousMode) => void` | — | Cambió el modo efectivo (`responsive`). |
| `anchor` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Borde desde el que se desliza. |
| `width` | `'narrow' \| 'wide' \| 'full' \| number \| string` | — | Ancho canónico o cualquier longitud. |
| `elevation` | `number` | — | Sombra `0`–`24`. |
| `clipped` | `boolean` | `false` | Bajo la AppBar (`permanent`, `persistent`, `responsive`). |
| `absolute` | `boolean` | `false` | Contenido en el padre posicionado (drawer y fondo). |
| `title` · `subtitle` | `ReactNode` | — | Cabecera de texto generada. |
| `userName` · `userEmail` · `userAvatar` | `ReactNode` | — | Cabecera de usuario generada (el avatar usa la inicial por defecto). |
| `closeButton` | `boolean` | `true` | Botón de cierre en la cabecera generada (nunca en `permanent`). |
| `headerMode` | `'always' \| 'temporary'` | `'always'` | `temporary`: la cabecera solo se ve mientras es temporal. |
| `footerInfo` · `footerAction` · `footerActionIcon` | `ReactNode` | — / — / `'logout'` | Pie generado. |
| `onFooterActionClick` | `(event) => void` | — | Clic en la acción del pie (además cierra). |
| `padded` | `boolean` | `false` | Relleno de 20px en el panel. |
| `contentProps` | `DrawerContentProps` | — | Props del panel desplazable. |
| `hideBackdrop` | `boolean` | `false` | Sin fondo en modo temporal. |
| `disableBackdropClick` | `boolean` | `false` | Ni el fondo ni un clic fuera lo cierran. |
| `disableEscapeKeyDown` | `boolean` | `false` | Escape no lo cierra. |
| `keepMounted` | `boolean` | `false` | Mantiene en el DOM el temporal cerrado (`responsive` siempre lo hace). |
| `backdropProps` | `Partial<BackdropProps>` | — | Props extra del fondo. |
| `disablePortal` | `boolean` | `false` | Renderiza el temporal en su sitio. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Destino del portal. |

`className` se combina; `ref`, `id`, `role`, `style` y cualquier otro atributo van a la raíz `<div>`. Un `padding` en `style` se traslada al panel para que cabecera y pie queden de borde a borde.

### Otras exportaciones

| Exportación | Descripción |
|---|---|
| `DrawerHeader` | `.mtx-drawer__header` para composición manual. |
| `DrawerContent` | `.mtx-drawer__content` (`padded`); dentro de un Drawer marca el panel. |
| `DrawerFooter` | `.mtx-drawer__footer` (`column` apila el contenido). |
| `DrawerSubmenu` | Submenú colapsable: `label`, `icon`, `open` / `defaultOpen`, `onToggle(open, event)`, `nested` (`true` o `2`), `id`, `buttonProps`. |
| `useDrawerMode(variant, breakpoint)` | Modo efectivo (`temporary`, `persistent` o `permanent`); escucha `matchMedia` en `responsive`. |
| `DRAWER_BREAKPOINTS` | `{ xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }`. |

### Callbacks

| Callback | Evento vanilla | Se llama cuando |
|---|---|---|
| `onOpen()` | `mtx:drawer:open` | `open` pasa de `false` a `true`. |
| `onClose(event, reason)` | `mtx:drawer:close` | Escape, el fondo, un clic fuera, `[data-mtx-drawer-close]` o el breakpoint solicitan el cierre. |
| `onModeChange(mode, previousMode)` | `mtx:drawer:mode-change` | `responsive` cruza su breakpoint. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-drawer` | Raíz. |
| `.mtx-drawer--left` · `--right` · `--top` · `--bottom` | Ancla. |
| `.mtx-drawer--temporary` · `--persistent` · `--permanent` · `--responsive` | Modo y variante. |
| `.mtx-drawer--open` · `--animated` | Estado abierto y transición de deslizamiento. |
| `.mtx-drawer--narrow` · `--wide` · `--full-width` | Anchos. |
| `.mtx-drawer--clipped` · `--absolute` | Bajo la AppBar / contenido. |
| `.mtx-drawer__header` · `__heading` · `__title` · `__subtitle` · `__close` | Cabecera generada. |
| `.mtx-drawer__user` · `__user-avatar` · `__user-info` · `__user-name` · `__user-email` | Cabecera de usuario. |
| `.mtx-drawer__content` · `__content--padded` | Panel desplazable. |
| `.mtx-drawer__footer` · `__footer-info` · `__footer-actions` · `__footer--column` | Pie. |
| `.mtx-drawer__temporary-only` · `__permanent-only` | Contenido visible solo en un modo. |
| `.mtx-collapse-indicator` | Indicador del submenú (rota con `aria-expanded="true"`). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` | Ancho por defecto por breakpoint (`min(85vw, 320px)`, 280px, 300px). |
| `--mtx-drawer-width-narrow` · `--mtx-drawer-width-wide` | `narrow` (200px) y `wide` (360px). |
| `--mtx-drawer-elevation` | Sombra del temporal (`--mtx-elevation-16`). |
| `--mtx-app-bar-height` | Altura de la AppBar para `clipped` (56px, 64px desde 600px). |
| `--mtx-z-index-modal` · `--mtx-z-index-drawer` · `--mtx-z-index-app-bar` | Apilamiento: temporal 1300 (fondo 1299), permanente 1200, permanente clipped 1099, AppBar 1100. |
| `--mtx-duration-standard` · `--mtx-easing-standard` | Deslizamiento (300ms) e indicador del submenú. |

## Accesibilidad

- `temporary`: el panel recibe `role="dialog"`, `aria-modal="true"` y `tabindex="-1"`, nombrado por el título generado o el `aria-label` / `aria-labelledby` del drawer. El foco va al primer elemento (o al marcado con `data-drawer-autofocus`), <kbd>Tab</kbd> no sale del panel y el foco vuelve al disparador al cerrar. `persistent` recibe `role="region"` y `permanent` `role="navigation"` (salvo que pases `role`). La raíz mantiene `aria-hidden` sincronizado.
- Dale nombre al contenido: un `<List component="nav" aria-label="…">` para la navegación, o un `aria-label` en el drawer.
- El `aria-label` del botón de cierre generado sale del diccionario i18n (`drawer.close`: "Close" / "Cerrar").
- Conecta el disparador con `aria-controls` y `aria-expanded` (la AppBar lo hace con `navigationControls` y `navigationExpanded`).
- Escape pasa por la pila común de capas: un Menu o Popover abierto dentro del drawer se cierra primero.
- Respeta `prefers-reduced-motion`: sin transiciones de deslizamiento ni de submenús.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el disparador | Abre o cierra el drawer. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre el drawer; en `temporary` el foco no sale de él. |
| <kbd>Escape</kbd> | Cierra el drawer temporal (salvo `disableEscapeKeyDown`). |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en un submenú | Lo despliega o pliega. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="drawer"` + `open()` / `close()` / `toggle()` / `isOpen` | `<Drawer open={…} onClose={…}>` |
| `data-open` | `open={true}` inicial |
| `data-variant`, `data-anchor`, `data-breakpoint` | `variant`, `anchor`, `breakpoint` |
| `data-width`, `data-elevation` | `width`, `elevation` |
| `data-clipped`, `data-absolute`, `data-padded` | `clipped`, `absolute`, `padded` |
| `data-title`, `data-subtitle`, `data-close-button="false"` | `title`, `subtitle`, `closeButton={false}` |
| `data-user-name`, `data-user-email`, `data-user-avatar` | `userName`, `userEmail`, `userAvatar` |
| `data-footer-version`, `data-footer-action`, `data-footer-action-icon` | `footerInfo`, `footerAction`, `footerActionIcon` |
| `data-header="temporary"` | `headerMode="temporary"` |
| `data-backdrop="false"` / `data-hide-backdrop` | `hideBackdrop` |
| `data-disable-backdrop-click`, `data-disable-escape` | `disableBackdropClick`, `disableEscapeKeyDown` |
| `data-mtx-drawer-open` / `-toggle="id"` | un botón que cambia el estado (con `aria-controls`) |
| `data-mtx-drawer-close` | el mismo atributo dentro del drawer |
| `data-drawer="id"` de la AppBar | `navigationControls`, `navigationExpanded`, `onNavigationClick` de la AppBar |
| `data-mtx-collapse-trigger` + `.mtx-collapse` | `DrawerSubmenu` |
| `instance.mode` | `useDrawerMode(variant, breakpoint)` |
| `mtx:drawer:open` / `close` / `mode-change` | `onOpen` / `onClose` / `onModeChange` |
