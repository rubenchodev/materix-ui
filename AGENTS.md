# AGENTS.md — Materix UI

Este documento resume las decisiones de producto, diseño y arquitectura de **Materix UI**, para que cualquier IA o desarrollador pueda continuar el proyecto sin perder contexto.

El documento es **accionable**: las reglas aquí descritas deben aplicarse al código, componentes, ejemplos y documentación del proyecto.

---

## 1. Qué es el proyecto

**Materix UI** es una librería **CSS + JavaScript vanilla**, sin frameworks, que implementa componentes siguiendo los principios y patrones de **Material UI (MUI)**, que a su vez se inspira en **Material Design 2 de Google**.

El patrón de uso está inspirado en Bootstrap clásico:

* HTML declarativo mediante atributos `data-*`.
* Componentes que se auto-inicializan.
* JavaScript opcional para uso programático.
* CSS basado en clases y design tokens.
* Sin Web Components ni Shadow DOM.
* Accesibilidad integrada desde el diseño de cada componente.

El objetivo es proporcionar una experiencia similar a:

```html
<button
  class="mtx-button mtx-button--contained"
  data-mtx="button"
>
  Guardar
</button>
```

sin que el consumidor tenga que escribir JavaScript para los casos habituales.

También debe ser posible utilizar los componentes programáticamente:

```javascript
const button = new Materix.Button(element);
```

---

## 2. Principio de diseño: Material UI (MUI)

**Material UI (MUI) es la referencia principal de diseño de Materix UI.** MUI implementa Material Design 2 de Google; por tanto, la referencia visual y conceptual es la estética MUI: forma de `4px`, tipografía Roboto, mayúsculas en botones, paleta MUI y sombras MUI.

No se debe implementar una interpretación arbitraria de Material Design ni reutilizar patrones de Material Design 3 (como color roles, contenedores de superficie, botones tipo píldora o variantes tonal/elevated) cuando exista un equivalente en MUI.

Los componentes deben considerar, cuando corresponda:

* Paleta (primary, secondary, error, warning, info, success).
* Typography.
* Shape (radio de 4px por defecto).
* Elevation (sombras MUI).
* State layers / action states.
* Interaction states.
* Focus states.
* Motion.
* Accessibility.
* Responsive behavior.
* Component anatomy.
* Component variants.
* Disabled states.
* Hover states.
* Focused states.
* Pressed states.
* Selected states.
* Error states.
* Read-only states.
* Loading states cuando corresponda.

### Regla importante

Si existe una decisión entre:

1. una implementación visual personalizada, o
2. el patrón establecido por MUI,

se debe priorizar **MUI**, salvo que exista una razón técnica explícita para desviarse.

### 2.1 Estándares Geométricos e Iconografía Canónica (MUI / MD2)

1. **Alturas Estandarizadas Compartidas:**
   * **TextField / Select / Autocomplete:** `56px` (Medium/Default) y `40px` (Small/Dense).
   * **Button:** `48px` (Large), `40px` (Medium/Default — alinea 1:1 con TextField small) y `32px` (Small).
   * **IconButton:** `48px` (Large), `40px` (Medium) y `32px` (Small).
   * **FAB:** `56px` (Normal), `40px` (Small/Mini) y `48px` (Extended).

2. **Regla Estricta para `.material-icons` y `.material-symbols-*`:**
   * **NUNCA** forzar `font-size: 18px`, `20px`, `22px` ni dimensiones no canónicas sobre la clase `.material-icons` o sus variantes tipográficas.
   * La tipografía de iconos de Google se basa en una cuadrícula nativa de **24px**. Forzar tamaños arbitrarios provoca pixelado y renderizado borroso.
   * Permitir siempre que `.material-icons` mantenga su tamaño de 24px con `display: inline-flex; align-items: center; justify-content: center; line-height: 1;`.
   * Para SVGs puros: `width: 24px; height: 24px; fill: currentColor; display: block;` (o `1em` relativo a la tipografía).

3. **Centrado Vertical y Alineación Horizontal:**
   * Centrar iconos siempre con flexbox (`align-self: center; align-items: center;`) sin márgenes manuales tipo `margin-top`.
   * En campos de texto con icono inicial (`start-icon`), el label debe trasladarse exactamente a `translate(32px, ...)` para que la primera letra del label coincida horizontalmente al milímetro con el texto del input (`differenceHorizontal = 0px`).

---

## 3. Decisiones de arquitectura

### 3.1 No usar Web Components

No utilizar:

* Custom Elements.
* Shadow DOM.
* Web Components como arquitectura principal.

La arquitectura debe mantenerse similar a Bootstrap:

```text
HTML
  ↓
CSS classes
  ↓
data-mtx attributes
  ↓
Materix JavaScript
  ↓
DOM
```

Esto permite que Materix UI pueda integrarse fácilmente en:

* HTML tradicional.
* PHP.
* Laravel.
* Django.
* Rails.
* ASP.NET.
* WordPress.
* Vite.
* aplicaciones vanilla.
* otros frameworks sin crear una dependencia directa.

---

## 4. Prefijo obligatorio

Todo lo que pertenezca a Materix UI debe utilizar el prefijo `mtx-`.

### CSS

```text
mtx-button
mtx-button--contained
mtx-card
mtx-text-field
```

### Data attributes

```html
data-mtx="button"
data-mtx="dialog"
data-mtx="text-field"
```

### Variables CSS

```css
--mtx-color-primary
--mtx-color-background-paper
--mtx-color-text-primary
```

El prefijo evita conflictos con el proyecto que consume la librería.

---

## 5. Inicialización automática

Debe existir un registro central de componentes:

```text
src/core/registry.js
```

Este registro debe:

* Registrar componentes.
* Inicializar componentes.
* Evitar inicializaciones duplicadas.
* Obtener instancias existentes.
* Permitir inicializar un contenedor específico.

API mínima:

```javascript
registerComponent(name, ComponentClass);
initAll(root);
getInstance(element);
```

Al cargar el DOM, Materix debe detectar elementos como:

```html
<button data-mtx="button">
  Guardar
</button>
```

y crear automáticamente la instancia correspondiente.

La inicialización debe ser **idempotente**.

Esto significa que ejecutar:

```javascript
initAll();
initAll();
```

no debe crear dos instancias del mismo componente.

También debe ser posible:

```javascript
initAll(container);
```

para contenido dinámico o aplicaciones SPA.

---

## 6. Dos formas de uso obligatorias

Todo componente debe soportar dos formas de uso.

### 6.1 Declarativa

Primera opción recomendada:

```html
<button
  class="mtx-button mtx-button--contained"
  data-mtx="button"
>
  Guardar
</button>
```

### 6.2 Programática

También debe existir una API JavaScript:

```javascript
const button = new Materix.Button(element);
```

Cuando sea necesario, los componentes pueden exponer métodos públicos.

Ejemplo:

```javascript
button.disable();
button.enable();
```

La API debe mantenerse pequeña y predecible.

### 6.3 Patrón Obligatorio: Sintaxis Simplificada (Single-Element / Auto-Scaffolding)

**Regla de Ergonomía:** Para evitar que el desarrollador tenga que escribir bloques verbosos de HTML con múltiples capas anidadas (wrappers, labels, svgs, contenedores internos), **todo componente compuesto debe soportar inicializarse declarativamente desde un único elemento semántico directo**, auto-construyendo su estructura interna en el DOM de forma transparente e idempotente.

#### Principio: La sintaxis extendida BEM y la sintaxis simplificada deben coexistir

1. **Sintaxis Simplificada (Recomendada para el consumidor):**
   El usuario escribe únicamente el elemento esencial con atributos `data-*`:
   * **TextField:** `<input data-mtx="text-field" data-label="Nombre" data-variant="outlined" type="text" />`
   * **Select:** `<select data-mtx="select" data-label="País"><option value="1">Colombia</option></select>`
   * **Checkbox / Switch / Radio:** `<input type="checkbox" data-mtx="checkbox" data-label="Acepto términos" />`
   * **Alert:** `<div data-mtx="alert" data-severity="success" data-title="Éxito">Guardado</div>`
   * **Chip:** `<div data-mtx="chip" data-label="React" data-icon="code" data-deletable="true"></div>`
   * **Badge:** `<div data-mtx="badge" data-content="4"><span class="material-icons">mail</span></div>`

2. **Auto-construcción en JavaScript:**
   El constructor del componente inspecciona el elemento. Si es un elemento directo (ej. un `<input>` o `<select>` sin su wrapper `.mtx-text-field`), el componente envuelve el elemento en su contenedor (`.mtx-text-field__container`), genera el `<label>`, genera la muesca de borde `<fieldset>` (si es outlined), inyecta los iconos correspondientes y preserva todos los atributos originales (`id`, `name`, `value`, `required`, `disabled`, etc.).
   * **REGLA CRÍTICA PARA ATRIBUTOS `class`**: Al transferir clases desde el elemento raíz al wrapper generado (por ejemplo, al mover modificadores BEM como `mtx-checkbox--small`), **NUNCA** se debe utilizar `wrapper.setAttribute('class', ...)` ya que esto destruiría la clase estructural base del wrapper (`mtx-checkbox`). En su lugar, se **DEBE CONCATENAR** utilizando `wrapper.className += ' ' + attr.value;`.

3. **Sintaxis Completa BEM (Para SSR o control manual fino):**
   Si el HTML ya viene con la estructura BEM completa pre-renderizada, el componente no duplica elementos y se vincula directamente a los nodos existentes.

---

# 7. Design Tokens

Los valores visuales globales deben estar centralizados en:

```text
src/styles/tokens.css
```

Los componentes **no deben definir directamente valores globales repetidos** cuando estos puedan representarse mediante tokens.

Ejemplo:

```css
.mtx-button {
  background: var(--mtx-color-primary);
  color: var(--mtx-color-primary-contrast);
}
```

en lugar de:

```css
.mtx-button {
  background: #6750a4;
  color: white;
}
```

Esto permite cambiar el tema completo sin modificar cada componente.

---

## 8. Tokens basados en MUI

La nomenclatura de tokens debe seguir la paleta de **Material UI (MUI)**: cada color de la paleta (primary, secondary, error, warning, info, success) con sus variantes `-light`, `-dark` y `-contrast` (texto sobre el color), además de tokens de texto, fondo, divisores y estados.

Ejemplos:

```css
:root {
  --mtx-color-primary: ...;
  --mtx-color-primary-light: ...;
  --mtx-color-primary-dark: ...;
  --mtx-color-primary-contrast: ...;

  --mtx-color-secondary: ...;
  --mtx-color-secondary-light: ...;
  --mtx-color-secondary-dark: ...;
  --mtx-color-secondary-contrast: ...;

  --mtx-color-error: ...;
  --mtx-color-warning: ...;
  --mtx-color-info: ...;
  --mtx-color-success: ...;

  --mtx-color-text-primary: ...;
  --mtx-color-text-secondary: ...;
  --mtx-color-text-disabled: ...;

  --mtx-color-background-default: ...;
  --mtx-color-background-paper: ...;
  --mtx-color-divider: ...;

  --mtx-color-action-active: ...;
  --mtx-color-action-hover: ...;
  --mtx-color-action-focus: ...;
  --mtx-color-action-disabled: ...;
  --mtx-color-action-disabled-background: ...;
}
```

No se debe asumir que `primary-light` y `primary-dark` son suficientes para representar la paleta MUI.

Cuando corresponda, también se deben crear tokens para:

* Typography.
* Border radius / shape.
* Elevation.
* Spacing.
* Motion.
* State layers.
* Focus.
* Disabled opacity.

---

## 9. Temas

Materix UI debe estar preparado para soportar diferentes temas.

Como mínimo debe contemplarse:

```text
Light
Dark
```

El cambio de tema debe poder realizarse modificando tokens y no reescribiendo los componentes.

Ejemplo conceptual:

```css
:root {
  --mtx-color-primary: ...;
  --mtx-color-background-paper: ...;
}

[data-mtx-theme="dark"] {
  --mtx-color-primary: ...;
  --mtx-color-background-paper: ...;
}
```

Los componentes deben consumir los tokens y no conocer directamente los valores concretos del tema.

---

# 10. Estructura de carpetas

La estructura oficial del proyecto es:

```text
materix-ui/
├── src/
│   ├── core/
│   │   └── registry.js
│   │
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.css
│   │   │   └── button.js
│   │   ├── card/
│   │   ├── text-field/
│   │   ├── checkbox/
│   │   ├── switch/
│   │   └── ...
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   └── base.css
│   │
│   ├── i18n/                  # diccionarios de textos de componentes (index.js + locales/)
│   │
│   └── index.js
│
├── examples/
│   ├── index.html
│   ├── button/
│   │   └── index.html
│   ├── card/
│   │   └── index.html
│   ├── text-field/
│   │   └── index.html
│   ├── checkbox/
│   │   └── index.html
│   ├── switch/
│   │   └── index.html
│   └── ...
│
├── templates/                 # 12 plantillas de página completa (en inglés)
│   ├── shared/template.js
│   └── {slug}/index.html
│
├── docs/                      # Hugo bilingüe: inglés por defecto en /, español en /es/
│   ├── hugo.toml
│   ├── i18n/{en,es}.yaml      # textos de la interfaz del sitio
│   ├── data/templates.yaml    # galería de plantillas
│   └── content/
│       ├── _index.{en,es}.md
│       ├── guide/{slug}.{en,es}.md
│       ├── templates/_index.{en,es}.md
│       └── components/
│           ├── _index.{en,es}.md
│           ├── button.en.md
│           ├── button.es.md
│           └── ...
│
├── tests/                     # pruebas unitarias Vitest + jsdom (*.test.js, setup.js)
│   └── e2e/                   # pruebas Playwright: smoke, interacción, visuales y a11y
│
├── types/                     # declaraciones TypeScript (index/core/events.d.ts a mano; lib/ y components/ generados)
├── scripts/                   # generadores: gen-utilities.mjs (utilities.css) y gen-types.mjs (types/)
├── dist/
├── vite.config.js
├── vite.modules.config.js
└── package.json
```

---

# 11. Carpeta `/examples`

La carpeta:

```text
/examples
```

es **obligatoria**.

Los ejemplos no deben estar dispersos en la raíz del proyecto ni mezclados con la documentación de Hugo.

Cada componente debe tener un ejemplo funcional dentro de `/examples`.

Por ejemplo:

```text
/examples/button/index.html
/examples/card/index.html
/examples/text-field/index.html
```

Los ejemplos deben consumir la librería real y no una implementación paralela.

La intención es poder abrir o ejecutar los ejemplos y comprobar el comportamiento real del componente.

---

## 12. Reglas para los ejemplos

Cada componente nuevo o modificado debe incluir ejemplos completos y exhaustivos que permitan comprobar:

1. **Prioridad a la Sintaxis Simplificada (Single-Element):**
   * La primera sección del ejemplo debe ser obligatoriamente la demostración de la **Sintaxis Simplificada de Una Sola Línea** (`data-mtx`, `data-label`, `data-variant`, `data-start-icon`), demostrando al usuario la forma más limpia y ergonómica de uso.
   * **CRÍTICO:** Además, **todo el resto de las secciones de ejemplos** (colores, tamaños, deshabilitado, etc.) **debe construirse utilizando esta misma sintaxis simplificada**. El "Uso manual BEM" debe aislarse **únicamente** en una sección separada para demostrar casos avanzados, y no debe ser la norma para el resto del archivo HTML.
2. **Secciones Explícitas para Todos los Tamaños:**
   * Si el componente maneja múltiples tamaños (por ejemplo Large 48px, Medium 40px, Small 32px en Button/TextField/IconButton/FAB), el archivo de ejemplo **debe incluir secciones visuales diferenciadas para cada tamaño**, mostrando cómo alinea con otros componentes en la misma fila.
3. **Secciones Con y Sin Iconos:**
   * Debe haber bloques específicos mostrando:
     * Componente sin icono.
     * Componente con icono inicial (`data-start-icon` / start-icon).
     * Componente con icono final (`data-end-icon` / end-icon).
     * Componente de solo icono (icon button / fab).
4. **Todas las Variantes Visuales:**
   * Secciones separadas para cada variante (ej. `outlined`, `filled`, `standard`, `contained`, `text`).
5. **Estados Interactivos Completos:**
   * Normal, hover, focus-visible, active / pressed, disabled, error con helper text, read-only.
6. **Maquetación en Grilla:**
   * Demostración de adaptación dentro del sistema de grilla `mtx-grid`.
7. **Tema Claro y Tema Oscuro:**
   * Debe incorporar el script selector de tema (`../shared/theme.js`) y verificar ambos modos.

No se debe considerar terminado un componente si únicamente existe su archivo CSS/JS sin un ejemplo con todas estas secciones.

---

# 13. Ejemplos como herramienta de validación

Los ejemplos funcionan como **manual visual de regresión**.

Cuando se agregue o modifique un componente:

1. Actualizar el código fuente del componente (`.js` y `.css`).
2. Actualizar inmediatamente su ejemplo en `/examples/{nombre}/index.html`.
3. Actualizar inmediatamente su documentación en **ambos idiomas**: `/docs/content/components/{nombre}.en.md` y `{nombre}.es.md` (misma estructura de secciones; `group` con clave neutra: layout, inputs, data-display, feedback, surfaces, navigation).
4. Comprobar todas las variantes y todos los tamaños.
5. Comprobar casos con y sin icono.
6. Comprobar tema claro y oscuro.
7. Comprobar interacción y accesibilidad.
8. Recompilar la librería (`npm run build`) y validar que `npm test` pase al 100%.

Si una modificación rompe un ejemplo existente o deja la documentación desfasada, el cambio **no debe considerarse terminado**.

---

# 14. Documentación

La documentación se construye utilizando **Hugo**.

Ubicación:

```text
/docs
```

Cada componente debe tener su documentación:

```text
docs/content/components/{nombre}.en.md   # inglés (idioma por defecto)
docs/content/components/{nombre}.es.md   # español
```

La documentación debe explicar como mínimo:

* **Sintaxis Simplificada de Una Sola Línea:** Destacada como la primera y principal forma de uso recomendada.
* **Qué hace el componente y anatomía.**
* **Demostraciones exhaustivas:** Ejemplos interactivos `{{< mtx-demo >}}` mostrando todos los tamaños (Large, Medium, Small), variantes (Outlined, Filled, Standard) y combinaciones con y sin iconos.
* **Uso declarativo vs uso programático.**
* **Variantes y tamaños disponibles.**
* **Estados y validaciones de error.**
* **Clases BEM disponibles y atributos `data-*`.**
* **Eventos y API pública en JavaScript.**
* **Accesibilidad (ARIA, navegación de teclado y foco).**

Los ejemplos de la documentación deben reflejar exactamente la misma ergonomía limpia y sintaxis simplificada presente en `/examples`.

---

# 15. Componente de referencia

`Button` + `Ripple` es el componente inicial de referencia.

Debe utilizarse como guía para implementar los demás componentes, pero **no se deben copiar decisiones visuales antiguas que entren en conflicto con MUI**.

Cada componente nuevo debe seguir esta estructura:

```text
src/components/{nombre}/
├── {nombre}.js
└── {nombre}.css
```

### JavaScript

Debe:

* Recibir el elemento en el constructor.
* Gestionar interacción.
* Exponer una API programática cuando corresponda.
* Registrarse mediante `registerComponent()`.
* Evitar efectos secundarios innecesarios.
* Mantener la lógica separada de la presentación.

### CSS

Debe:

* Utilizar exclusivamente tokens cuando sea posible.
* Utilizar el prefijo `mtx-`.
* Implementar las variantes del componente.
* Implementar estados.
* Seguir la estética MUI.
* Considerar responsive behavior.
* Considerar accesibilidad visual.

---

# 16. JSDoc

Todo código público debe estar documentado con **JSDoc en español**.

Los comentarios deben ser:

* Breves.
* Claros.
* Útiles.
* Orientados al propósito.

Evitar comentarios excesivamente largos.

Ejemplo:

```javascript
/**
 * Representa un botón de Materix UI.
 */
export class Button {
  /**
   * Crea una instancia del botón.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    this.element = element;
  }
}
```

No escribir comentarios que simplemente repitan el código.

---

# 17. Accesibilidad

La accesibilidad no es una fase posterior.

Cada componente debe implementarse teniendo en cuenta desde el inicio:

* Semántica HTML correcta.
* ARIA únicamente cuando sea necesario.
* Navegación mediante teclado.
* Focus visible.
* Contraste.
* Estados accesibles.
* Screen readers.
* `disabled` cuando corresponda.
* `aria-expanded`.
* `aria-selected`.
* `aria-checked`.
* `aria-invalid`.
* `aria-describedby`.

No utilizar ARIA para sustituir elementos HTML semánticos cuando estos ya proporcionan la funcionalidad necesaria.

Por ejemplo, preferir:

```html
<button>
```

antes que:

```html
<div role="button">
```

cuando sea posible.

---

# 18. Motion y estados de interacción

Los componentes deben implementar los estados de interacción de MUI cuando sean aplicables.

Por ejemplo:

```text
Enabled
Hovered
Focused
Pressed
Dragged
Disabled
Selected
```

Los efectos visuales deben implementarse utilizando los tokens correspondientes.

El efecto ripple debe considerarse parte del sistema de interacción cuando sea apropiado, pero no debe forzarse en componentes donde MUI no lo requiera.

También debe respetarse:

```css
@media (prefers-reduced-motion: reduce) {
  ...
}
```

para usuarios que soliciten reducir las animaciones.

---

# 19. Build

Vite se utiliza como bundler en modo librería.

`npm run build` ejecuta `vite build` (bundle completo, `vite.config.js`), `vite build -c vite.modules.config.js` (módulos por componente, sin vaciar `dist/`) y `node scripts/gen-types.mjs` (declaraciones en `types/lib/` y `types/components/`).

La compilación genera:

```text
dist/
├── materix.es.js              # bundle ES completo
├── materix.umd.js             # bundle UMD (global Materix)
├── materix.umd.cjs            # copia del UMD para require()
├── materix.min.css            # todos los estilos
├── core.js                    # registry, ComponentBase, eventos, tema, i18n, posicionamiento
├── base.css                   # tokens + base + ripple
├── utilities.css              # utilidades CSS
├── components/
│   ├── {slug}.js              # módulo ES autoinicializable; importa los .css que necesita
│   ├── {slug}.css             # estilos propios del componente
│   └── {slug}.bundle.css      # componente + dependencias (para <link> sin bundler)
└── chunks/                    # código compartido (núcleo emitido una sola vez)
```

La carpeta `/dist` es generada automáticamente.

**No editar manualmente archivos dentro de `/dist`.**

Los cambios siempre deben realizarse en `/src`.

---

# 20. Reglas para nuevos componentes

Cuando se solicite implementar un nuevo componente, se debe realizar **todo el trabajo necesario**, no solamente crear el archivo principal.

Como mínimo:

* [ ] Crear `src/components/{nombre}/`.
* [ ] Crear `{nombre}.js`.
* [ ] Crear `{nombre}.css`.
* [ ] Registrar el componente.
* [ ] Importarlo desde `src/index.js`.
* [ ] Implementar variantes.
* [ ] Implementar estados.
* [ ] Implementar accesibilidad.
* [ ] Utilizar design tokens.
* [ ] Crear `/examples/{nombre}/index.html`.
* [ ] Crear documentación en `/docs/content/components/{nombre}.en.md` y `{nombre}.es.md`.
* [ ] Incluir uso declarativo.
* [ ] Incluir uso programático cuando corresponda.
* [ ] Verificar tema claro.
* [ ] Verificar tema oscuro cuando esté disponible.
* [ ] Verificar responsive behavior.
* [ ] Verificar interacción.
* [ ] Verificar que no existan conflictos con otros componentes.

Un componente no se considera completo hasta que todas estas partes estén implementadas.

---

# 21. No crear soluciones incompletas

Cuando una tarea solicite implementar un componente o funcionalidad, no limitarse a crear un mockup visual.

Debe existir una implementación funcional.

Por ejemplo, para un `Dialog` no basta con:

```html
<div class="mtx-dialog">
```

Debe existir:

* CSS.
* JavaScript.
* Registro.
* Apertura.
* Cierre.
* Estados.
* Focus management.
* Teclado.
* Accesibilidad.
* Ejemplo.
* Documentación.

---

# 22. Roadmap

* [x] Definir nombre y naming convention.
* [x] Definir arquitectura CSS + JS vanilla.
* [x] Definir prefijo `mtx-`.
* [x] Definir inicialización declarativa.
* [x] Crear estructura base del proyecto.
* [x] Configurar Vite.
* [x] Crear componente inicial Button + Ripple.
* [x] Adaptar los design tokens a la estética MUI.
* [x] Implementar tema Light.
* [x] Implementar tema Dark.
* [x] Reset: mantener únicamente el componente `Button`.
* [x] Construir `TextField` con las variaciones de MUI (outlined/filled/standard, small, margins, multiline, select, adornments, hidden label, colores).
* [x] Construir componentes adicionales siguiendo MUI (Accordion, Breadcrumbs, Pagination, Stepper, Progress, ToggleButton, Rating, Container, Stack).
* [x] Sistema de utilidades CSS y documentación bilingüe (inglés por defecto).
* [x] 12 plantillas de página completa en `/templates` construidas con piezas de la librería.
* [x] Construir `Paper`, `Divider` e `IconButton` siguiendo MUI.
* [x] Construir `Card`, `Checkbox`, `Switch`, `Dialog` y `Select` (nativo extendido con búsqueda y selección múltiple) siguiendo MUI.
* [x] Reescribir `Select` y crear `Chip`, `NativeSelect`, `Radio`, `Menu`, `MenuItem`, `List`, `Typography`, `Link`, `Avatar`, `Badge`, `Alert`, `Snackbar`, `Tabs`, `Drawer` y `Table` siguiendo MUI.
* [x] Crear `/examples/button`.
* [x] Completar documentación Hugo de `Button`.
* [x] Resolver accesibilidad de `Button`.
* [x] Definir estrategia de versionado SemVer.
* [x] Definir estrategia de publicación en npm.
* [x] Evaluar `MutationObserver` opcional para contenido dinámico.
* [x] Crear pruebas automatizadas para componentes críticos.

---

# 23. Restricciones y preferencias

Estas reglas son obligatorias salvo que una tarea indique explícitamente lo contrario.

### Tecnología

* Vanilla JavaScript.
* CSS estándar.
* No React.
* No Vue.
* No Angular.
* No Web Components.
* No Shadow DOM.
* Vite como bundler.
* Hugo para documentación.

### Arquitectura

* Prefijo `mtx-`.
* `data-mtx` para inicialización declarativa.
* Registro central de componentes.
* API programática disponible.
* Inicialización idempotente.
* Design tokens centralizados.
* Ciclo de vida: todo listener en `document`/`window`/elementos externos se registra con `this.listen()` (o `this.onDestroy()` para observers/timers/nodos portados) y `destroy()` llama a `super.destroy()`.
* Eventos con la forma `mtx:{componente}:{acción}` emitidos con `emit()` de `src/core/events.js`; los nombres antiguos solo como alias deprecados.
* Ids generados con `uniqueId()` de `src/core/id.js`; posicionamiento flotante con `src/core/position.js`.

### Diseño

* Material UI (MUI) / Material Design 2 como referencia principal.
* No introducir patrones visuales arbitrarios.
* Priorizar los componentes y patrones establecidos por MUI.
* Soportar estados de interacción.
* Considerar Light/Dark themes.
* Accesibilidad desde el comienzo.

### Código

* JSDoc en español.
* Comentarios breves.
* Código modular.
* Evitar duplicación.
* No editar `/dist` manualmente.

### Ejemplos

* Todo componente debe tener un ejemplo en `/examples`.
* Los ejemplos deben ser funcionales.
* Los ejemplos deben utilizar la implementación real.
* Los ejemplos deben cubrir variantes y estados importantes.
* `/examples` es parte del desarrollo y no un contenido opcional.

### Documentación

* Hugo.
* Documentación por componente.
* La documentación debe mantenerse sincronizada con la implementación.
* No considerar terminado un componente sin documentación y ejemplo.
* Bilingüe: inglés por defecto (`{slug}.en.md`) y español (`{slug}.es.md`), con la misma estructura.

### Plantillas (`/templates`) y framework completo

* Las plantillas se construyen **solo con piezas de la librería**: componentes, Container/Stack/Grid y utilidades `mtx-*`.
* El `<style>` de una plantilla solo puede contener lo propio del diseño (marca, gráficos, ilustraciones, gradientes decorativos). Nada de layout, espaciado, tipografía ni parches de bugs.
* Si una plantilla necesita algo que la librería no ofrece, **se añade a la librería** (componente, modificador o utilidad, con su ciclo completo) en lugar de resolverlo con CSS propio.
* Sin `style=""` inline y con los breakpoints canónicos (600/900/1200/1536).

---

# 24. Regla principal para cualquier IA

Antes de implementar cualquier cambio en Materix UI, comprobar:

1. ¿Sigue la arquitectura vanilla?
2. ¿Utiliza el prefijo `mtx-`?
3. ¿Utiliza `data-mtx` cuando corresponde?
4. ¿Sigue la estética MUI?
5. ¿Utiliza design tokens?
6. ¿Tiene accesibilidad?
7. ¿Tiene estados de interacción?
8. ¿Tiene soporte para tema?
9. ¿Existe un ejemplo funcional en `/examples`?
10. ¿Existe documentación en `/docs`?
11. ¿La implementación es reutilizable?
12. ¿Se mantiene compatible con la arquitectura existente?

Si alguna respuesta es **no**, el trabajo debe completarse antes de considerar la tarea terminada.

**La prioridad del proyecto es:**

> **Material UI (MUI) + accesibilidad + simplicidad + vanilla JavaScript + ejemplos funcionales + documentación consistente.**

---

# 25. Checklist Oficial de Estado de Componentes y Regla de Alcance

### ⚠️ Regla Estricta de Alcance para Tareas Generales
Cuando el usuario o una instrucción solicite una tarea "general" o "global" (por ejemplo: *"actualizar los ejemplos en `/examples`"*, *"completar documentación"*, *"revisar accesibilidad"*, *"agregar pruebas"*, *"refactorizar a sintaxis simplificada"*, etc.):
* **DEBE aplicarse ÚNICAMENTE sobre los componentes que figuren como finalizados (`[x]`) en este checklist.**
* **NO se deben modificar en bloque ni crear ejemplos masivos de componentes pendientes (`[ ]`)** sin la aprobación o solicitud explícita del usuario para ese componente específico.
* Los componentes pendientes (`[ ]`) se abordarán uno a uno de forma meticulosa, pasando a `[x]` únicamente cuando cumplan el ciclo completo: JS, CSS, single-element scaffolding, accesibilidad, pruebas unitarias, ejemplo exhaustivo en `/examples/{nombre}/index.html` y documentación en `/docs`.

### Checklist de Estado de Componentes

* [x] **Button** (Finalizado — CSS, JS, Ripple, variantes, tamaños canónicos, single-element, accesibilidad, tests, `/examples/button`, `/docs`)
* [x] **Grid** (Finalizado — CSS, JS, auto-layout, spacing 0-12, breakpoints xs-xl, tests, `/examples/grid`, `/docs`)
* [x] **Alert** (Finalizado — CSS, JS, Alert y AlertTitle, severidades success/info/warning/error, variantes standard/filled/outlined, dismissible, single-element con auto-scaffolding, tests, `/examples/alert`, `/docs`)
* [x] **AppBar** (Finalizado — AppBar / Toolbar / CSS, JS, fixed/static/sticky, elevación dinámica, hide/elevate on scroll, responsive toolbar, auto-scaffolding, tests, `/examples/app-bar`, `/docs`)
* [x] **Avatar** (Finalizado — CSS, JS, Avatar / AvatarGroup, tamaños canónicos 24/40/56px, variantes circular/rounded/square, fallback automático por error o iniciales, single-element, tests, `/examples/avatar`, `/docs`)
* [x] **Badge** (Finalizado — CSS, JS, variantes standard y dot, anclajes top-right/top-left/bottom-right/bottom-left, overlap circular, límite data-max y data-show-zero, single-element, tests, `/examples/badge`, `/docs`)
* [x] **Card** (Finalizado — Card / CardActionArea con ripple y foco / CardHeader / CardMedia / CardContent / CardActions, elevaciones 0-24, interactiva/clickable, single-element, tests, `/examples/card`, `/docs`)
* [x] **Checkbox** (Finalizado — CSS, JS, variantes, sizes, tests, `/examples/checkbox`, `/docs`)
* [x] **Chip** (Finalizado — CSS, JS, variantes filled/outlined, tamaños medium 32px y small 24px, deletable con teclado Delete/Backspace, clickable, iconos, colores, single-element, tests, `/examples/chip`, `/docs`)
* [x] **CssBaseline** (Finalizado — CSS, JS, reset tipográfico global, box-sizing, color scheme claro/oscuro, tests, `/examples/css-baseline`, `/docs`)
* [x] **Dialog** (Finalizado — Dialog / DialogTitle / DialogContent / DialogActions, scroll paper/body, focus trapping, escape y backdrop click, single-element con auto-scaffolding, tests, `/examples/dialog`, `/docs`)
* [x] **Divider** (Finalizado — CSS, JS, orientaciones horizontal/vertical, variantes middle/inset, con texto y alineación left/center/right, flex-item, single-element, tests, `/examples/divider`, `/docs`)
* [x] **Drawer** (Finalizado — CSS, JS, variantes temporary/persistent/permanent, anclas left/right/top/bottom, anchos canónicos, patrón clipped bajo AppBar, single-element con auto-scaffolding, accesibilidad ARIA completa, 21 tests, `/examples/drawer`, `/docs`)
* [x] **Fab** (Finalizado — CSS, JS, Ripple, variantes circular y extendida, tamaños normal 56px / mini 40px / extended 48px, colores, single-element, accesibilidad, tests, `/examples/fab`, `/docs`)
* [x] **IconButton** (Finalizado — CSS, JS, Ripple, tamaños 48/40/32, single-element, tests, `/examples/icon-button`, `/docs`)
* [x] **Link** (Finalizado — CSS, JS, single-element, colores, variaciones de subrayado, tests, `/examples/link`, `/docs`)
* [x] **List** (Finalizado — List / ListItem / ListItemButton con ripple y selección / ListItemIcon / ListItemText con primary y secondary / ListSubheader, densa, single-element con auto-scaffolding, tests, `/examples/list`, `/docs`)
* [x] **Menu** (Finalizado — Menu y MenuItem / CSS, JS, single-element, popper flotante con scroll dinámico, navegación de teclado, iconos, tests, `/examples/menu`, `/docs`)
* [x] **NativeSelect** (Finalizado — CSS, JS, variantes, labels flotantes, tests, `/examples/native-select`, `/docs`)
* [x] **Paper** (Finalizado — CSS, JS, elevaciones canónicas 0-24 con tokens MUI, variantes standard/outlined, square, single-element, tests, `/examples/paper`, `/docs`)
* [x] **Radio** (Finalizado — CSS, JS, RadioGroup, variants, sizes, tests, `/examples/radio`, `/docs`)
* [x] **Select** (Finalizado — CSS, JS, variantes, iconos, imágenes, multiselect, tests, `/examples/select`, `/docs`)
* [x] **Snackbar** (Finalizado — CSS, JS, anclajes top/bottom y left/center/right, auto-cierre con temporizador pausable en hover/focus, acción interactiva, Escape, single-element, tests, `/examples/snackbar`, `/docs`)
* [x] **SpeedDial** (Finalizado — CSS, JS, single-element, direcciones, tooltips en hover, eventos click/hover, tests, `/examples/speed-dial`, `/docs`)
* [x] **Switch** (Finalizado — CSS, JS, variantes, sizes, tests, `/examples/switch`, `/docs`)
* [x] **Table** (Finalizado — Table / TableContainer con sticky / TableHead / TableBody / TableFooter / TableRow seleccionable con hover / TableCell con alineación numérica y checkbox / TableSortLabel / TablePagination interactiva, auto-scaffolding completo sobre HTML semántico, tests, `/examples/table`, `/docs`)
* [x] **Tabs** (Finalizado — CSS, JS, single-element, alineación, full width, centered, vertical, tests, `/examples/tabs`, `/docs`)
* [x] **TextField** (Finalizado — CSS, JS, auto-scaffolding single-element, NotchedOutline canónico, start/end icons e imágenes, multiline, auto-resize condicional, contadores de caracteres y palabras con límites, motor de máscaras nativo pattern y currency, validación, tests, `/examples/text-field`, `/docs`)
* [x] **DateTimePicker** (Finalizado — patrón WAI-ARIA Date Picker Dialog con grid navegable por teclado, locale con región vía Intl, CSS, JS, soporte unificado para DatePicker, TimePicker y DateTimePicker, calendario mensual, selector de años, reloj radial interactivo MD2, popover, modal, modo estático, min/max, tests, `/examples/date-time-picker`, `/docs`)
* [x] **Typography** (Finalizado — CSS, JS, escala completa h1-h6, subtitle1/2, body1/2, button, caption, overline, colores de paleta, alineación y truncado no-wrap, auto-scaffolding desde etiquetas semánticas o atributos, tests, `/examples/typography`, `/docs`)
* [x] **Utilidades** (Finalizado — `src/styles/utilities.css` generado por `npm run gen:utilities` desde `scripts/gen-utilities.mjs`: display, flex, alineación, gap, spacing, tamaño, texto, color, accesibilidad, posición, overflow, bordes, elevación; responsive sm/md/lg/xl; tests, `/examples/utilities`, `/docs/content/guide/utilities.{en,es}.md`. No editar `utilities.css` a mano)
* [x] **Container** (Finalizado — max-width xs–xl/fluid, fixed, disable-gutters, single-element, tests, `/examples/container`, `/docs`)
* [x] **Stack** (Finalizado — dirección y spacing responsive, wrap, divider, single-element, tests, `/examples/stack`, `/docs`)
* [x] **Progress** (Finalizado — CircularProgress y LinearProgress: indeterminate/determinate/buffer/query, colores, etiqueta, helper `createCircularProgress`, Button `data-loading`, tests, `/examples/progress`, `/docs`)
* [x] **Accordion** (Finalizado — Accordion / AccordionGroup exclusivo / AccordionActions, desde `<div>` o `<details>` nativo, teclado WAI-ARIA, tests, `/examples/accordion`, `/docs`)
* [x] **Breadcrumbs** (Finalizado — separador texto/icono, colapso, `setItems()`, evento cancelable de navegación, tests, `/examples/breadcrumbs`, `/docs`)
* [x] **Pagination** (Finalizado — algoritmo usePagination de MUI, variantes, formas, tamaños, colores, modo enlaces, tests, `/examples/pagination`, `/docs`)
* [x] **Stepper** (Finalizado — Stepper horizontal/vertical, alternative label, no lineal, estados por paso, paneles, acciones declarativas, evento cancelable, MobileStepper, tests, `/examples/stepper`, `/docs`)
* [x] **ToggleButton** (Finalizado — ToggleButton standalone y ToggleButtonGroup exclusivo/múltiple, orientación, tamaños, colores, teclado, tests, `/examples/toggle-button`, `/docs`)
* [x] **Rating** (Finalizado — precisión fraccionaria, read-only, tamaños, iconos SVG escalables, radios nativos accesibles, tests, `/examples/rating`, `/docs`)
* [x] **FormHelperText** (Finalizado — `.mtx-form-helper-text`, `.mtx-form-control`, integrado en Checkbox/Switch/RadioGroup con `data-helper-text`/`data-error`, tests, documentado en `/docs/content/components/checkbox.{en,es}.md`)
* [x] **API de tema** (Finalizado — `Materix.theme` get/set/toggle/configure, `[data-mtx-theme-toggle]`, persistencia y `?theme=`, evento `mtx:theme-change`, tests, `/docs/content/guide/theming.{en,es}.md`)
* [x] **Slider** (Finalizado — basado en `<input type="range">`, rango con dos thumbs, marks, vertical, value label, teclado y arrastre, RTL, tests, `/examples/slider`, `/docs`)
* [x] **Tooltip** (Finalizado — atributo global `data-mtx-tooltip` sin inicialización, hover/foco/táctil, hoverable y Escape (WCAG 1.4.13), flecha, posicionamiento con `src/core/position.js`, tests, `/examples/tooltip`, `/docs`)
* [x] **Popover** (Finalizado — anclado a disparador, anchor/transform origin MUI, foco y retorno, modal opcional, tests, `/examples/popover`, `/docs`)
* [x] **Autocomplete** (Finalizado — combobox WAI-ARIA 1.2, filtrado, grupos, múltiple con chips, free solo, carga asíncrona, formularios, tests, `/examples/autocomplete`, `/docs`)
* [x] **Skeleton** (Finalizado — text/circular/rectangular/rounded, pulse/wave, regiones de carga con `Materix.skeleton`, tests, `/examples/skeleton`, `/docs`)
* [x] **ButtonGroup** (Finalizado — variantes, tamaños, colores, vertical, split button con Menu, tests, `/examples/button-group`, `/docs`)
* [x] **Backdrop** (Finalizado — capa con contenido, cierre por clic/Escape opcional, bloqueo de scroll e inert opcionales, tests, `/examples/backdrop`, `/docs`)

