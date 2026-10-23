---
title: "Stepper"
description: "Muestra el progreso a lo largo de una secuencia de pasos numerados, horizontal o vertical, lineal o con pasos clicables, y su versión móvil compacta."
group: "navigation"
icon: "linear_scale"
weight: 60
example: "stepper"
mui: "https://mui.com/material-ui/react-stepper/"
---

`Stepper` comunica el progreso de un proceso dividido en pasos (alta de cuenta, checkout, asistente de configuración): qué paso está activo, cuáles se completaron y cuáles faltan. Úsalo cuando el orden importa y cada paso tiene sentido por sí mismo. No lo uses para alternar entre vistas del mismo nivel (usa [Tabs](../tabs/)) ni para indicar el avance de una operación en curso (usa [Progress](../progress/)).

## Uso básico

Un `<ol data-mtx="stepper">` con un `<li data-label>` por paso. El componente genera el icono numerado de 24px, los conectores, el texto accesible ("Paso 2 de 3") y marca el paso activo con `aria-current="step"`. `data-active-step` es el índice del paso activo, empezando en 0.

{{< mtx-demo title="Stepper horizontal" layout="block" >}}
<ol data-mtx="stepper" data-active-step="1" aria-label="Recuperar contraseña">
  <li data-label="Email"></li>
  <li data-label="Verificar código"></li>
  <li data-label="Nueva contraseña"></li>
</ol>
{{< /mtx-demo >}}

## Lineal con acciones

En modo lineal (por defecto) los pasos anteriores al activo se consideran completados y los siguientes deshabilitados. Los botones con `data-mtx-stepper-action="back|next|reset"` y `data-target="#id"` controlan el stepper sin escribir JavaScript; `data-panel` en cada paso muestra su panel solo cuando está activo, y `data-finished-panel` muestra el panel final cuando `activeStep` llega al número de pasos.

{{< mtx-demo title="Asistente lineal" layout="column" >}}
<ol id="doc-stepper-linear" data-mtx="stepper" data-finished-panel="#doc-stepper-done" aria-label="Crear campaña">
  <li data-label="Configuración" data-panel="#doc-stepper-p1"></li>
  <li data-label="Grupo de anuncios" data-optional data-panel="#doc-stepper-p2"></li>
  <li data-label="Crear anuncio" data-panel="#doc-stepper-p3"></li>
</ol>
<p id="doc-stepper-p1">Paso 1: elige el objetivo y el presupuesto.</p>
<p id="doc-stepper-p2" hidden>Paso 2: define audiencias y ubicaciones.</p>
<p id="doc-stepper-p3" hidden>Paso 3: redacta el anuncio.</p>
<p id="doc-stepper-done" hidden>Todos los pasos completados.</p>
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-stepper-action="back" data-target="#doc-stepper-linear">Atrás</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-stepper-action="next" data-target="#doc-stepper-linear">Siguiente</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-stepper-action="reset" data-target="#doc-stepper-linear">Reiniciar</button>
</div>
{{< /mtx-demo >}}

Los botones `back` se deshabilitan solos en el primer paso y los `next` al terminar (añade `data-keep-enabled` para evitarlo).

## Etiqueta alternativa

`data-alternative-label` coloca la etiqueta debajo del icono y reparte el ancho a partes iguales. Es la opción más estable en pantallas estrechas.

{{< mtx-demo title="data-alternative-label" layout="block" >}}
<ol data-mtx="stepper" data-alternative-label data-active-step="1" aria-label="Pedido">
  <li data-label="Carrito"></li>
  <li data-label="Envío"></li>
  <li data-label="Pago"></li>
  <li data-label="Confirmación"></li>
</ol>
{{< /mtx-demo >}}

## No lineal

Con `data-non-linear` cada paso es un `<button>` (StepButton) con ripple, foco visible y activación con <kbd>Enter</kbd> o <kbd>Espacio</kbd>, y el usuario puede saltar a cualquier paso. La completitud ya no se deduce del orden: se indica con `data-completed` o `setCompleted()`.

{{< mtx-demo title="data-non-linear" layout="block" >}}
<ol data-mtx="stepper" data-non-linear data-active-step="1" aria-label="Perfil">
  <li data-label="Datos personales" data-completed></li>
  <li data-label="Dirección"></li>
  <li data-label="Preferencias" data-optional></li>
</ol>
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` apila los pasos. El contenido del `<li>` se convierte en StepContent, que se expande con una transición solo en el paso activo (o siempre, con `data-expanded`). Dentro del stepper, `data-mtx-stepper-action` sin `data-target` actúa sobre su propio stepper.

{{< mtx-demo title="Stepper vertical" layout="block" >}}
<ol data-mtx="stepper" data-orientation="vertical" aria-label="Lanzar una campaña">
  <li data-label="Selecciona la configuración">
    <p>Elige el tipo de campaña, el país y el presupuesto diario.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Continuar</button>
  </li>
  <li data-label="Crea un grupo de anuncios" data-optional>
    <p>Un grupo de anuncios contiene uno o más anuncios con la misma audiencia.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Continuar</button>
    <button class="mtx-button mtx-button--text mtx-button--small" data-mtx="button" data-mtx-stepper-action="back">Atrás</button>
  </li>
  <li data-label="Crea un anuncio">
    <p>Redacta el titular y revisa la vista previa.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Finalizar</button>
    <button class="mtx-button mtx-button--text mtx-button--small" data-mtx="button" data-mtx-stepper-action="back">Atrás</button>
  </li>
</ol>
{{< /mtx-demo >}}

## Con iconos

El StepIcon es por defecto el número del paso. `data-icon` usa un Material Icon propio (24px, sin forzar tamaño). Un paso completado muestra un check y uno con error un aviso, sustituyendo al icono.

{{< mtx-demo title="data-icon" layout="block" >}}
<ol data-mtx="stepper" data-active-step="1" aria-label="Compra">
  <li data-label="Cuenta" data-icon="person"></li>
  <li data-label="Pago" data-icon="credit_card"></li>
  <li data-label="Envío" data-icon="local_shipping"></li>
</ol>
{{< /mtx-demo >}}

## Estados

Activo, completado, opcional (`data-optional`, con texto propio si se le da valor), error con mensaje (`data-error="mensaje"`) y deshabilitado (`data-disabled`). El conector anterior a un paso activo o completado toma el color primario.

{{< mtx-demo title="Error con mensaje" layout="block" >}}
<ol data-mtx="stepper" data-active-step="2" aria-label="Pago">
  <li data-label="Dirección"></li>
  <li data-label="Pago" data-error="Tarjeta rechazada"></li>
  <li data-label="Revisión"></li>
</ol>
{{< /mtx-demo >}}

{{< mtx-demo title="Opcional, completado y deshabilitado" layout="block" >}}
<ol data-mtx="stepper" data-non-linear aria-label="Estados">
  <li data-label="Activo"></li>
  <li data-label="Completado" data-completed></li>
  <li data-label="Opcional" data-optional="Se puede omitir"></li>
  <li data-label="Deshabilitado" data-disabled></li>
</ol>
{{< /mtx-demo >}}

{{< callout type="info" title="Comportamiento responsive" >}}
Por debajo de 600px, en el stepper horizontal sin etiqueta alternativa solo el paso activo muestra su etiqueta; las demás quedan ocultas visualmente pero disponibles para lectores de pantalla. Si necesitas ver todas las etiquetas en móvil, usa `data-alternative-label` o la orientación vertical.
{{< /callout >}}

## Mobile stepper

`data-mtx="mobile-stepper"` es la versión compacta de MUI: genera los botones Atrás/Siguiente y un indicador `dots` (por defecto), `text` ("2 / 5") o `progress` (reutiliza [LinearProgress](../progress/)). `data-position="bottom|top"` lo fija al borde de la ventana.

{{< mtx-demo title="Variantes de MobileStepper" layout="column" >}}
<div data-mtx="mobile-stepper" data-steps="6" data-active-step="1"></div>
<div data-mtx="mobile-stepper" data-variant="text" data-steps="5"></div>
<div data-mtx="mobile-stepper" data-variant="progress" data-steps="6" data-active-step="2"></div>
{{< /mtx-demo >}}

## Casos de uso reales

Alta de cuenta con validación: el evento cancelable `mtx:stepper:change` impide avanzar si el email no es válido y marca el paso con error.

{{< mtx-demo title="Asistente con validación" layout="column" >}}
<ol id="doc-stepper-signup" data-mtx="stepper" data-alternative-label aria-label="Alta de cuenta">
  <li data-label="Cuenta" data-panel="#doc-signup-1"></li>
  <li data-label="Empresa" data-panel="#doc-signup-2"></li>
  <li data-label="Plan" data-panel="#doc-signup-3"></li>
</ol>
<div id="doc-signup-1">
  <input id="doc-signup-email" data-mtx="text-field" data-label="Email de trabajo" data-variant="outlined" type="email" required />
</div>
<div id="doc-signup-2" hidden>
  <input data-mtx="text-field" data-label="Nombre de la empresa" data-variant="outlined" type="text" />
</div>
<p id="doc-signup-3" hidden>Plan Equipo · 12 € por usuario al mes.</p>
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-stepper-action="back" data-target="#doc-stepper-signup">Atrás</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-stepper-action="next" data-target="#doc-stepper-signup">Siguiente</button>
</div>
{{< /mtx-demo >}}

```javascript
const signup = document.getElementById('doc-stepper-signup');
signup.addEventListener('mtx:stepper:change', (event) => {
  const stepper = Materix.getInstance(signup);
  if (event.detail.previousStep === 0 && event.detail.activeStep > 0) {
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
    stepper.setError(0, valid ? false : 'Introduce un email válido');
    if (!valid) event.preventDefault();
  }
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const signup = document.getElementById('doc-stepper-signup');
  const email = document.getElementById('doc-signup-email');
  if (!signup || !email) return;
  signup.addEventListener('mtx:stepper:change', (event) => {
    const stepper = Materix.getInstance(signup);
    if (event.detail.previousStep === 0 && event.detail.activeStep > 0) {
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
      stepper.setError(0, valid ? false : 'Introduce un email válido');
      if (!valid) event.preventDefault();
    }
  });
});
</script>

## Sintaxis BEM completa

Para SSR o control fino: si cada `<li class="mtx-step">` ya trae `.mtx-step__label-container`, el componente lo reutiliza (no duplica conectores ni etiquetas) y solo pinta el icono, los textos accesibles y los estados.

```html
<ol class="mtx-stepper mtx-stepper--horizontal" data-mtx="stepper" data-active-step="1">
  <li class="mtx-step">
    <span class="mtx-step__label-container">
      <span class="mtx-step__icon-container"></span>
      <span class="mtx-step__label-text"><span class="mtx-step__label">Datos</span></span>
    </span>
  </li>
  <li class="mtx-step">
    <span class="mtx-step-connector"><span class="mtx-step-connector__line"></span></span>
    <span class="mtx-step__label-container">
      <span class="mtx-step__icon-container"></span>
      <span class="mtx-step__label-text"><span class="mtx-step__label">Revisión</span></span>
    </span>
    <div class="mtx-step__content">Contenido (solo visible en vertical)</div>
  </li>
</ol>
```

## Uso programático

```javascript
const stepper = Materix.getInstance(document.getElementById('wizard'));
// o bien: const stepper = new Materix.Stepper(element);

stepper.next();                       // siguiente paso habilitado
stepper.back();                       // paso habilitado anterior
stepper.goTo(2);                      // índice (0 … número de pasos)
stepper.setCompleted(0, true);        // marca o desmarca completado
stepper.setError(1, 'Campo obligatorio'); // mensaje, true (sin mensaje) o false
stepper.reset();                      // vuelve al primer paso y limpia estados
console.log(stepper.activeStep, stepper.finished);

stepper.element.addEventListener('mtx:stepper:change', (event) => {
  const { activeStep, previousStep } = event.detail;
  if (!isValid(previousStep)) event.preventDefault(); // cancela el cambio
});
```

Con ES modules:

```javascript
import { Stepper, MobileStepper, getInstance } from 'materix-ui';
```

{{< mtx-demo title="API y eventos" layout="column" >}}
<ol id="doc-stepper-api" data-mtx="stepper" data-non-linear aria-label="API">
  <li data-label="Uno"></li>
  <li data-label="Dos"></li>
  <li data-label="Tres"></li>
</ol>
<div>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="back">back()</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="next">next()</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="complete">setCompleted(activo)</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="error">setError(activo)</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="reset">reset()</button>
</div>
<span id="doc-stepper-status" aria-live="polite"></span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-stepper-api');
  if (!el) return;
  const stepper = Materix.getInstance(el);
  const status = document.getElementById('doc-stepper-status');
  document.querySelectorAll('[data-doc-stepper]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.docStepper;
      if (action === 'complete') stepper.setCompleted(stepper.activeStep, !stepper.isCompleted(stepper.activeStep));
      else if (action === 'error') stepper.setError(stepper.activeStep, 'Revisa este paso');
      else stepper[action]();
    });
  });
  el.addEventListener('mtx:stepper:change', (event) => {
    status.textContent = 'mtx:stepper:change → activeStep ' + event.detail.activeStep + ', previousStep ' + event.detail.previousStep;
  });
});
</script>

## Referencia de API

### Atributos data-*

**Stepper** (`data-mtx="stepper"`, sobre un `<ol>`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-active-step` | número (0 … pasos) | `0` | Índice del paso activo. Igual al número de pasos = terminado. Se actualiza al navegar. |
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Orientación. En vertical, el contenido del `<li>` es StepContent colapsable. |
| `data-alternative-label` | booleano | — | Etiqueta bajo el icono (solo horizontal). |
| `data-non-linear` | booleano | — | Pasos clicables (`<button>`); la completitud no se deduce del orden. |
| `data-finished-panel` | selector CSS | — | Elemento que se muestra solo al terminar (`activeStep === length`). |
| `data-label` | texto | — | `aria-label` del `<ol>` si no lo tiene. |

**Paso** (`<li>` hijo)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-label` | texto | texto del `<li>` | Etiqueta del paso. Sin `data-label`, un `<li>` con solo texto usa ese texto. |
| `data-optional` | booleano o texto | — | Muestra el caption "Optional"/"Opcional" (traducido) o el texto indicado. |
| `data-completed` | booleano, `"false"` | según el orden (lineal) | Fuerza el estado completado (o lo impide con `"false"`). |
| `data-error` | texto o vacío | — | Estado de error con icono de aviso; el texto se muestra como mensaje. |
| `data-disabled` | booleano | — | Paso no activable (`<button disabled>` en no lineal). |
| `data-icon` | nombre Material Icons | número | Icono propio del paso. |
| `data-expanded` | booleano | — | En vertical, mantiene el contenido expandido aunque no esté activo. |
| `data-panel` | selector CSS | — | Panel externo visible solo con el paso activo (`hidden` en el resto). |

**Disparadores declarativos**

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx-stepper-action` | `next`, `back`, `reset` | — | En cualquier botón: ejecuta el método al hacer clic. |
| `data-target` | selector CSS | stepper ancestro | Stepper o MobileStepper controlado. |
| `data-keep-enabled` | booleano | — | No sincroniza `disabled` del disparador con el paso activo. |

**MobileStepper** (`data-mtx="mobile-stepper"`)

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-steps` | número ≥ 1 | `1` | Número de pasos. |
| `data-active-step` | número | `0` | Paso activo. |
| `data-variant` | `dots`, `text`, `progress` | `dots` | Indicador de progreso. |
| `data-position` | `static`, `bottom`, `top` | `static` | `bottom`/`top` lo fijan al borde de la ventana. |
| `data-back-label`, `data-next-label` | texto | "Back"/"Next" traducidos | Textos de los botones. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-stepper` | Raíz (flex, sin estilos de lista). |
| `mtx-stepper--horizontal`, `mtx-stepper--vertical` | Orientación. |
| `mtx-stepper--alternative-label` | Etiqueta bajo el icono, pasos de igual ancho. |
| `mtx-stepper--non-linear` | Modo no lineal. |
| `mtx-stepper--finished` | Todos los pasos superados. |
| `mtx-step` | Paso (`<li>`). |
| `mtx-step--active`, `mtx-step--completed`, `mtx-step--error`, `mtx-step--disabled`, `mtx-step--expanded`, `mtx-step--last` | Estados del paso. |
| `mtx-step__label-container` | StepLabel (`<span>`, o `<button>` en no lineal). |
| `mtx-step-button` | StepButton (no lineal): ripple, hover y foco. |
| `mtx-step__icon-container`, `mtx-step-icon` | Contenedor y StepIcon de 24px. |
| `mtx-step-icon--number`, `--completed`, `--error`, `--custom`, `--active` | Variantes del icono. |
| `mtx-step__label-text`, `mtx-step__label`, `mtx-step__optional` | Textos: etiqueta y caption (opcional o mensaje de error). |
| `mtx-step__sr` | Texto solo para lectores de pantalla. |
| `mtx-step-connector`, `mtx-step-connector__line` | StepConnector. |
| `mtx-step__content`, `mtx-step__content-inner` | StepContent colapsable (vertical). |
| `mtx-mobile-stepper`, `mtx-mobile-stepper--{dots,text,progress}`, `--{static,bottom,top}` | MobileStepper y sus variantes. |
| `mtx-mobile-stepper__back`, `__next`, `__indicator`, `__dot`, `__dot--active`, `__progress`, `__status` | Partes del MobileStepper. |

### Métodos

**Stepper**

| Método | Retorna | Descripción |
|---|---|---|
| `next()` | `boolean` | Avanza al siguiente paso habilitado (hasta "terminado"). |
| `back()` | `boolean` | Retrocede al paso habilitado anterior. |
| `goTo(index)` | `boolean` | Activa el índice (0 … `length`). `false` si está fuera de rango, deshabilitado o cancelado. |
| `reset()` | `boolean` | Vuelve al paso 0 y limpia completados y errores. |
| `setCompleted(index, completed = true)` | `this` | Marca o desmarca un paso como completado. |
| `setError(index, message)` | `this` | Texto = error con mensaje; `true` = error sin mensaje; `false` = limpia. |
| `setDisabled(index, disabled = true)` | `this` | Habilita o deshabilita un paso. |
| `isCompleted(index)` | `boolean` | Estado completado efectivo del paso. |
| `refresh()` | `void` | Vuelve a leer los `<li>` tras añadir o quitar pasos. |
| `activeStep` (getter/setter) | `number` | Paso activo; asignarlo equivale a `goTo()`. |
| `length`, `finished` (getters) | `number`, `boolean` | Número de pasos y si se superaron todos. |
| `destroy()` | `void` | Elimina los listeners. Desvincula la instancia: después `getInstance()` devuelve `undefined`. |

**MobileStepper**: `next()`, `back()`, `goTo(index)`, `reset()`, `setSteps(count)`, `activeStep`, `steps`, `destroy()`.

### Eventos

| Evento | detail | Se emite cuando |
|---|---|---|
| `mtx:stepper:change` | `{ activeStep, previousStep }` (`reset: true` en `reset()`) | Antes de cambiar de paso (clic, disparador o API). Cancelable con `preventDefault()` para validar. Lo emiten Stepper y MobileStepper. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-stepper-connector-color` | Color del conector y del borde de StepContent (grey 400 en claro, grey 600 en oscuro). |
| `--mtx-stepper-icon-size` | Tamaño del StepIcon (24px). |
| `--mtx-color-primary`, `--mtx-color-primary-contrast` | Icono activo/completado, conector activo y número. |
| `--mtx-color-text-disabled` | Icono de pasos pendientes. |
| `--mtx-color-text-primary`, `--mtx-color-text-secondary` | Etiquetas. |
| `--mtx-color-error` | Paso con error. |
| `--mtx-color-action-hover`, `--mtx-focus-ring-*` | Hover y foco del StepButton. |
| `--mtx-color-background-default`, `--mtx-color-action-disabled`, `--mtx-z-index-mobile-stepper` | MobileStepper. |

## Accesibilidad

- Se usa un `<ol>` semántico: el orden de los pasos forma parte del significado. Dale un nombre con `aria-label`.
- El paso activo lleva `aria-current="step"` (en el `<li>`, o en su `<button>` en modo no lineal).
- Cada paso incluye texto oculto con su posición y estado: "Paso 2 de 3: Envío, completado". Los iconos y conectores son decorativos (`aria-hidden`). Los textos se traducen según el `lang` del documento o `data-locale`.
- En modo no lineal los pasos son `<button>` nativos con foco visible; los deshabilitados usan `disabled`.
- En vertical, el contenido de los pasos colapsados se marca `inert` y `aria-hidden` para que no reciba foco.
- MobileStepper anuncia el paso actual en una región `aria-live="polite"`; los puntos y la barra son decorativos.
- Respeta `prefers-reduced-motion`.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Recorre los pasos clicables (no lineal) y los botones Atrás/Siguiente. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa el paso enfocado o el botón. |
