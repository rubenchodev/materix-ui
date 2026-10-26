import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Popover: monta las demos de demos/popover.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/popover/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="popover"
      title="Popover"
      description="Floating Paper with arbitrary content anchored to a trigger. Closes on click away or Escape and returns focus to the trigger."
      demos={demos}
    />
  </StrictMode>,
);
