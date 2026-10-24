/**
 * Islas React del sitio de documentación (Hugo).
 * Monta el `export default` de demos/{slug}/{nombre}.tsx en cada `[data-demo]` y las islas propias del sitio en `[data-island]`.
 */
import '@rubenchodev/materix-ui/base.css';
import '@rubenchodev/materix-ui/utilities.css';
import '../../examples/shared/demo-layout.css';
import { Component, StrictMode, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroDemo, type HeroDemoProps } from './HeroDemo';

/** Módulo de una demo: componente por defecto y metadatos opcionales. */
interface DemoModule {
  default: ComponentType;
  title?: Record<string, string>;
}

/** Cargadores perezosos (un chunk por demo) indexados por id "slug/nombre". */
const demoLoaders = new Map<string, () => Promise<DemoModule>>(
  Object.entries(import.meta.glob<DemoModule>('../../demos/*/*.tsx')).map(([path, load]) => [
    path.replace(/^.*\/demos\//, '').replace(/\.tsx$/, ''),
    load,
  ]),
);

/**
 * Lee un texto de interfaz inyectado por el layout en #doc-i18n.
 * @param {string} key Clave del texto.
 * @param {string} fallback Texto por defecto.
 * @returns {string} Texto traducido.
 */
function uiText(key: string, fallback: string): string {
  try {
    const data = JSON.parse(document.getElementById('doc-i18n')?.textContent ?? '{}') as Record<string, string>;
    return data[key] || fallback;
  } catch {
    return fallback;
  }
}

/** Aísla los fallos de una demo para que no rompan el resto de la página. */
class DemoBoundary extends Component<{ id: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[docs] demo "${this.props.id}"`, error, info.componentStack);
  }

  render(): ReactNode {
    return this.state.failed ? <p role="alert">{uiText('demoError', 'This demo could not be loaded.')}</p> : this.props.children;
  }
}

/**
 * Monta una demo en su escenario.
 * @param {HTMLElement} stage Elemento con data-demo.
 * @returns {Promise<void>} Se resuelve al montar.
 */
async function mountDemo(stage: HTMLElement): Promise<void> {
  const id = stage.dataset.demo ?? '';
  const load = demoLoaders.get(id);
  try {
    if (!load) throw new Error(`demo "${id}" not found in demos/`);
    const { default: Demo } = await load();
    createRoot(stage).render(
      <StrictMode>
        <DemoBoundary id={id}>
          <div className="mtx-root">
            <Demo />
          </div>
        </DemoBoundary>
      </StrictMode>,
    );
    stage.dataset.demoState = 'ready';
  } catch (error) {
    console.error('[docs]', error);
    stage.dataset.demoState = 'error';
    stage.textContent = uiText('demoError', 'This demo could not be loaded.');
  }
}

/**
 * Monta la isla de la portada; conserva el marcado estático si los props no son válidos.
 * @param {HTMLElement} el Elemento con data-island="hero".
 */
function mountHero(el: HTMLElement): void {
  try {
    const props = JSON.parse(el.dataset.islandProps ?? '{}') as HeroDemoProps;
    createRoot(el).render(
      <StrictMode>
        <HeroDemo {...props} />
      </StrictMode>,
    );
  } catch (error) {
    console.error('[docs] hero island', error);
  }
}

/** Busca y monta todas las islas de la página. */
function boot(): void {
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach((stage) => {
    void mountDemo(stage);
  });
  document.querySelectorAll<HTMLElement>('[data-island="hero"]').forEach(mountHero);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
