import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Tabs: monta todas las demos de demos/tabs. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/tabs/*.tsx', '!../../demos/tabs/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="tabs" title="Tabs"
      description="Tabs to switch between views at the same level. `TabContext` links `Tabs` with each `TabPanel`; the indicator slides under the active tab and the bar supports icons, full width, centered, vertical orientation, scrolling, cancelable changes (`onBeforeChange`) and WAI-ARIA keyboard navigation with roving tabindex."
      demos={demos} />
  </StrictMode>,
);
