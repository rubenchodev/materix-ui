import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de toggle-button: monta las demos de demos/toggle-button. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/toggle-button/*.tsx', '!../../demos/toggle-button/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="toggle-button"
      title="Toggle Button"
      description="Toggle buttons group related options with joined borders: `ToggleButtonGroup` handles exclusive or multiple selection, `enforceValueSet`, orientation, sizes, colors and arrow-key navigation, and a standalone `ToggleButton` switches a single action on and off with `aria-pressed`."
      demos={demos}
    />
  </StrictMode>,
);
