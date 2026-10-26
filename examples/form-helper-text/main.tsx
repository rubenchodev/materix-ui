import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de Form Helper Text: monta todas las demos de demos/form-helper-text. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/form-helper-text/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="form-helper-text" title="Form Helper Text"
      description="Helper and error text below a form control, plus FormControl and FormLabel to share error, disabled and required state."
      demos={demos} />
  </StrictMode>,
);
