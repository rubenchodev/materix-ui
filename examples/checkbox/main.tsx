import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Checkbox: monta todas las demos de demos/checkbox. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/checkbox/*.tsx', '!../../demos/checkbox/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="checkbox" title="Checkbox"
      description="A box for selecting one or more options from a list or confirming a condition; supports an indeterminate state."
      demos={demos} />
  </StrictMode>,
);
