import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de button: monta las demos de demos/button. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/button/*.tsx', '!../../demos/button/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="button"
      title="Button"
      description="Action button with text, outlined and contained variants, three canonical heights (48/40/32px), palette colors, icons and loading state."
      demos={demos}
    />
  </StrictMode>,
);
