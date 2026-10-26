import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de progress: monta las demos de demos/progress. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/progress/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="progress"
      title="Progress"
      description="Circular and linear indicators that show an operation is in progress or how much is left before it finishes."
      demos={demos}
    />
  </StrictMode>,
);
