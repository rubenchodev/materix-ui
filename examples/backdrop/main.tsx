import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Backdrop: monta las demos de demos/backdrop.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/backdrop/*.tsx', '!../../demos/backdrop/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="backdrop"
      title="Backdrop"
      description="A full-screen layer that dims the page and centers an indicator while an operation runs; it is not a dialog and Dialog reuses it as its background."
      demos={demos}
    />
  </StrictMode>,
);
