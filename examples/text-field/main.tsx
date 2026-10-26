import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de TextField: monta todas las demos de demos/text-field. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/text-field/*.tsx', '!../../demos/text-field/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="text-field"
      title="Text Field"
      description="Text field with a floating label, MUI variants, icons, counters, input masks and validation, declared with a single element."
      demos={demos}
    />
  </StrictMode>,
);
