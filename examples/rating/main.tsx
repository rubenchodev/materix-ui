import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Rating: monta todas las demos de demos/rating. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/rating/*.tsx', '!../../demos/rating/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="rating" title="Rating"
      description="Star rating to review a product or display an average score: fractional precision, read-only mode, 18/24/30px SVG icons, custom icons, hover feedback and translated labels, accessible through native radios and the keyboard."
      demos={demos} />
  </StrictMode>,
);
