import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Dialog: monta las demos de demos/dialog.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/dialog/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="dialog"
      title="Dialog"
      description="A modal window that interrupts the task to ask for a decision or show critical information, with trapped focus and Escape to close."
      demos={demos}
    />
  </StrictMode>,
);
