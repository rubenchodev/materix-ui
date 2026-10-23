---
title: "Alert"
description: "Mensaje breve y destacado que informa del resultado de una acción o del estado del sistema sin interrumpir al usuario."
group: "feedback"
icon: "warning"
weight: 10
example: "alert"
mui: "https://mui.com/material-ui/react-alert/"
---

**Alert** muestra un mensaje corto e importante dentro del flujo de la página, con un color y un icono que comunican su severidad (`success`, `info`, `warning`, `error`). Úsalo para confirmar una operación, avisar de un problema o explicar un error de validación junto al contenido afectado. No lo uses para notificaciones temporales que desaparecen solas (usa [Snackbar](../snackbar/)) ni para decisiones que bloquean la tarea (usa [Dialog](../dialog/)).

## Uso básico

Basta con un único `<div data-mtx="alert">`. El componente genera el icono de la severidad, el contenedor `.mtx-alert__message` y, si indicas `data-title`, el título.

{{< mtx-demo title="Sintaxis simplificada" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">Los cambios se guardaron correctamente.</div>
  <div data-mtx="alert" data-severity="error" data-title="Error">No se pudo conectar con el servidor.</div>
</div>
{{< /mtx-demo >}}

## Variantes

Como en MUI hay tres variantes, que se eligen con `data-variant`: `standard` (fondo suave, predeterminada), `filled` (fondo sólido de la severidad) y `outlined` (solo borde).

{{< mtx-demo title="Standard" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">Pedido confirmado.</div>
  <div data-mtx="alert" data-severity="info">Hay una versión nueva disponible.</div>
  <div data-mtx="alert" data-severity="warning">El plan vence en 3 días.</div>
  <div data-mtx="alert" data-severity="error">El pago fue rechazado.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Filled" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success" data-variant="filled">Pedido confirmado.</div>
  <div data-mtx="alert" data-severity="info" data-variant="filled">Hay una versión nueva disponible.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="filled">El plan vence en 3 días.</div>
  <div data-mtx="alert" data-severity="error" data-variant="filled">El pago fue rechazado.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Outlined" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success" data-variant="outlined">Pedido confirmado.</div>
  <div data-mtx="alert" data-severity="info" data-variant="outlined">Hay una versión nueva disponible.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="outlined">El plan vence en 3 días.</div>
  <div data-mtx="alert" data-severity="error" data-variant="outlined">El pago fue rechazado.</div>
</div>
{{< /mtx-demo >}}

## Severidades

`data-severity` define a la vez el color (tokens `--mtx-color-{severidad}`) y el icono SVG. Si se omite, se aplica `success`.

| Severidad | Cuándo usarla |
|---|---|
| `success` | La operación terminó correctamente. |
| `info` | Información neutra o contextual. |
| `warning` | Algo requiere atención pronto, pero no ha fallado. |
| `error` | La operación falló y el usuario debe actuar. |

## Con iconos

El icono se genera automáticamente como un SVG de 22 px, igual que en MUI, en el color principal de la severidad. Para sustituirlo, incluye un hijo `.mtx-alert__icon` (el componente lo respeta); para quitarlo, usa `data-icon="false"`.

{{< mtx-demo title="Icono automático, personalizado y sin icono" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info">Icono generado según la severidad.</div>
  <div data-mtx="alert" data-severity="success">
    <span class="mtx-alert__icon"><span class="material-icons" aria-hidden="true">cloud_done</span></span>
    Copia de seguridad completada.
  </div>
  <div data-mtx="alert" data-severity="warning" data-icon="false">Alerta sin icono.</div>
</div>
{{< /mtx-demo >}}

## Título

`data-title` genera un `.mtx-alert__title` en negrita encima del mensaje (equivalente a `AlertTitle` de MUI).

{{< mtx-demo title="Con título" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-title="Mantenimiento programado">El servicio estará en pausa el domingo de 02:00 a 04:00.</div>
  <div data-mtx="alert" data-severity="error" data-variant="filled" data-title="Sesión expirada">Vuelve a iniciar sesión para continuar.</div>
</div>
{{< /mtx-demo >}}

## Acciones

No existe un atributo para la acción: escribe el texto dentro de `.mtx-alert__message` y deja el botón como hermano. Cuando el mensaje ya existe, el componente no mueve el resto de hijos, así que el botón queda alineado a la derecha.

{{< mtx-demo title="Alerta con acción" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="success">
    <div class="mtx-alert__message">Se eliminó 1 conversación.</div>
    <button class="mtx-button mtx-button--text mtx-button--small mtx-button--success" data-mtx="button">Deshacer</button>
  </div>
</div>
{{< /mtx-demo >}}

## Cerrable

`data-dismissible` añade un botón de cierre con un `aria-label` traducido por el diccionario i18n (`Close` en inglés, `Cerrar` en español, según el `lang` del elemento; cámbialo con `data-close-label`). Al pulsarlo, la alerta se desvanece en 200 ms, recibe el atributo `hidden` (sale del flujo, sin dejar hueco) y emite `mtx:alert:close`.

{{< mtx-demo title="Con botón de cierre" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-dismissible data-close-label="Descartar aviso">Puedes descartar este aviso.</div>
  <div data-mtx="alert" data-severity="warning" data-variant="filled" data-title="Atención" data-dismissible>La sincronización se detuvo.</div>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="hidden funciona sobre la propia alerta" >}}
`.mtx-alert[hidden]` es `display: none`, así que puedes alternar `hidden` directamente en la alerta y una alerta cerrada ya no ocupa espacio. Con `prefers-reduced-motion: reduce`, `close()` la oculta al instante, sin desvanecerla.
{{< /callout >}}

## Casos de uso reales

### Error de validación en un formulario

Pon `hidden` en la alerta y quítalo al validar.

{{< mtx-demo title="Formulario de acceso" layout="block" >}}
<form class="mtx-stack mtx-stack--col mtx-stack--spacing-2" id="doc-alert-form" novalidate>
  <div data-mtx="alert" data-severity="error" data-title="Revisa el formulario" id="doc-alert-form-error" hidden>El correo y la contraseña son obligatorios.</div>
  <input data-mtx="text-field" data-label="Correo electrónico" type="email" name="email" />
  <input data-mtx="text-field" data-label="Contraseña" type="password" name="password" />
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Iniciar sesión</button>
</form>
{{< /mtx-demo >}}

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = form.elements.email.value && form.elements.password.value;
  document.getElementById('doc-alert-form-error').hidden = Boolean(valid);
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('doc-alert-form');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var valid = form.elements.email.value.trim() && form.elements.password.value.trim();
    document.getElementById('doc-alert-form-error').hidden = Boolean(valid);
  });
});
</script>

### Resumen en un panel

{{< mtx-demo title="Avisos de un panel de control" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="alert" data-severity="success" data-title="Ventas">+12 % respecto al mes anterior.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-md="6">
    <div data-mtx="alert" data-severity="warning" data-title="Inventario">3 productos con stock bajo.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Sintaxis BEM completa

Para SSR o control fino escribe la estructura completa: el componente reutiliza el `.mtx-alert__icon` y el `.mtx-alert__message` existentes y solo añade las clases de severidad y variante.

```html
<div class="mtx-alert mtx-alert--warning mtx-alert--outlined" data-mtx="alert"
     data-severity="warning" data-variant="outlined" role="alert">
  <span class="mtx-alert__icon">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  </span>
  <div class="mtx-alert__message">
    <div class="mtx-alert__title">Estructura BEM</div>
    Renderizada en el servidor; no requiere auto-construcción.
  </div>
</div>
```

## Uso programático

Los elementos `[data-mtx="alert"]` se inicializan solos al cargar la página. Para contenido dinámico usa `Materix.init(el)` o la clase directamente; `Materix.getInstance(el)` devuelve la instancia existente.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-severity', 'warning');
el.setAttribute('data-dismissible', '');
el.textContent = 'Quedan 2 intentos.';
container.append(el);
Materix.init(el, 'alert');             // o: new Materix.Alert(el)

const alert = Materix.getInstance(el);
alert.close();
alert.open();

el.addEventListener('mtx:alert:close', () => console.log('cerrada'));
```

```javascript
// ES modules
import { Alert, getInstance } from 'materix-ui';

const alert = new Alert(document.querySelector('#aviso'));
alert.close();
```

{{< mtx-demo title="close() y open()" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <div data-mtx="alert" data-severity="info" data-dismissible id="doc-alert-api">Controlada desde JavaScript.</div>
  <div>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-alert-close">close()</button>
    <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-alert-open">open()</button>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-alert-api');
  if (!el) return;
  document.getElementById('doc-alert-close').addEventListener('click', function () { Materix.getInstance(el).close(); });
  document.getElementById('doc-alert-open').addEventListener('click', function () { Materix.getInstance(el).open(); });
});
</script>

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `alert` | — | Inicializa el componente. |
| `data-severity` | `success` \| `info` \| `warning` \| `error` | `success` | Color e icono de la alerta. |
| `data-variant` | `standard` \| `filled` \| `outlined` | `standard` | Variante visual. |
| `data-title` | texto | — | Genera un `.mtx-alert__title` al inicio del mensaje. |
| `data-icon` | `false` | — | Con `false` no se genera el icono automático. |
| `data-dismissible` | booleano (presencia) | ausente | Añade el botón de cierre `.mtx-alert__close`. |
| `data-close-label` | texto | i18n `alert.close` (`Close` / `Cerrar`) | `aria-label` del botón de cierre. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-alert` | Contenedor flex (se añade automáticamente). |
| `.mtx-alert--success` / `--info` / `--warning` / `--error` | Color de la severidad. |
| `.mtx-alert--standard` | Fondo suave: 10 % del color sobre blanco (claro) o negro (oscuro), como MUI. |
| `.mtx-alert--filled` | Fondo sólido con texto de contraste. |
| `.mtx-alert--outlined` | Fondo transparente con borde del color. |
| `.mtx-alert__icon` | Contenedor del icono (generado o propio), en el color principal de la severidad; el SVG generado mide 22 px. |
| `.mtx-alert__message` | Contenedor del texto; ocupa el espacio disponible. |
| `.mtx-alert__title` | Título en negrita (`font-weight: 500`). |
| `.mtx-alert__close` | Botón circular de cierre de 30 px (IconButton small de MUI). |

### Métodos

| Método | Retorna | Descripción |
|---|---|---|
| `close()` | `void` | Desvanece la alerta (200 ms; al instante con movimiento reducido), le pone `hidden` (sale del flujo) y emite `mtx:alert:close`. No hace nada si ya tiene `hidden`. |
| `open()` | `void` | Quita `hidden`, restaura la opacidad y emite `mtx:alert:open`. |
| `destroy()` | `void` | Cancela el temporizador y quita el listener del botón de cierre. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:alert:close` | — | Termina la animación de cierre (burbujea). |
| `mtx:alert:open` | — | Se llama a `open()` (burbujea). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-{severidad}` | Fondo de `filled`, borde de `outlined` y base del fondo suave de `standard`. |
| `--mtx-alert-text-mix` / `--mtx-alert-bg-mix` | Tonos que se mezclan con el color de la severidad en `standard`/`outlined`: texto = 40 % del color + `#000` (claro) o `#fff` (oscuro); fondo = 10 % del color + `#fff` (claro) o `#000` (oscuro). |
| `--mtx-color-{severidad}-contrast` | Color del texto en `filled`. |
| `--mtx-shape-radius` | Radio de las esquinas (4 px). |
| `--mtx-font-family` | Tipografía. |

## Accesibilidad

- Si el elemento no tiene `role`, el componente añade `role="alert"`, que los lectores de pantalla anuncian de inmediato. Para mensajes informativos que no deben interrumpir, declara tú `role="status"` antes de inicializar.
- Los iconos SVG generados llevan `aria-hidden="true"` y `focusable="false"`; el significado debe estar en el texto, no solo en el color.
- El botón de cierre es un `<button type="button">` nativo con `aria-label` configurable mediante `data-close-label`.
- Si añades un icono propio, márcalo con `aria-hidden="true"`.

| Tecla | Acción |
|---|---|
| `Tab` | Mueve el foco a la acción y al botón de cierre. |
| `Enter` / `Espacio` | Activa el botón enfocado (cierre o acción). |
