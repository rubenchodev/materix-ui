import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Pagination: monta todas las demos de demos/pagination. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/pagination/*.tsx', '!../../demos/pagination/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="pagination" title="Pagination"
      description="Lets users pick a page within a large set of results. Same algorithm as MUI `usePagination`: ellipsis, `siblingCount`/`boundaryCount`, optional first/last buttons, `text`/`outlined` variants, two shapes, three sizes, three colors and a cancelable link mode (`getItemHref`) for SSR."
      demos={demos} />
  </StrictMode>,
);
