/**
 * Página de ejemplo de Tooltip: monta las demos de demos/tooltip.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/tooltip/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="tooltip"
      title="Tooltip"
      description="Short informative label shown on hover, keyboard focus or long press. Wrap any element with `<Tooltip title>`: no extra markup or initialization."
      demos={demos}
    />
  </StrictMode>,
);
