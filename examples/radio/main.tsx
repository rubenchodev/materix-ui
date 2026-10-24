/** Página de ejemplo de Radio: monta todas las demos de demos/radio. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/radio/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="radio" title="Radio"
      description="Radio button to choose exactly one option from a visible group; RadioGroup reads and sets the group's value."
      demos={demos} />
  </StrictMode>,
);
