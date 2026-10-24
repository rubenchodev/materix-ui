/**
 * Página de ejemplo de Menu: monta todas las demos de demos/menu.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/menu/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="menu"
      title="Menu"
      description="Temporary list of options anchored to a trigger, with keyboard navigation, checkable items, submenus and context menus."
      demos={demos}
    />
  </StrictMode>,
);
