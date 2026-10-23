/**
 * Tipos de Materix UI (`@rubenchodev/materix-ui`): bundle completo y global `Materix` (UMD).
 *
 * - Componentes: clases generadas desde el JSDoc de `src/` (`types/lib`).
 * - Núcleo refinado a mano: `./core.d.ts` (registro, tema, i18n, posicionamiento).
 * - Eventos `mtx:*` tipados: `./events.d.ts` (amplía `HTMLElementEventMap`).
 */
import type LibMaterix from './lib/index.js';
import type * as Core from './core.js';

export * from './lib/index.js';
export type * from './core.js';

// El núcleo refinado tiene prioridad sobre las declaraciones generadas.
export {
  registerComponent,
  getInstance,
  initElement,
  init,
  initAll,
  watch,
  destroy,
  destroyAll,
  ComponentBase,
  createRipple,
  theme,
  i18n,
  getLocale,
  setLocale,
  resetLocale,
  addLocale,
  updateLocale,
  t,
  getComponentLocale,
  computePosition,
  autoUpdate,
} from './core.js';

type CoreKeys =
  | 'registerComponent' | 'getInstance' | 'initElement' | 'init' | 'initAll' | 'watch'
  | 'destroy' | 'destroyAll' | 'theme' | 'i18n' | 'getLocale' | 'setLocale' | 'resetLocale' | 'addLocale'
  | 'updateLocale' | 't' | 'getComponentLocale' | 'computePosition' | 'autoUpdate';

/** Forma del objeto `Materix` (export por defecto y global UMD `window.Materix`). */
export interface MaterixStatic extends Omit<typeof LibMaterix, CoreKeys>, Pick<typeof Core, CoreKeys> {}

declare const Materix: MaterixStatic;
export default Materix;

/** Global del build UMD (`<script src="materix.umd.js">`). */
export as namespace Materix;
