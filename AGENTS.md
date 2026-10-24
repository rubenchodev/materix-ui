# AGENTS.md — Materix UI para React (rama `react-js`)

Versión React de **Materix UI**. Replica 1:1 el diseño y el comportamiento de la versión vanilla
(rama `vainilla`, paquete `@rubenchodev/materix-ui`) con componentes **React nativos en TypeScript**.
Este documento es el **contrato** que siguen todos los agentes y desarrolladores.

---

## 1. Principios

* **Mismo diseño que vanilla.** El CSS NO se reescribe: se consume del paquete npm `@rubenchodev/materix-ui`
  (clases `.mtx-*` y tokens `--mtx-*`). Lo que se implementa en React es el marcado, el estado,
  la interacción, el foco y la accesibilidad.
* **Referencia obligatoria:** la versión vanilla está en el worktree de solo lectura
  `D:\PERSONAL_FILES\PROJECTS\materix-ui-vainilla` (`src/components/{slug}/{slug}.js|.css`,
  `tests/{slug}.test.js`, `examples/{slug}/index.html`, `docs/content/components/{slug}.{en,es}.md`,
  `types/events.d.ts`). **El DOM que renderiza React debe ser el mismo que deja el componente vanilla
  tras inicializarse** (mismas clases, misma jerarquía, mismos `aria-*`/`role`), porque el CSS depende de él.
* **MUI / Material Design 2** como referencia (AGENTS.md de vainilla §2 y §2.1: alturas canónicas,
  iconos de 24px, sin patrones MD3).
* **Accesibilidad desde el inicio** (semántica nativa, teclado, foco visible, ARIA solo cuando haga falta).
* **Sin dependencias de runtime** salvo `react`/`react-dom` (peer) y `@rubenchodev/materix-ui` (CSS).

## 2. Estructura

```text
src/
  core/                 hooks y piezas compartidas (oleada 0; API congelada)
  theme/                ThemeProvider, useTheme
  i18n/                 I18nProvider, useT, diccionarios en/es
  utils/                lógica pura portada de vanilla (pagination, masks, dates, slider…)
  components/{slug}/    {Name}.tsx (+ subcomponentes), index.ts, {slug}.test.tsx
  index.ts              barrel — SOLO lo edita el orquestador
demos/{slug}/NN-{name}.tsx   demos: fuente única para ejemplos y documentación
examples/{slug}/             página de ejemplo (index.html + main.tsx) que monta las demos del slug
docs/                        Hugo bilingüe (en por defecto, es en /es/) con demos React como islas
tests/                       setup, helpers (paridad con vanilla), e2e Playwright
```

`{slug}` es el mismo que en vanilla (`button`, `text-field`, `date-time-picker`…).

## 3. Contrato de componente

* Archivo `src/components/{slug}/{Name}.tsx`, exportado desde `src/components/{slug}/index.ts`
  junto con sus tipos (`{Name}Props`). Subcomponentes en el mismo directorio (`CardHeader.tsx`…).
* `forwardRef` al elemento raíz; `className` se **concatena** con las clases propias;
  `style` y `...rest` (atributos HTML) van al elemento raíz.
* **Props estilo MUI**: `variant`, `color`, `size`, `disabled`, `fullWidth`, `startIcon`, `endIcon`,
  `label`, `helperText`, `error`… Usa los mismos valores que los `data-*` de vanilla
  (`color="primary|secondary|error|warning|info|success|inherit"`, `size="small|medium|large"`).
  Los iconos son `ReactNode` (por ejemplo `<span className="material-icons">save</span>`); se acepta también
  un `string` con el nombre del icono de Material Icons cuando vanilla lo acepta (`data-start-icon="save"`).
* **Controlado / no controlado** con `useControlled` de `src/core`: `value`/`defaultValue`/`onChange`,
  `checked`/`defaultChecked`, `open`/`defaultOpen`/`onOpen`/`onClose`, `expanded`/`defaultExpanded`…
* **Eventos:** cada evento vanilla `mtx:{componente}:{acción}` (ver `types/events.d.ts` de vainilla)
  se expone como callback `on{Acción}` con argumentos equivalentes al `detail`
  (eventos cancelables → el callback puede devolver `false` o recibir un objeto con `preventDefault()`).
* **CSS:** el componente importa su hoja: `import '@rubenchodev/materix-ui/components/{slug}.css';`
  (y la de los componentes cuyo marcado reutiliza). `base.css` (tokens, base, ripple) lo importa la app una vez.
* **`'use client';`** al inicio de todo archivo que use estado, efectos o eventos (compatibilidad con Next.js).
* **SSR:** nada de `window`/`document` durante el render; solo en efectos. Ids con `useId`.
* **Nunca** pongas `data-mtx="…"` en el DOM (el CSS de vanilla oculta `[data-mtx='popover']:not([data-mtx-initialized])`).
* Imports internos **relativos** (`../../core`). Demos y ejemplos importan con el nombre del paquete:
  `import { Button } from '@rubenchodev/materix-react/components/button';` (alias a `src/`).
* **JSDoc en español**, breve (1-2 líneas) en cada componente, prop pública y hook. Código en inglés.

## 4. Tests (`src/components/{slug}/{slug}.test.tsx`)

* Vitest + Testing Library (`@testing-library/react`, `user-event`, `jest-dom`).
* Cubrir: render por defecto, variantes/tamaños/colores (clases), estados (disabled, error, selected…),
  controlado y no controlado, teclado, callbacks, ARIA, `ref` y `className` concatenado.
* **Paridad con vanilla** con el helper de `tests/parity.ts`: para los casos principales, comparar las
  clases y atributos ARIA del árbol React con los del componente vanilla inicializado.

## 5. Demos, ejemplos y documentación (obligatorio por componente)

* **Demos** `demos/{slug}/NN-{name}.tsx` (NN = orden de 2 dígitos): cada archivo hace
  `export default function Demo()` y `export const title = { en: '…', es: '…' };`.
  Mismas secciones que `examples/{slug}/index.html` de vanilla, en el mismo orden: uso básico primero,
  después variantes, tamaños, con/sin iconos, estados (disabled, error, read-only…), controlado,
  grilla y API programática cuando aplique.
* **Ejemplo** `examples/{slug}/index.html` + `main.tsx` siguiendo la plantilla de `examples/_template/`
  (monta todas las demos del slug con selector de tema claro/oscuro).
* **Documentación** `docs/content/components/{slug}.en.md` y `{slug}.es.md` con la misma estructura
  que la página vanilla equivalente, adaptada a React: importación, uso básico, demos con el shortcode
  `{{< react-demo "{slug}/NN-{name}" >}}`, tabla de props, callbacks, accesibilidad y equivalencia con
  la versión vanilla (`data-*` → props).

## 6. Reglas de coordinación entre agentes

* Cada agente edita **solo** sus carpetas: `src/components/{slug}/`, `demos/{slug}/`, `examples/{slug}/`,
  `docs/content/components/{slug}.{en,es}.md`. Nada más.
* `src/core`, `src/theme`, `src/i18n`, `src/utils`, `tests/` (salvo los tests propios), `src/index.ts`,
  `package.json`, `vite.config.ts`, `tsconfig.json` y `docs/` (salvo las páginas propias) **no se editan**:
  si falta algo, se reporta al orquestador.
* No ejecutar `npm install` ni `npm run build`; sí `npx tsc -p tsconfig.json --noEmit` y
  `npx vitest run src/components/{slug}`.
* No hacer commits.

## 7. Terminado (por componente)

Componente + subcomponentes, tipos exportados, tests (incluida paridad) en verde, demos que cubren
todas las secciones del ejemplo vanilla, ejemplo navegable, docs en/es con la misma estructura,
tema claro y oscuro, teclado y ARIA verificados, sin errores de `tsc`.
