import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Table: monta todas las demos de demos/table. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/table/*.tsx', '!../../demos/table/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="table"
      title="Table"
      description="Displays data sets in rows and columns on a semantic HTML table, with density, sticky header, sorting, selection and pagination."
      demos={demos}
    />
  </StrictMode>,
);
