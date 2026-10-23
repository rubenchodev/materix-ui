---
name: materix-component
description: >-
  Procedimiento estandarizado y especificación de diseño Material Design 2 (MUI) para crear,
  refactorizar y verificar componentes en Materix UI. Utiliza esta skill siempre que se solicite
  crear un nuevo componente, auditar o modificar componentes existentes (Button, TextField, Dialog, Card, etc.).
---

# Materix UI — Skill de Creación y Estandarización de Componentes

Esta skill define el flujo de trabajo estandarizado, las reglas de geometría visual de **Material UI (MUI / Material Design 2)** y los patrones arquitectónicos obligatorios para construir componentes de **Materix UI**.

---

## 1. Reglas Canónicas de Geometría Visual (MUI / MD2)

### 1.1 Alturas Estandarizadas Compartidas
Para garantizar que botones, selectores y campos de texto alineen perfectamente cuando se maquetan en la misma fila:

* **Campos de Texto y Selectores (`TextField`, `Select`, `Autocomplete`):**
  * `Medium / Por defecto`: **`56px`** (`--mtx-field-height-medium: 56px;`)
  * `Small / Compacto (Dense)`: **`40px`** (`--mtx-field-height-small: 40px;`)
* **Botones (`Button`):**
  * `Large`: **`48px`** (`--mtx-size-large-height: 48px;`)
  * `Medium / Por defecto`: **`40px`** (`--mtx-size-medium-height: 40px;` — alinea 1:1 con TextField small)
  * `Small`: **`32px`** (`--mtx-size-small-height: 32px;`)
* **Botones de Icono (`IconButton`):**
  * `Large`: **`48px`** (`min-width: 48px; min-height: 48px; padding: 12px;`)
  * `Medium`: **`40px`** (`min-width: 40px; min-height: 40px; padding: 8px;`)
  * `Small`: **`32px`** (`min-width: 32px; min-height: 32px; padding: 4px;`)
* **Botón Flotante (`FAB`):**
  * `Normal`: **`56px`** (`min-width: 56px; height: 56px; border-radius: 50%;`)
  * `Small / Mini`: **`40px`** (`min-width: 40px; height: 40px; border-radius: 50%;`)
  * `Extended`: **`48px`** (`height: 48px; padding: 0 16px; border-radius: 24px;`)

---

### 1.2 Regla Estricta para Iconografía (`.material-icons` y `.material-symbols-*`)

> [!CRITICAL]
> **NUNCA alterar el tamaño de fuente de `.material-icons` o `.material-symbols-*`:**
> * La fuente Google Material Icons está vectorizada en una **cuadrícula nativa de 24px**.
> * **PROHIBIDO:** Definir `font-size: 18px`, `font-size: 20px`, `font-size: 22px` o dimensiones forzadas en `.material-icons`, ya que obliga al navegador a interpolar fuera de la cuadrícula, resultando en iconos borrosos y pixelados.
> * **PERMITIDO:** Dejar que `.material-icons` renderice a su tamaño nativo de 24px (`line-height: 1; display: inline-flex; align-items: center; justify-content: center;`).
> * Si se usan iconos **SVG puros**, pueden escalar mediante `width: 24px; height: 24px; fill: currentColor; display: block;` (o `1em` relativo a la tipografía del botón).

---

### 1.3 Centrado Vertical y Alineación Horizontal de Precisión

1. **Centrado Vertical:**
   * Usar contenedores Flexbox (`display: inline-flex` o `display: flex`) con `align-items: center;` y elementos con `align-self: center;`.
   * **NUNCA** usar márgenes manuales tipo `margin-top: 14px` para "bajar" iconos; esto rompe la simetría vertical en diferentes resoluciones y tamaños.

2. **Alineación Horizontal de Label con Icono (TextField):**
   * Cuando un campo de texto con label flotante incluye un icono inicial (`start-icon`):
     $$\text{Offset inicio de texto} = \text{padding-left} (12\text{px}) + \text{ancho icono nativo} (24\text{px}) + \text{margin-right} (8\text{px}) = \mathbf{44\text{px}}$$
     $$\text{Traslación horizontal del label} = \text{Offset texto} (44\text{px}) - \text{label left base} (12\text{px}) = \mathbf{32\text{px}}$$
   * Tanto en reposo como flotando, el label debe tener `transform: translate(32px, ...)` para que la primera letra del label quede alineada verticalmente con el texto del input (`differenceHorizontal = 0px`).

---

## 2. Patrones de Arquitectura

1. **Vanilla JS + CSS puro:**
   * Sin React, Vue, Angular, Lit, Web Components ni Shadow DOM.
   * Prefijo obligatorio **`mtx-`** para clases, variables CSS (`--mtx-*`) y atributos `data-mtx`.

2. **Inicialización Idempotente:**
   * Toda clase JavaScript debe registrarse mediante `registerComponent('nombre', NombreClase)` en [src/core/registry.js](file:///d:/PERSONAL_FILES/PROJECTS/materix-ui/src/core/registry.js).
   * Al inicializar, debe marcar `data-mtx-initialized=""` o registrar la instancia en una `WeakMap` interna para evitar dobles ejecuciones con `initAll()`.

3. **Soporte de Sintaxis Simplificada Obligatorio (Single-Element / Auto-Scaffolding):**
   * **Objetivo:** Evitar verbosidad excesiva en el HTML de los desarrolladores. No obligar al usuario a escribir árboles de divs manuales cuando basta con un elemento semántico con atributos `data-*`.
   * **Regla de Coexistencia:** Todo componente compuesto debe aceptar **dos formas de invocación**:
     1. **Sintaxis Simplificada (Recomendada):** El usuario escribe un único elemento semántico:
        * `TextField`: `<input data-mtx="text-field" data-label="Nombre" data-variant="outlined" />`
        * `Select`: `<select data-mtx="select" data-label="País" data-variant="outlined"><option>...</option></select>`
        * `Checkbox`: `<input type="checkbox" data-mtx="checkbox" data-label="Acepto términos" />`
        * `Switch`: `<input type="checkbox" data-mtx="switch" data-label="Modo oscuro" />`
        * `Radio`: `<input type="radio" data-mtx="radio" name="plan" data-label="Plan Pro" />`
        * `Alert`: `<div data-mtx="alert" data-severity="success" data-title="Listo">Guardado</div>`
        * `Chip`: `<div data-mtx="chip" data-label="React" data-icon="code" data-deletable="true"></div>`
     2. **Sintaxis BEM Completa:** Si el DOM ya contiene la estructura manual (`.mtx-{nombre}`, wrappers internos, SVGs), el componente se acopla a los nodos existentes sin duplicarlos.
   * **Patrón de Implementación en JS:**
     En el constructor de la clase:
     ```javascript
     if (element.tagName === 'INPUT' || !element.classList.contains('mtx-component')) {
       this._scaffoldSingleElement(element);
     }
     ```
     El método `_scaffoldSingleElement`:
     - Crea el wrapper principal `.mtx-{nombre}` y lo inserta en el lugar de `element`.
     - Preserva y transfiere todos los atributos nativos (`id`, `name`, `type`, `value`, `required`, `disabled`, etc.).
     - **CRÍTICO:** Al transferir los atributos `class` (ej. `mtx-checkbox--small`) desde el input original al wrapper generado, **SE DEBE CONCATENAR** para no sobreescribir la clase base del wrapper (ej: usar `label.className += ' ' + attr.value;` en lugar de `setAttribute('class', ...)`).
     - Genera el contenedor interno, label flotante, muesca (`<fieldset>`) e iconos declarados en `data-start-icon` / `data-end-icon`.
     - Marca `data-mtx-initialized=""` de forma idempotente.

4. **Accesibilidad (A11y) Integrada:**
   * Roles ARIA (`role="alert"`, `role="dialog"`, etc.) solo donde HTML semántico no sea suficiente.
   * Gestión de foco con `:focus-visible` (anillo de foco con token `--mtx-focus-ring-color`).
   * Navegación por teclado completa (Enter, Space, Escape, flechas de dirección según el componente).

---

## 3. Checklist Obligatorio para Nuevos Componentes

Antes de dar por terminado cualquier componente, se deben completar todos y cada uno de los siguientes puntos:

- [ ] **1. CSS (`src/components/{nombre}/{nombre}.css`):**
  - Utilizar exclusivamente tokens de [src/styles/tokens.css](file:///d:/PERSONAL_FILES/PROJECTS/materix-ui/src/styles/tokens.css).
  - Nomenclatura BEM: `.mtx-{nombre}`, `.mtx-{nombre}--{variante}`, `.mtx-{nombre}__{elemento}`.
  - Soportar variantes (ej: `contained`, `outlined`, `text`).
  - Soportar estados: hover, active, focus-visible, disabled.
  - Soportar tema claro y oscuro mediante tokens CSS.
  - Respetar `@media (prefers-reduced-motion: reduce)`.
  - Respetar la regla de no distorsión de `.material-icons`.

- [ ] **2. JavaScript (`src/components/{nombre}/{nombre}.js`):**
  - Recibir elemento en el constructor.
  - Comentarios JSDoc en español.
  - Exponer API programática limpia (ej: `.open()`, `.close()`, `.disable()`, etc.).
  - Registrar con `registerComponent('{nombre}', {Clase})`.

- [ ] **3. Integración en el Bundle (`src/index.js`):**
  - Importar el archivo CSS y exportar la clase JS en [src/index.js](file:///d:/PERSONAL_FILES/PROJECTS/materix-ui/src/index.js).

- [ ] **4. Pruebas Unitarias (`tests/{nombre}.test.js`):**
  - Crear archivo de prueba con Vitest en `tests/`.
  - Verificar inicialización declarativa mediante `data-mtx`.
  - Verificar inicialización programática.
  - Verificar eventos, estados y métodos públicos.

- [ ] **5. Ejemplo Interactivo (`examples/{nombre}/index.html`):**
  - **Sintaxis Simplificada como regla general:** La primera sección debe demostrar obligatoriamente el uso de una sola línea (`data-mtx`, `data-label`, etc.). Además, **todo el resto del documento** (tamaños, colores, deshabilitados, etc.) **debe construirse utilizando la sintaxis simplificada**. El uso de la "Sintaxis Manual BEM" debe reservarse **únicamente** para una sección aislada de demostración avanzada o cuando sea estructuralmente imposible usar la sintaxis corta.
  - **Secciones explícitas para todos los tamaños:** Si el componente tiene 3 tamaños (Large 48px, Medium 40px, Small 32px), debe incluir una sección visual dedicada para cada tamaño.
  - **Secciones con y sin iconos:** Demostrar por separado: sin icono, con icono inicial (`data-start-icon`), con icono final (`data-end-icon`) y de solo icono.
  - **Todas las variantes y estados:** Demostrar todas las variantes (`outlined`, `filled`, `standard`, `contained`, etc.) y estados (normal, hover, focus-visible, active, disabled, error con helper text, read-only).
  - **Maquetación en grilla:** Demostrar integración responsiva con `mtx-grid`.
  - **Selector de tema y cache-buster:** Incluir `../shared/theme.js` para tema claro/oscuro y usar `?v=N` en los enlaces a `dist`.

- [ ] **6. Documentación Hugo (`docs/content/componentes/{nombre}.md`):**
  - **Sintaxis Simplificada destacada:** Bloques de código `{{< mtx-demo >}}` usando prioritariamente la sintaxis de una sola línea.
  - **Cobertura exhaustiva:** Ejemplos para todos los tamaños, todas las variantes visuales y casos con/sin icono.
  - **Explicación completa:** Anatomía, API programática, eventos públicos, clases BEM, atributos `data-*` y accesibilidad (ARIA, foco y teclado).

- [ ] **7. Compilación y Validación:**
  - Ejecutar `npm run build` (debe compilar limpiamente sin errores en `/dist`).
  - Ejecutar `npm test` (todos los tests deben pasar al 100%).
  - Comprobar renderizado real en navegador mediante herramientas DevTools.

---

## 5. Regla de Alcance para Tareas Generales (Consistencia con AGENTS.md §25)

> [!IMPORTANT]
> Cuando se soliciten tareas o revisiones **generales** (ej. actualizar ejemplos en `/examples`, actualizar documentación, añadir tests, etc.), **éstas deben aplicarse ÚNICAMENTE a los componentes que ya figuren como finalizados (`[x]`) en el checklist oficial de [AGENTS.md](file:///d:/PERSONAL_FILES/PROJECTS/materix-ui/AGENTS.md)** (actualmente **Button**, **Grid**, **Select** y **TextField**). Los componentes pendientes (`[ ]`) deben abordarse uno por uno cuando el usuario lo solicite explícitamente.


