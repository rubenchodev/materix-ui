---
title: "Stepper"
description: "Muestra el progreso a lo largo de una secuencia de pasos numerados, horizontal o vertical, lineal o con pasos clicables, y su versión móvil compacta."
group: "navigation"
icon: "linear_scale"
weight: 60
example: "stepper"
import: "Stepper, Step, StepLabel, StepContent, MobileStepper, useStepper, StepperButton, StepPanel"
mui: "https://mui.com/material-ui/react-stepper/"
---

`Stepper` comunica el progreso de un proceso dividido en pasos (alta de cuenta, checkout, asistente de configuración): qué paso está activo, cuáles se completaron y cuáles faltan. Úsalo cuando el orden importa y cada paso tiene sentido por sí mismo. No lo uses para alternar entre vistas del mismo nivel (usa [Tabs](../tabs/)) ni para indicar el avance de una operación en curso (usa [Progress](../progress/)).

## Importación

```tsx
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  useStepper,
  StepperButton,
  StepPanel,
} from '@rubenchodev/materix-react';
```

## Uso básico

La forma más corta es un `<Stepper>` con un array `steps` de etiquetas. El componente genera el `<ol>` semántico, el icono numerado de 24px, los conectores y el texto accesible ("Paso 2 de 3"), y marca el paso activo con `aria-current="step"`. `defaultActiveStep` (no controlado) o `activeStep` (controlado) es el índice del paso activo, empezando en 0.

{{< react-demo id="stepper/01-basic" layout="block" >}}

```tsx
<Stepper defaultActiveStep={1} label="Reset password" steps={['Email', 'Verify code', 'New password']} />
```

Cada entrada de `steps` también puede ser un objeto con las props de `Step` (`{ label, optional, error, completed, disabled, icon, expanded, content }`), o puedes escribir hijos `<Step>`.

## Lineal con acciones

En modo lineal (el predeterminado) los pasos anteriores al activo se consideran completados y los siguientes deshabilitados. `useStepper()` enlaza un stepper mediante `apiRef` y expone su estado; `StepperButton action="back|next|reset"` lo controla y se deshabilita en el primer paso (`back`) o al terminar (`next`) salvo con `keepEnabled`; `StepPanel` muestra el panel del paso activo, e `index="finished"` el panel final cuando `activeStep` alcanza el número de pasos.

{{< react-demo id="stepper/02-linear" layout="block" >}}

```tsx
const stepper = useStepper();

<Stepper apiRef={stepper.apiRef} label="Create campaign">
  <Step label="Settings" />
  <Step label="Ad group" optional />
  <Step label="Create ad" />
</Stepper>
<StepPanel stepper={stepper} index={0}>…</StepPanel>
<StepPanel stepper={stepper} index="finished">Done</StepPanel>
<StepperButton action="back" stepper={stepper}>Back</StepperButton>
<StepperButton action="next" stepper={stepper} variant="contained">Next</StepperButton>
```

## Etiqueta alternativa

`alternativeLabel` coloca la etiqueta bajo el icono y reparte el ancho por igual. Es la opción más robusta en pantallas estrechas (solo horizontal).

{{< react-demo id="stepper/03-alternative-label" layout="block" >}}

## No lineal

Con `nonLinear` cada paso es un `<button>` (StepButton) con ripple, foco visible y activación con <kbd>Enter</kbd> o <kbd>Espacio</kbd>, y el usuario puede saltar a cualquier paso. El completado deja de inferirse del orden: se indica con `completed` o `setCompleted()`.

{{< react-demo id="stepper/04-non-linear" layout="block" >}}

## Vertical

`orientation="vertical"` apila los pasos. Los hijos de un `<Step label>` pasan a ser su StepContent, que se expande con transición solo en el paso activo (o siempre, con `expanded`). Dentro del stepper, un `StepperButton` sin `stepper` actúa sobre su propio stepper.

{{< react-demo id="stepper/05-vertical" layout="block" >}}

## Con iconos

Por defecto el StepIcon es el número del paso. `icon` usa un Material Icon propio por nombre (24px, sin forzar tamaño) o cualquier nodo. Un paso completado muestra un check y uno con error un aviso, sustituyendo al icono.

{{< react-demo id="stepper/06-with-icons" layout="block" >}}

## Estados

Activo, completado, opcional (`optional`, o un texto propio), error con mensaje (`error="mensaje"`, o `error` sin mensaje) y deshabilitado (`disabled`). El conector previo a un paso activo o completado toma el color primario.

{{< react-demo id="stepper/07-states" layout="block" >}}

{{< callout type="info" title="Comportamiento responsive" >}}
Por debajo de 600px, un stepper horizontal sin etiqueta alternativa solo muestra la etiqueta del paso activo; las demás quedan ocultas visualmente pero disponibles para lectores de pantalla. Si todas las etiquetas deben verse en móvil, usa `alternativeLabel` o la orientación vertical.
{{< /callout >}}

## Mobile stepper

`MobileStepper` es la versión compacta de MUI: genera los botones Atrás/Siguiente y un indicador `dots` (por defecto), `text` ("2 / 5") o `progress` (reutiliza [LinearProgress](../progress/)). `position="bottom|top"` lo fija al borde de la ventana. `backButton`/`nextButton` sustituyen los botones generados por nodos propios; si llevan la clase `mtx-mobile-stepper__back` / `mtx-mobile-stepper__next`, al pulsarlos navegan.

{{< react-demo id="stepper/08-mobile-stepper" layout="block" >}}

```tsx
<MobileStepper steps={6} />
<MobileStepper variant="text" steps={5} />
<MobileStepper variant="progress" steps={6} />
```

## Casos de uso reales

Un asistente de alta de cuenta con validación: el `onChange` cancelable devuelve `false` para impedir avanzar mientras el email del [TextField](../text-field/) no sea válido, y marca con error el paso y el campo (`setError()`, `error` + `helperText`).

{{< react-demo id="stepper/09-real-world" layout="block" >}}

```tsx
const handleChange: StepperChangeHandler = (activeStep, { previousStep }) => {
  if (previousStep === 0 && activeStep > 0) {
    const valid = EMAIL.test(email);
    stepper.setError(0, valid ? false : 'Enter a valid email');
    if (!valid) return false;
  }
};
```

## Grilla

Dentro de [Grid](../grid/) el stepper toma el ancho de su columna; en columnas estrechas funcionan mejor la etiqueta alternativa o la orientación vertical.

{{< react-demo id="stepper/10-grid" layout="block" >}}

## Uso programático

`apiRef` expone `next()`, `back()`, `goTo(i)`, `reset()`, `setCompleted(i, bool)`, `setError(i, mensaje|false)`, `setDisabled(i, bool)`, `isCompleted(i)` y los getters `activeStep`, `length` y `finished`. Todo cambio pasa por `onChange`, que puede cancelarlo.

{{< react-demo id="stepper/11-programmatic" layout="block" >}}

```tsx
const api = useRef<StepperApi>(null);

<Stepper apiRef={api} steps={['One', 'Two']} onChange={(next, { previousStep }) => isValid(previousStep)} />;

api.current?.next();
api.current?.setError(1, 'Campo obligatorio');
```

## Composición manual

El equivalente al uso BEM manual de vanilla: compón cada `Step` con `StepLabel` (etiqueta, `optional`, `icon`) y `StepContent`. El conector se sigue generando.

{{< react-demo id="stepper/12-composition" layout="block" >}}

## Referencia de API

### Props de Stepper

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `activeStep` | `number` | — | Paso activo (controlado). Igual al número de pasos = terminado. |
| `defaultActiveStep` | `number` | `0` | Paso activo inicial (no controlado). |
| `onChange` | `(activeStep, detail) => boolean \| void` | — | Antes de cambiar de paso (clic, botón o API). Devuelve `false` o llama a `detail.preventDefault()` para cancelar. `detail`: `{ activeStep, previousStep, reset? }`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación. En vertical, los hijos del paso son un StepContent plegable. |
| `alternativeLabel` | `boolean` | `false` | Etiqueta bajo el icono (solo horizontal). |
| `nonLinear` | `boolean` | `false` | Pasos clicables (`<button>`); el completado no se infiere del orden. |
| `steps` | `Array<string \| StepDefinition>` | — | Pasos como datos en lugar de hijos `<Step>`. |
| `label` | `string` | — | `aria-label` del `<ol>`. |
| `locale` | `string` | contexto | Idioma de los textos accesibles. |
| `apiRef` | `Ref<StepperApi>` | — | API imperativa (ver abajo). |

`ref`, `className`, `style` y el resto de atributos van al `<ol>`.

### Props de Step

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `label` | `ReactNode` | — | Etiqueta. Sin ella, un `Step` cuyos hijos son contenido simple los usa como etiqueta. |
| `optional` | `boolean \| ReactNode` | — | Caption "Opcional" traducido, o el texto indicado. |
| `completed` | `boolean` | según el orden (lineal) | Fuerza el estado completado (`false` lo impide). |
| `error` | `boolean \| string` | — | Estado de error con icono de aviso; el texto se muestra como mensaje. |
| `disabled` | `boolean` | `false` | El paso no se puede activar (`<button disabled>` en no lineal). |
| `icon` | `ReactNode` | número | Icono propio: nombre de Material Icons o nodo. |
| `expanded` | `boolean` | `false` | En vertical, mantiene el contenido expandido aunque no esté activo. |
| `children` | `ReactNode` | — | StepContent (con `label`) o partes manuales (`StepLabel`, `StepContent`). |

**StepLabel**: `children` (etiqueta), `optional`, `icon` y `disableRipple` (sustituyen los valores del `Step`). También se exportan **StepContent**, **StepConnector** y **StepIcon** (`icon`, `active`, `completed`, `error`).

### Hooks y utilidades

| Export | Descripción |
| :--- | :--- |
| `useStepper()` | Devuelve un controlador: `apiRef` (pásalo a `Stepper` o `MobileStepper`), `activeStep`, `length`, `finished`, `canBack`, `canNext` y los métodos de la API. |
| `StepperButton` | Un [Button](../button/) con `action="next\|back\|reset"`, `stepper` (controlador; opcional dentro de un Stepper) y `keepEnabled`. |
| `StepPanel` | `<div>` visible solo mientras `index` está activo (`index="finished"` al terminar). |
| `useStepperContext()` / `useStepContext()` | Contexto del Stepper / Step contenedor para partes propias. |

### Props de MobileStepper

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `steps` | `number` | — | Número de pasos (≥ 1). |
| `activeStep` / `defaultActiveStep` | `number` | `0` | Paso activo (controlado / no controlado). |
| `onChange` | `(activeStep, detail) => boolean \| void` | — | Cambio cancelable, como en `Stepper`. |
| `variant` | `'dots' \| 'text' \| 'progress'` | `'dots'` | Indicador de progreso. |
| `position` | `'static' \| 'bottom' \| 'top'` | `'static'` | `bottom`/`top` lo fijan al borde de la ventana. |
| `backButton` / `nextButton` | `ReactNode` | generados | Botones propios (con la clase `mtx-mobile-stepper__back`/`__next` navegan). |
| `backLabel` / `nextLabel` | `string` | "Atrás"/"Siguiente" traducidos | Textos de los botones generados. |
| `locale` | `string` | contexto | Idioma. |
| `apiRef` | `Ref<StepperBaseApi>` | — | `next()`, `back()`, `goTo()`, `reset()`, `activeStep`, `length`. |

### API imperativa (`StepperApi`)

| Miembro | Devuelve | Descripción |
| :--- | :--- | :--- |
| `next()` | `boolean` | Avanza al siguiente paso habilitado (hasta "terminado"). |
| `back()` | `boolean` | Retrocede al paso habilitado anterior. |
| `goTo(index)` | `boolean` | Activa el índice (0 … `length`). `false` si está fuera de rango, deshabilitado o se canceló. |
| `reset()` | `boolean` | Vuelve al paso 0 y limpia completados y errores. |
| `setCompleted(index, completed = true)` | `void` | Marca o desmarca un paso como completado. |
| `setError(index, message)` | `void` | Texto = error con mensaje; `true` = sin mensaje; `false` = limpia. |
| `setDisabled(index, disabled = true)` | `void` | Habilita o deshabilita un paso. |
| `isCompleted(index)` | `boolean` | Estado completado efectivo. |
| `activeStep`, `length`, `finished` | `number`, `number`, `boolean` | Estado actual. |

Los valores fijados con la API prevalecen sobre las props de `Step` hasta `reset()`.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-stepper`, `mtx-stepper--horizontal`, `mtx-stepper--vertical` | Raíz y orientación. |
| `mtx-stepper--alternative-label`, `mtx-stepper--non-linear`, `mtx-stepper--finished` | Modos y estado terminado. |
| `mtx-step`, `mtx-step--active`, `--completed`, `--error`, `--disabled`, `--expanded`, `--last` | Paso y sus estados. |
| `mtx-step__label-container`, `mtx-step-button` | StepLabel (`<span>`, o `<button>` en no lineal). |
| `mtx-step__icon-container`, `mtx-step-icon`, `mtx-step-icon--{number,completed,error,custom,active}` | StepIcon de 24px. |
| `mtx-step__label-text`, `mtx-step__label`, `mtx-step__optional`, `mtx-step__sr` | Textos. |
| `mtx-step-connector`, `mtx-step-connector__line` | StepConnector. |
| `mtx-step__content`, `mtx-step__content-inner` | StepContent plegable. |
| `mtx-mobile-stepper`, `--{dots,text,progress}`, `--{static,bottom,top}`, `__back`, `__next`, `__indicator`, `__dot`, `__dot--active`, `__progress`, `__status` | MobileStepper. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-stepper-connector-color` | Conector y borde del StepContent (gris 400 en claro, gris 600 en oscuro). |
| `--mtx-stepper-icon-size` | Tamaño del StepIcon (24px). |
| `--mtx-color-primary`, `--mtx-color-primary-contrast` | Icono activo/completado, conector activo y número. |
| `--mtx-color-error` | Paso con error. |
| `--mtx-z-index-mobile-stepper` | MobileStepper fijo. |

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `<ol data-mtx="stepper">` + `<li data-label>` | `<Stepper steps={[…]} />` o `<Stepper>` + `<Step label>` |
| `data-active-step` | `activeStep` / `defaultActiveStep` |
| `data-orientation` · `data-alternative-label` · `data-non-linear` | `orientation` · `alternativeLabel` · `nonLinear` |
| `data-label` (en el `<ol>`) | `label` |
| `data-optional` · `data-completed` · `data-error` · `data-disabled` · `data-icon` · `data-expanded` | `optional` · `completed` · `error` · `disabled` · `icon` · `expanded` |
| `data-panel` · `data-finished-panel` | `<StepPanel index={i}>` · `<StepPanel index="finished">` |
| `data-mtx-stepper-action` · `data-target` · `data-keep-enabled` | `<StepperButton action>` · `stepper` · `keepEnabled` |
| `mtx:stepper:change` (cancelable) | `onChange` (devolver `false` o `preventDefault()`) |
| `Materix.getInstance(el).next()` … | `apiRef.current.next()` … |
| `refresh()` | no hace falta (los pasos se renderizan desde las props) |
| `data-mtx="mobile-stepper"` · `data-steps` · `data-variant` · `data-position` · `data-back-label` | `<MobileStepper steps variant position backLabel />` |
| `setSteps(count)` | prop `steps` |

## Accesibilidad

- Se usa un `<ol>` semántico: el orden de los pasos forma parte del significado. Nómbralo con `label` o `aria-label`.
- El paso activo lleva `aria-current="step"` (en el `<li>`, o en su `<button>` en modo no lineal).
- Cada paso incluye texto oculto con su posición y estado: "Paso 2 de 3: Envío, completado". Iconos y conectores son decorativos (`aria-hidden`). Los textos se traducen con el idioma del `I18nProvider` o la prop `locale`.
- En modo no lineal los pasos son `<button>` nativos con foco visible; los deshabilitados usan `disabled`.
- En vertical, el contenido de los pasos plegados se marca `inert` y `aria-hidden` para que no reciba foco.
- MobileStepper anuncia el paso actual en una región `aria-live="polite"`; los puntos y la barra son decorativos.
- Respeta `prefers-reduced-motion`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre los pasos clicables (no lineal) y los botones Atrás/Siguiente. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa el paso o botón enfocado. |
