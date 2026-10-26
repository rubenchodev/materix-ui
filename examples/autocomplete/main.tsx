import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Autocomplete: monta todas las demos de demos/autocomplete. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/autocomplete/*.tsx', '!../../demos/autocomplete/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="autocomplete" title="Autocomplete"
      description="Text field with filterable suggestions: single or multiple selection with chips, free values, groups and asynchronous loading."
      demos={demos} />
  </StrictMode>,
);
