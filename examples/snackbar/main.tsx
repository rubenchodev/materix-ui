import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Snackbar: monta las demos de demos/snackbar.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/snackbar/*.tsx', '!../../demos/snackbar/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="snackbar"
      title="Snackbar"
      description="A brief, temporary notification at an edge of the screen that confirms an action and can offer to undo it, declarative or queued with useSnackbar()."
      demos={demos}
    />
  </StrictMode>,
);
