import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de stepper: monta las demos de demos/stepper. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/stepper/*.tsx', '!../../demos/stepper/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="stepper"
      title="Stepper"
      description="Shows progress through a sequence of numbered steps, horizontal or vertical, linear or with clickable steps, plus its compact mobile version."
      demos={demos}
    />
  </StrictMode>,
);
