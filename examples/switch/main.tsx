import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Switch: monta todas las demos de demos/switch. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/switch/*.tsx', '!../../demos/switch/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="switch" title="Switch"
      description="Toggle that turns an option on or off instantly, like a settings preference; uses role=&quot;switch&quot; on a native checkbox."
      demos={demos} />
  </StrictMode>,
);
