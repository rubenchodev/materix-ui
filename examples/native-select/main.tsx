import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de NativeSelect: monta todas las demos de demos/native-select. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/native-select/*.tsx', '!../../demos/native-select/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="native-select" title="Native Select"
      description="The browser's `<select>` with MUI styling: standard, outlined and filled variants, floating label, 56/40px sizes, helper and error text, option groups and native multiple selection. Lightweight, accessible by default and with the system touch picker on mobile."
      demos={demos} />
  </StrictMode>,
);
