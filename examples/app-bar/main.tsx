import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de App Bar: monta todas las demos de demos/app-bar.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/app-bar/*.tsx', '!../../demos/app-bar/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="app-bar"
      title="App Bar"
      description="Top bar with the title, navigation and primary actions of the current screen: five positions, palette colors and elevation, dense and prominent Toolbars, elevate or hide on scroll, menus, search and a Drawer toggle."
      demos={demos}
    />
  </StrictMode>,
);
